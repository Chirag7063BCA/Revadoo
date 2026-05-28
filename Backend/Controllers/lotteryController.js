const Lottery = require('../models/Lottery');
const LotteryTicket = require('../models/LotteryTicket');
const User = require('../models/User');
const mongoose = require('mongoose');

const SIX_DIGIT_PATTERN = /^\d{6}$/;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const toDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const validateAdminPayload = ({
  name,
  prizePool,
  entryFee,
  totalTickets,
  drawEndAt,
  publishAt,
}) => {
  const errors = {};

  if (!String(name || '').trim()) errors.name = 'Lottery name is required';
  if (!Number.isFinite(toNumber(prizePool)) || toNumber(prizePool) < 1) {
    errors.prizePool = 'Prize pool must be at least 1';
  }
  if (!Number.isFinite(toNumber(entryFee)) || toNumber(entryFee) < 0) {
    errors.entryFee = 'Entry fee must be zero or greater';
  }
  if (!Number.isFinite(toNumber(totalTickets)) || toNumber(totalTickets) < 1) {
    errors.totalTickets = 'Total tickets must be at least 1';
  }

  const publishDate = publishAt ? toDate(publishAt) : new Date();
  const drawDate = toDate(drawEndAt);

  if (!drawDate) {
    errors.drawEndAt = 'Draw ending date is required';
  } else if (drawDate.getTime() <= Date.now()) {
    errors.drawEndAt = 'Draw ending date must be in the future';
  }

  if (publishDate && drawDate && drawDate.getTime() <= publishDate.getTime()) {
    errors.drawEndAt = 'Draw ending date must be after publish date';
  }

  return {
    errors,
    publishDate,
    drawDate,
  };
};

const normalizeLottery = (lottery) => {
  if (!lottery) return lottery;
  const plain = lottery.toObject ? lottery.toObject() : lottery;
  if (plain.createdBy && plain.createdBy.password) {
    delete plain.createdBy.password;
  }
  return plain;
};

const pickRandomSoldTicket = async (lotteryId) => {
  const sampled = await LotteryTicket.aggregate([
    { $match: { lotteryId, status: 'sold' } },
    { $sample: { size: 1 } },
  ]);

  if (!sampled.length) {
    return null;
  }

  return LotteryTicket.findById(sampled[0]._id);
};

const finalizeLotteryIfExpired = async (lottery) => {
  if (!lottery || lottery.status !== 'published') {
    return lottery;
  }

  const drawEndAt = new Date(lottery.drawEndAt).getTime();
  if (!Number.isFinite(drawEndAt) || drawEndAt > Date.now()) {
    return lottery;
  }

  let winningTicket = null;

  if (lottery.winnerSelectionMode === 'manual' && lottery.preselectedWinningNumber) {
    winningTicket = await LotteryTicket.findOne({
      lotteryId: lottery._id,
      ticketNumber: lottery.preselectedWinningNumber,
    });
  }

  if (!winningTicket) {
    winningTicket = await pickRandomSoldTicket(lottery._id);
  }

  if (winningTicket) {
    winningTicket.isWinner = true;
    const updatedWinner = await creditWinningUser(winningTicket, lottery);

    lottery.winningNumber = winningTicket.ticketNumber;
    lottery.winningAmount = winningTicket.prizeAmount || 0;
    lottery.isAutoWinner = lottery.winnerSelectionMode !== 'manual';

    if (updatedWinner) {
      lottery.winnerCredsAwarded = winningTicket.prizeAmount || 0;
    }
  } else {
    lottery.winningNumber = null;
    lottery.winningAmount = 0;
    lottery.isAutoWinner = true;
  }

  lottery.status = 'announced';
  await lottery.save();
  return lottery;
};

const finalizeExpiredLotteries = async () => {
  const expiredLotteries = await Lottery.find({
    status: 'published',
    drawEndAt: { $lte: new Date() },
  });

  for (const lottery of expiredLotteries) {
    await finalizeLotteryIfExpired(lottery);
  }
};

