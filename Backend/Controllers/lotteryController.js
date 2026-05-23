const Lottery = require('../models/Lottery');
const LotteryTicket = require('../models/LotteryTicket');
const User = require('../models/User');

/**
 * Helper to generate unique random 6-digit ticket numbers
 */
const generateTicketNumber = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

const pickAutoWinningTicket = async (lotteryId) => {
  const soldSample = await LotteryTicket.aggregate([
    { $match: { lotteryId, status: 'sold' } },
    { $sample: { size: 1 } },
  ]);

  if (soldSample?.length) {
    return LotteryTicket.findById(soldSample[0]._id);
  }

  const anySample = await LotteryTicket.aggregate([
    { $match: { lotteryId } },
    { $sample: { size: 1 } },
  ]);

  return anySample?.length ? LotteryTicket.findById(anySample[0]._id) : null;
};

const finalizeLotteryIfExpired = async (lottery) => {
  if (!lottery || lottery.status !== 'published' || !lottery.drawEndAt) {
    return lottery;
  }

  if (new Date(lottery.drawEndAt).getTime() > Date.now()) {
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
    winningTicket = await pickAutoWinningTicket(lottery._id);
  }

  if (!winningTicket) {
    lottery.status = 'announced';
    lottery.winningNumber = null;
    lottery.winningAmount = 0;
    await lottery.save();
    return lottery;
  }

  winningTicket.isWinner = true;
  winningTicket.prizeAmount = winningTicket.status === 'sold' ? lottery.prizePool : 0;
  await winningTicket.save();

  lottery.winningNumber = winningTicket.ticketNumber;
  lottery.winningAmount = winningTicket.status === 'sold' ? lottery.prizePool : 0;
  lottery.status = 'announced';
  lottery.isAutoWinner = lottery.winnerSelectionMode !== 'manual';
  await lottery.save();

  return lottery;
};

/**
 * ADMIN: Create a new lottery (draft state)
 */
exports.createLottery = async (req, res) => {
  try {
    const {
      name,
      description,
      prizePool,
      entryFee,
      totalTickets,
      publishAt,
      drawEndAt,
      winnerSelectionMode,
      preselectedWinningNumber,
      preGeneratedTicketNumbers,
    } = req.body;
    const adminId = req.user?._id || req.user?.id || req.user?.userId || null;

    const lottery = new Lottery({
      name,
      description,
      prizePool: Number(prizePool),
      entryFee: Number(entryFee),
      totalTickets: Number(totalTickets),
      drawDateTime: drawEndAt ? new Date(drawEndAt) : null,
      publishAt: publishAt || new Date(),
      drawEndAt,
      winnerSelectionMode: winnerSelectionMode || 'auto',
      preselectedWinningNumber: preselectedWinningNumber || null,
      preGeneratedTicketNumbers: Array.isArray(preGeneratedTicketNumbers)
        ? preGeneratedTicketNumbers
        : [],
      createdBy: adminId || undefined,
    });

    await lottery.save();

    return res.status(201).json({
      success: true,
      message: 'Lottery created successfully',
      data: lottery,
    });
  } catch (error) {
    console.error('Error creating lottery:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create lottery',
    });
  }
};

/**
 * ADMIN: Get all lotteries (for admin dashboard)
 */
exports.getAllLotteries = async (req, res) => {
  try {
    const lotteries = await Lottery.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: lotteries,
    });
  } catch (error) {
    console.error('Error fetching lotteries:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch lotteries',
    });
  }
};

/**
 * ADMIN: Publish lottery (generate all tickets)
 */