const buildTicketNumberPool = (totalTickets, preGeneratedTicketNumbers = []) => {
  const isValidPreGenerated =
    Array.isArray(preGeneratedTicketNumbers) &&
    preGeneratedTicketNumbers.length === totalTickets &&
    preGeneratedTicketNumbers.every((number) => SIX_DIGIT_PATTERN.test(String(number))) &&
    new Set(preGeneratedTicketNumbers.map(String)).size === totalTickets;

  if (isValidPreGenerated) {
    return preGeneratedTicketNumbers.map(String);
  }

  const numbers = [];
  const used = new Set();

  while (numbers.length < totalTickets) {
    const candidate = String(Math.floor(100000 + Math.random() * 900000));
    if (used.has(candidate)) {
      continue;
    }

    used.add(candidate);
    numbers.push(candidate);
  }

  return numbers;
};

const ensureAdmin = (req, res) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Admin access required' });
    return false;
  }

  return true;
};

const getCreatedById = (req) => {
  const createdById = req.user?._id;
  return mongoose.Types.ObjectId.isValid(createdById) ? createdById : null;
};

const creditWinningUser = async (winningTicket, lottery) => {
  if (!winningTicket?.userId || !lottery) {
    return null;
  }

  const prizeAmount = winningTicket.status === 'sold' || winningTicket.status === 'claimed' ? lottery.prizePool : 0;
  winningTicket.prizeAmount = prizeAmount;
  await winningTicket.save();

  if (prizeAmount <= 0) {
    return null;
  }

  return User.findByIdAndUpdate(
    winningTicket.userId,
    { $inc: { creds: prizeAmount } },
    { returnDocument: 'after', select: 'creds username email' }
  );
};

exports.createLottery = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const {
      name,
      description = '',
      prizePool,
      entryFee,
      totalTickets,
      maxTicketsPerUser = 3,
      publishAt,
      drawEndAt,
      winnerSelectionMode = 'auto',
      preselectedWinningNumber = null,
      preGeneratedTicketNumbers = [],
    } = req.body || {};

    const { errors, publishDate, drawDate } = validateAdminPayload({
      name,
      prizePool,
      entryFee,
      totalTickets,
      drawEndAt,
      publishAt,
    });

    if (Object.keys(errors).length) {
      return res.status(400).json({ success: false, message: Object.values(errors)[0], errors });
    }

    if (!['auto', 'manual'].includes(winnerSelectionMode)) {
      return res.status(400).json({ success: false, message: 'Invalid winner selection mode' });
    }

    if (winnerSelectionMode === 'manual' && preselectedWinningNumber && !SIX_DIGIT_PATTERN.test(String(preselectedWinningNumber))) {
      return res.status(400).json({ success: false, message: 'Pre-set winning number must be a 6-digit number' });
    }

    if (Number(maxTicketsPerUser) < 1) {
      return res.status(400).json({ success: false, message: 'Max tickets per user must be at least 1' });
    }

    const lottery = await Lottery.create({
      name: String(name).trim(),
      description: String(description || '').trim(),
      prizePool: toNumber(prizePool),
      entryFee: toNumber(entryFee),
      totalTickets: toNumber(totalTickets),
      maxTicketsPerUser: Math.max(1, Number(maxTicketsPerUser) || 3),
      ticketsSold: 0,
      status: 'draft',
      publishAt: publishDate || new Date(),
      drawEndAt: drawDate,
      winnerSelectionMode,
      preselectedWinningNumber: preselectedWinningNumber ? String(preselectedWinningNumber).trim() : null,
      preGeneratedTicketNumbers: Array.isArray(preGeneratedTicketNumbers)
        ? preGeneratedTicketNumbers.map((number) => String(number).trim())
        : [],
      createdBy: getCreatedById(req),
    });

    return res.status(201).json({
      success: true,
      message: 'Lottery created successfully',
      data: normalizeLottery(lottery),
    });
  } catch (error) {
    console.error('Error creating lottery:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create lottery',
    });
  }
};

exports.updateLottery = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const { lotteryId } = req.params;
    const lottery = await Lottery.findById(lotteryId);

    if (!lottery) {
      return res.status(404).json({ success: false, message: 'Lottery not found' });
    }

    if (lottery.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Only draft lotteries can be edited' });
    }

    const updates = req.body || {};
    const draftPayload = {
      name: updates.name ?? lottery.name,
      prizePool: updates.prizePool ?? lottery.prizePool,
      entryFee: updates.entryFee ?? lottery.entryFee,
      totalTickets: updates.totalTickets ?? lottery.totalTickets,
      drawEndAt: updates.drawEndAt ?? lottery.drawEndAt,
      publishAt: updates.publishAt ?? lottery.publishAt,
    };

    const { errors, publishDate, drawDate } = validateAdminPayload(draftPayload);
    if (Object.keys(errors).length) {
      return res.status(400).json({ success: false, message: Object.values(errors)[0], errors });
    }

    if (updates.winnerSelectionMode && !['auto', 'manual'].includes(updates.winnerSelectionMode)) {
      return res.status(400).json({ success: false, message: 'Invalid winner selection mode' });
    }

    if (updates.preselectedWinningNumber && !SIX_DIGIT_PATTERN.test(String(updates.preselectedWinningNumber))) {
      return res.status(400).json({ success: false, message: 'Pre-set winning number must be a 6-digit number' });
    }

    const allowedKeys = [
      'name',
      'description',
      'prizePool',
      'entryFee',
      'totalTickets',
      'maxTicketsPerUser',
      'publishAt',
      'drawEndAt',
      'winnerSelectionMode',
      'preselectedWinningNumber',
      'preGeneratedTicketNumbers',
    ];

    for (const key of allowedKeys) {
      if (updates[key] === undefined) {
        continue;
      }

      if (key === 'publishAt') {
        lottery.publishAt = publishDate;
        continue;
      }

      if (key === 'drawEndAt') {
        lottery.drawEndAt = drawDate;
        continue;
      }

      if (key === 'maxTicketsPerUser') {
        lottery.maxTicketsPerUser = Math.max(1, Number(updates.maxTicketsPerUser) || lottery.maxTicketsPerUser);
        continue;
      }

      if (key === 'prizePool' || key === 'entryFee' || key === 'totalTickets') {
        lottery[key] = toNumber(updates[key]);
        continue;
      }

      if (key === 'preGeneratedTicketNumbers' && Array.isArray(updates[key])) {
        lottery[key] = updates[key].map((number) => String(number).trim());
        continue;
      }

      lottery[key] = updates[key];
    }

    await lottery.save();

    return res.status(200).json({
      success: true,
      message: 'Lottery updated successfully',
      data: normalizeLottery(lottery),
    });
  } catch (error) {
    console.error('Error updating lottery:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update lottery',
    });
  }
};

exports.getAllLotteries = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const lotteries = await Lottery.find()
      .populate('createdBy', 'username email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: lotteries.map(normalizeLottery),
    });
  } catch (error) {
    console.error('Error fetching lotteries:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch lotteries',
    });
  }
};

exports.publishLottery = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const { lotteryId } = req.params;
    const lottery = await Lottery.findById(lotteryId);

    if (!lottery) {
      return res.status(404).json({ success: false, message: 'Lottery not found' });
    }

    if (lottery.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Lottery is already published' });
    }

    const ticketNumbers = buildTicketNumberPool(lottery.totalTickets, lottery.preGeneratedTicketNumbers);

    await LotteryTicket.deleteMany({ lotteryId: lottery._id });

    const tickets = ticketNumbers.map((ticketNumber) => ({
      lotteryId: lottery._id,
      ticketNumber,
      status: 'available',
    }));

    await LotteryTicket.insertMany(tickets, { ordered: true });

    lottery.status = 'published';
    if (!lottery.publishAt) {
      lottery.publishAt = new Date();
    }
    await lottery.save();

    return res.status(200).json({
      success: true,
      message: `Lottery published with ${lottery.totalTickets} tickets`,
      data: normalizeLottery(lottery),
    });
  } catch (error) {
    console.error('Error publishing lottery:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to publish lottery',
    });
  }
};