exports.publishLottery = async (req, res) => {
  try {
    const { lotteryId } = req.params;

    const lottery = await Lottery.findById(lotteryId);
    if (!lottery) {
      return res.status(404).json({ success: false, message: 'Lottery not found' });
    }

    if (lottery.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft lotteries can be published',
      });
    }

    // Generate all tickets (use pre-generated numbers from admin wizard when valid)
    const tickets = [];
    const ticketNumbers = new Set();
    const predefined = Array.isArray(lottery.preGeneratedTicketNumbers)
      ? lottery.preGeneratedTicketNumbers
      : [];

    if (predefined.length === lottery.totalTickets) {
      for (const ticketNumber of predefined) {
        if (ticketNumbers.has(ticketNumber)) {
          return res.status(400).json({
            success: false,
            message: 'Duplicate pre-generated ticket numbers found',
          });
        }
        ticketNumbers.add(ticketNumber);
        tickets.push({
          lotteryId,
          ticketNumber,
          status: 'available',
        });
      }
    } else {
      for (let i = 0; i < lottery.totalTickets; i++) {
        let ticketNumber;
        do {
          ticketNumber = generateTicketNumber();
        } while (ticketNumbers.has(ticketNumber));

        ticketNumbers.add(ticketNumber);
        tickets.push({
          lotteryId,
          ticketNumber,
          status: 'available',
        });
      }
    }

    await LotteryTicket.insertMany(tickets);

    lottery.status = 'published';
    await lottery.save();

    return res.status(200).json({
      success: true,
      message: `Lottery published with ${lottery.totalTickets} tickets`,
      data: lottery,
    });
  } catch (error) {
    console.error('Error publishing lottery:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to publish lottery',
    });
  }
};

/**
 * ADMIN: Get all lottery tickets (for admin dashboard)
 */
exports.getLotteryTickets = async (req, res) => {
  try {
    const { lotteryId } = req.params;
    const { status, limit = 100, skip = 0 } = req.query;

    const query = { lotteryId };
    if (status) query.status = status;

    const tickets = await LotteryTicket.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const total = await LotteryTicket.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: tickets,
      pagination: { total, limit: parseInt(limit), skip: parseInt(skip) },
    });
  } catch (error) {
    console.error('Error fetching lottery tickets:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tickets',
    });
  }
};

/**
 * ADMIN: Announce lottery with auto-selected or manual winner
 */
exports.announceLottery = async (req, res) => {
  try {
    const { lotteryId } = req.params;
    const { winningTicketId, manualWinningNumber, autoSelect = false } = req.body;

    const lottery = await Lottery.findById(lotteryId);
    if (!lottery) {
      return res.status(404).json({ success: false, message: 'Lottery not found' });
    }

    if (lottery.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Only published lotteries can be announced',
      });
    }

    let winningTicket;

    if (autoSelect) {
      // Auto-select a random sold ticket
      const sampled = await LotteryTicket.aggregate([
        { $match: { lotteryId: lottery._id, status: 'sold' } },
        { $sample: { size: 1 } },
      ]);

      winningTicket = sampled?.length
        ? await LotteryTicket.findById(sampled[0]._id)
        : null;

      if (!winningTicket) {
        return res.status(400).json({
          success: false,
          message: 'No sold tickets available for auto-selection',
        });
      }

      lottery.isAutoWinner = true;
    } else {
      // Manual selection
      const resolvedManualWinningNumber =
        manualWinningNumber || lottery.preselectedWinningNumber || null;

      if (!winningTicketId && !resolvedManualWinningNumber) {
        return res.status(400).json({
          success: false,
          message: 'Winning ticket ID or winning number is required for manual selection',
        });
      }

      winningTicket = winningTicketId
        ? await LotteryTicket.findById(winningTicketId)
        : await LotteryTicket.findOne({
            lotteryId,
            ticketNumber: resolvedManualWinningNumber,
          });

      if (!winningTicket) {
        return res.status(404).json({ success: false, message: 'Winning ticket not found' });
      }

      lottery.isAutoWinner = false;
    }

    // Mark ticket as winner
    winningTicket.isWinner = true;
    winningTicket.prizeAmount = winningTicket.status === 'sold' ? lottery.prizePool : 0;
    await winningTicket.save();

    // Update lottery
    lottery.winningNumber = winningTicket.ticketNumber;
    lottery.winningAmount = winningTicket.status === 'sold' ? lottery.prizePool : 0;
    lottery.status = 'announced';
    await lottery.save();

    return res.status(200).json({
      success: true,
      message: 'Lottery announced successfully',
      data: {
        lottery,
        winningTicket,
      },
    });
  } catch (error) {
    console.error('Error announcing lottery:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to announce lottery',
    });
  }
};