exports.getLotteryTickets = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const { lotteryId } = req.params;
    const status = String(req.query.status || '').trim();
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    const lottery = await Lottery.findById(lotteryId);
    if (!lottery) {
      return res.status(404).json({ success: false, message: 'Lottery not found' });
    }

    const statsQuery = { lotteryId: lottery._id };
    const [total, available, sold, claimed] = await Promise.all([
      LotteryTicket.countDocuments(statsQuery),
      LotteryTicket.countDocuments({ ...statsQuery, status: 'available' }),
      LotteryTicket.countDocuments({ ...statsQuery, status: 'sold' }),
      LotteryTicket.countDocuments({ ...statsQuery, status: 'claimed' }),
    ]);

    const ticketsQuery = { lotteryId: lottery._id };
    if (['available', 'sold', 'claimed'].includes(status)) {
      ticketsQuery.status = status;
    }

    const [tickets, filteredTotal] = await Promise.all([
      LotteryTicket.find(ticketsQuery)
        .sort({ ticketNumber: 1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'username email'),
      LotteryTicket.countDocuments(ticketsQuery),
    ]);

    return res.status(200).json({
      success: true,
      data: tickets,
      stats: { total, available, sold, claimed },
      pagination: {
        page,
        limit,
        total: filteredTotal,
        totalPages: Math.max(1, Math.ceil(filteredTotal / limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching lottery tickets:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch lottery tickets',
    });
  }
};

exports.announceLottery = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const { lotteryId } = req.params;
    const { autoSelect = false, manualWinningNumber = '' } = req.body || {};

    const lottery = await Lottery.findById(lotteryId);
    if (!lottery) {
      return res.status(404).json({ success: false, message: 'Lottery not found' });
    }

    if (lottery.status !== 'published') {
      return res.status(400).json({ success: false, message: 'Only published lotteries can be announced' });
    }

    let winningTicket = null;

    if (autoSelect) {
      winningTicket = await pickRandomSoldTicket(lottery._id);
    } else {
      const winningNumber = String(manualWinningNumber || '').trim();
      if (!SIX_DIGIT_PATTERN.test(winningNumber)) {
        return res.status(400).json({ success: false, message: 'manualWinningNumber must be a 6-digit number' });
      }

      winningTicket = await LotteryTicket.findOne({ lotteryId: lottery._id, ticketNumber: winningNumber });
      if (!winningTicket) {
        return res.status(400).json({ success: false, message: 'Winning ticket not found for this lottery' });
      }
    }

    if (winningTicket) {
      winningTicket.isWinner = true;
      const updatedWinner = await creditWinningUser(winningTicket, lottery);

      lottery.winningNumber = winningTicket.ticketNumber;
      lottery.winningAmount = winningTicket.prizeAmount || 0;
      lottery.isAutoWinner = Boolean(autoSelect);

      if (updatedWinner) {
        lottery.winnerCredsAwarded = winningTicket.prizeAmount || 0;
      }
    } else {
      lottery.winningNumber = null;
      lottery.winningAmount = 0;
      lottery.isAutoWinner = Boolean(autoSelect);
    }

    lottery.status = 'announced';
    await lottery.save();

    return res.status(200).json({
      success: true,
      message: 'Lottery announced successfully',
      data: normalizeLottery(lottery),
      winningTicket: winningTicket ? normalizeLottery(winningTicket) : null,
    });
  } catch (error) {
    console.error('Error announcing lottery:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to announce lottery',
    });
  }
};

exports.deleteLottery = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const { lotteryId } = req.params;
    const lottery = await Lottery.findById(lotteryId);

    if (!lottery) {
      return res.status(404).json({ success: false, message: 'Lottery not found' });
    }

    if (lottery.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Only draft lotteries can be deleted' });
    }

    await LotteryTicket.deleteMany({ lotteryId: lottery._id });
    await Lottery.findByIdAndDelete(lotteryId);

    return res.status(200).json({
      success: true,
      message: 'Lottery deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lottery:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete lottery',
    });
  }
};

exports.getPublishedLotteries = async (req, res) => {
  try {
    await finalizeExpiredLotteries();

    const now = new Date();
    const lotteries = await Lottery.find({
      status: { $in: ['published', 'announced'] },
      publishAt: { $lte: now },
    })
      .sort({ drawEndAt: 1 })
      .populate('createdBy', 'username email role');

    return res.status(200).json({
      success: true,
      data: lotteries.map(normalizeLottery),
    });
  } catch (error) {
    console.error('Error fetching published lotteries:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch published lotteries',
    });
  }
};

exports.buyTicket = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { lotteryId } = req.params;

    const lottery = await Lottery.findById(lotteryId);
    if (!lottery) {
      return res.status(404).json({ success: false, message: 'Lottery not found' });
    }

    if (lottery.status !== 'published') {
      return res.status(400).json({ success: false, message: 'This lottery is not available for purchase' });
    }

    if (!lottery.drawEndAt || new Date(lottery.drawEndAt).getTime() <= Date.now()) {
      return res.status(400).json({ success: false, message: 'This lottery has already ended' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if ((user.creds || 0) < lottery.entryFee) {
      return res.status(400).json({ success: false, message: 'Insufficient creds' });
    }

    const userTicketCount = await LotteryTicket.countDocuments({
      lotteryId: lottery._id,
      userId: user._id,
      status: { $in: ['sold', 'claimed'] },
    });

    if (userTicketCount >= lottery.maxTicketsPerUser) {
      return res.status(400).json({
        success: false,
        message: `You can only buy ${lottery.maxTicketsPerUser} tickets per lottery`,
      });
    }

    const claimedTicket = await LotteryTicket.findOneAndUpdate(
      { lotteryId: lottery._id, status: 'available' },
      {
        $set: {
          userId: user._id,
          userName: user.username,
          userEmail: user.email,
          purchasedAt: new Date(),
          purchasePrice: lottery.entryFee,
          status: 'sold',
        },
      },
      { returnDocument: 'after' }
    );

    if (!claimedTicket) {
      return res.status(400).json({ success: false, message: 'No available tickets' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, creds: { $gte: lottery.entryFee } },
      { $inc: { creds: -lottery.entryFee } },
      { returnDocument: 'after', select: 'creds username email' }
    );

    if (!updatedUser) {
      await LotteryTicket.findByIdAndUpdate(claimedTicket._id, {
        $set: {
          userId: null,
          userName: null,
          userEmail: null,
          purchasedAt: null,
          purchasePrice: 0,
          status: 'available',
          isWinner: false,
          prizeAmount: 0,
        },
      });

      return res.status(400).json({ success: false, message: 'Insufficient creds' });
    }

    lottery.ticketsSold += 1;
    await lottery.save();

    return res.status(200).json({
      success: true,
      message: 'Ticket purchased successfully',
      data: {
        ticket: claimedTicket,
        newCreds: updatedUser.creds,
      },
    });
  } catch (error) {
    console.error('Error buying lottery ticket:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to buy ticket',
    });
  }
};

exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.user?._id;
    await finalizeExpiredLotteries();

    const tickets = await LotteryTicket.find({ userId })
      .sort({ purchasedAt: -1 })
      .populate('lotteryId', 'name prizePool drawEndAt status winningNumber');

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user tickets',
    });
  }
};

exports.getLotteryResults = async (req, res) => {
  try {
    await finalizeExpiredLotteries();

    const lotteries = await Lottery.find({
      status: { $in: ['announced', 'completed'] },
    })
      .sort({ drawEndAt: -1 })
      .populate('createdBy', 'username email role');

    return res.status(200).json({
      success: true,
      data: lotteries.map(normalizeLottery),
    });
  } catch (error) {
    console.error('Error fetching lottery results:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch lottery results',
    });
  }
};

exports.finalizeLotteryIfExpired = finalizeLotteryIfExpired;