/**
 * USER: Get all published lotteries
 */
exports.getPublishedLotteries = async (req, res) => {
  try {
    const now = new Date();
    const publishedOrAnnounced = await Lottery.find({
      status: { $in: ['published', 'announced'] },
      publishAt: { $lte: now },
    })
      .populate('createdBy', 'name email')
      .sort({ drawEndAt: 1 });

    const lotteries = [];
    for (const lottery of publishedOrAnnounced) {
      const finalized = await finalizeLotteryIfExpired(lottery);
      lotteries.push(finalized);
    }

    return res.status(200).json({
      success: true,
      data: lotteries,
    });
  } catch (error) {
    console.error('Error fetching lotteries:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch lotteries',
    });
  }
};

/**
 * USER: Buy a lottery ticket
 */
exports.buyTicket = async (req, res) => {
  try {
    const { lotteryId } = req.params;
    const userId = req.user?._id || req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Get lottery
    const lottery = await Lottery.findById(lotteryId);
    if (!lottery) {
      return res.status(404).json({ success: false, message: 'Lottery not found' });
    }

    if (lottery.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'This lottery is not available for purchase',
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find an available ticket
    const availableTicket = await LotteryTicket.findOneAndUpdate(
      { lotteryId, status: 'available' },
      {
        userId,
        userName: user.name || user.username || 'Anonymous',
        userEmail: user.email,
        purchasedAt: new Date(),
        purchasePrice: lottery.entryFee,
        status: 'sold',
      },
      { new: true }
    );

    if (!availableTicket) {
      return res.status(400).json({
        success: false,
        message: 'No available tickets for this lottery',
      });
    }

    // Update lottery tickets sold count
    lottery.ticketsSold += 1;
    await lottery.save();

    return res.status(200).json({
      success: true,
      message: 'Ticket purchased successfully',
      data: availableTicket,
    });
  } catch (error) {
    console.error('Error buying ticket:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to buy ticket',
    });
  }
};

/**
 * USER: Get user's lottery tickets
 */
exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const expiring = await Lottery.find({
      status: 'published',
      drawEndAt: { $lte: new Date() },
    });

    for (const lottery of expiring) {
      await finalizeLotteryIfExpired(lottery);
    }

    const tickets = await LotteryTicket.find({ userId })
      .populate('lotteryId', 'name prizePool entryFee drawDateTime status winningNumber')
      .sort({ purchasedAt: -1 });

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

/**
 * USER/ADMIN: Get lottery results
 */
exports.getLotteryResults = async (req, res) => {
  try {
    const expiring = await Lottery.find({
      status: 'published',
      drawEndAt: { $lte: new Date() },
    });

    for (const lottery of expiring) {
      await finalizeLotteryIfExpired(lottery);
    }

    const lotteries = await Lottery.find({
      status: { $in: ['announced', 'completed'] },
    }).sort({ drawEndAt: -1 });

    return res.status(200).json({
      success: true,
      data: lotteries,
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch results',
    });
  }
};

/**
 * ADMIN: Update lottery (for editing draft lotteries)
 */
exports.updateLottery = async (req, res) => {
  try {
    const { lotteryId } = req.params;
    const updates = req.body;

    const lottery = await Lottery.findById(lotteryId);
    if (!lottery) {
      return res.status(404).json({ success: false, message: 'Lottery not found' });
    }

    if (lottery.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft lotteries can be edited',
      });
    }

    Object.assign(lottery, updates);
    await lottery.save();

    return res.status(200).json({
      success: true,
      message: 'Lottery updated successfully',
      data: lottery,
    });
  } catch (error) {
    console.error('Error updating lottery:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update lottery',
    });
  }
};

/**
 * ADMIN: Delete draft lottery
 */
exports.deleteLottery = async (req, res) => {
  try {
    const { lotteryId } = req.params;

    const lottery = await Lottery.findById(lotteryId);
    if (!lottery) {
      return res.status(404).json({ success: false, message: 'Lottery not found' });
    }

    if (lottery.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft lotteries can be deleted',
      });
    }

    await Lottery.findByIdAndDelete(lotteryId);
    await LotteryTicket.deleteMany({ lotteryId });

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
