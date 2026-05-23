// walletController.js
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const BankAccount = require("../models/BankAccount");
const WithdrawalRequest = require("../models/WithdrawalRequest");
const Stripe = require("stripe");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { encryptAccountNumber } = require("../utils/encryption");
const {
  sendConversionEmail,
  sendWithdrawalRequestEmail,
  sendWithdrawalCompletedEmail,
  sendWithdrawalFailedEmail,
  sendSecurityAlertEmail,
} = require("../utils/emailService");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({ userId });
  }
  return wallet;
};

const generateReferenceId = () => {
  return "REF" + Date.now() + crypto.randomBytes(3).toString("hex").toUpperCase();
};

const normalizeUserId = (value) => (value ? String(value) : null);

const mapTransactionQuery = (type) => {
  if (type === "credits") return { type: "credit" };
  if (type === "conversions") return { type: "conversion" };
  if (type === "withdrawals") return { type: "debit", category: "withdrawal" };
  if (type === "credit" || type === "debit" || type === "conversion") {
    return { type };
  }
  return {};
};

const getBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await getOrCreateWallet(userId);
    const pending = await WithdrawalRequest.aggregate([
      { $match: { userId: wallet.userId, status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const balance = {
      balance: wallet.balance,
      creds: wallet.creds,
      totalEarned: wallet.totalEarned,
      totalWithdrawn: wallet.totalWithdrawn,
      pendingWithdrawals: pending[0]?.total || 0,
    };

    res.json({ wallet: balance, ...balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, type = "all", status = "all" } = req.query;
    const query = { userId: normalizeUserId(userId) };

    Object.assign(query, mapTransactionQuery(type));
    if (status !== "all") query.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Transaction.countDocuments(query),
    ]);

    res.json({
      success: true,
      transactions,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addMoney = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ message: "userId and amount required" });
    }

    const wallet = await getOrCreateWallet(userId);
    const value = Number(amount);
    wallet.balance += value;
    wallet.totalEarned += value;
    await wallet.save();

    await Transaction.create({
      userId,
      type: "credit",
      amount: value,
      description: "Money Added",
      status: "completed",
      category: "stripe_topup",
    });

    res.json({ message: "Money added successfully", balance: wallet.balance, wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const withdrawMoney = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const wallet = await getOrCreateWallet(userId);
    const value = Number(amount);

    if (wallet.balance < value) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= value;
    wallet.totalWithdrawn += value;
    await wallet.save();

    await Transaction.create({
      userId,
      type: "debit",
      amount: value,
      description: "Withdraw",
      status: "completed",
      category: "withdrawal",
    });

    res.json({ message: "Withdraw successful", balance: wallet.balance, wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const convertCreds = async (req, res) => {
  try {
    const { userId, credsToConvert } = req.body;
    const minimum = parseInt(process.env.MIN_CREDS_CONVERSION, 10) || 500;
    const rate = parseFloat(process.env.CREDS_TO_INR_RATE) || 0.05;

    if (!userId || !credsToConvert) {
      return res.status(400).json({ message: "userId and credsToConvert required" });
    }

    const value = Number(credsToConvert);
    const wallet = await getOrCreateWallet(userId);

    if (wallet.creds < minimum) {
      return res.status(400).json({
        message: `Minimum ${minimum} Creds required to convert`,
      });
    }

    if (wallet.creds < value) {
      return res.status(400).json({ message: "Insufficient Creds balance" });
    }

    const inrAmount = parseFloat((value * rate).toFixed(2));
    wallet.creds -= value;
    wallet.balance += inrAmount;
    wallet.totalEarned += inrAmount;
    await wallet.save();

    await Transaction.create({
      userId,
      type: "conversion",
      amount: inrAmount,
      credsAmount: value,
      description: `${value} Creds converted to cash`,
      status: "completed",
      category: "creds_conversion",
    });

    const user = await User.findById(userId);
    if (user) {
      sendConversionEmail(user, {
        credsConverted: value,
        newWalletBalance: wallet.balance,
      }).catch(() => {});
    }

    res.json({
      message: "Creds converted successfully",
      newWalletBalance: wallet.balance,
      newCredsBalance: wallet.creds,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const setWithdrawalPin = async (req, res) => {
  try {
    const { userId, pin } = req.body;
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: "PIN must be exactly 4 digits" });
    }

    const hashed = await bcrypt.hash(pin, 12);
    const wallet = await getOrCreateWallet(userId);
    wallet.withdrawalPin = hashed;
    wallet.withdrawalPinAttempts = 0;
    wallet.withdrawalPinLockedUntil = null;
    await wallet.save();

    const user = await User.findById(userId);
    if (user) {
      sendSecurityAlertEmail(user, {
        action: "Withdrawal PIN Set/Changed",
        ipAddress: req.ip,
      }).catch(() => {});
    }

    res.json({ message: "Withdrawal PIN set successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyWithdrawalPin = async (req, res) => {
  try {
    const { userId, pin } = req.body;
    const wallet = await getOrCreateWallet(userId);

    if (!wallet.withdrawalPin) {
      return res.status(400).json({ message: "No withdrawal PIN set. Please set a PIN first." });
    }

    if (wallet.withdrawalPinLockedUntil && wallet.withdrawalPinLockedUntil > new Date()) {
      const minutesLeft = Math.ceil((wallet.withdrawalPinLockedUntil - new Date()) / 60000);
      return res.status(423).json({
        message: `PIN locked. Try again in ${minutesLeft} minute(s).`,
      });
    }

    const match = await bcrypt.compare(pin, wallet.withdrawalPin);
    if (!match) {
      wallet.withdrawalPinAttempts += 1;
      if (wallet.withdrawalPinAttempts >= 5) {
        wallet.withdrawalPinLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        wallet.withdrawalPinAttempts = 0;
        await wallet.save();

        const user = await User.findById(userId);
        if (user) {
          sendSecurityAlertEmail(user, {
            action: "Withdrawal PIN locked after 5 failed attempts",
            ipAddress: req.ip,
          }).catch(() => {});
        }

        return res.status(423).json({
          message: "Too many wrong attempts. PIN locked for 30 minutes.",
        });
      }

      await wallet.save();
      return res.status(401).json({
        message: `Wrong PIN. ${5 - wallet.withdrawalPinAttempts} attempts remaining.`,
      });
    }

    wallet.withdrawalPinAttempts = 0;
    wallet.withdrawalPinLockedUntil = null;
    await wallet.save();

    const withdrawalToken = jwt.sign(
      { userId, purpose: "withdrawal" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.json({ withdrawalToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const withdrawToBank = async (req, res) => {
  try {
    const { userId, amount, method, bankAccountId, upiId, withdrawalToken, bankDetails } = req.body;
    const minimum = parseInt(process.env.MIN_WITHDRAWAL_INR, 10) || 100;

    let decoded;
    try {
      decoded = jwt.verify(withdrawalToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Withdrawal session expired. Please verify your PIN again." });
    }

    if (decoded.userId !== userId || decoded.purpose !== "withdrawal") {
      return res.status(401).json({ message: "Invalid withdrawal token." });
    }

    const value = parseFloat(amount);
    if (!value || value < minimum) {
      return res.status(400).json({ message: `Minimum withdrawal is ₹${minimum}` });
    }

    const wallet = await getOrCreateWallet(userId);
    if (wallet.balance < value) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    const existingPending = await WithdrawalRequest.findOne({ userId, status: "pending" });
    if (existingPending) {
      return res.status(400).json({
        message: "You already have a pending withdrawal. Wait for it to complete.",
      });
    }

    let withdrawalDetails = { method };
    let accountDisplay = "";

    if (method === "bank_transfer") {
      if (bankAccountId) {
        const bank = await BankAccount.findOne({ _id: bankAccountId, userId });
        if (!bank) {
          return res.status(404).json({ message: "Bank account not found" });
        }

        withdrawalDetails = {
          method: "bank_transfer",
          accountHolderName: bank.accountHolderName,
          accountNumberLast4: bank.accountNumberLast4,
          ifscCode: bank.ifscCode,
          bankName: bank.bankName,
        };
        accountDisplay = `${bank.bankName} ****${bank.accountNumberLast4}`;
      } else if (bankDetails) {
        const last4 = String(bankDetails.accountNumber || "").slice(-4);
        if (!last4 || !bankDetails.accountHolderName || !bankDetails.ifscCode || !bankDetails.bankName) {
          return res.status(400).json({ message: "Incomplete bank details" });
        }

        withdrawalDetails = {
          method: "bank_transfer",
          accountHolderName: bankDetails.accountHolderName,
          accountNumberLast4: last4,
          ifscCode: bankDetails.ifscCode,
          bankName: bankDetails.bankName,
        };
        accountDisplay = `${bankDetails.bankName} ****${last4}`;
      } else {
        return res.status(400).json({ message: "Bank account details are required" });
      }
    } else if (method === "upi") {
      if (!upiId) {
        return res.status(400).json({ message: "UPI ID is required" });
      }
      withdrawalDetails = { method: "upi", upiId };
      accountDisplay = upiId;
    } else {
      return res.status(400).json({ message: "Invalid withdrawal method" });
    }

    const referenceId = generateReferenceId();
    withdrawalDetails.referenceId = referenceId;

    wallet.balance -= value;
    wallet.totalWithdrawn += value;
    await wallet.save();

    const txn = await Transaction.create({
      userId,
      type: "debit",
      amount: value,
      description: `Withdrawal via ${method === "upi" ? "UPI" : "Bank Transfer"}`,
      status: "pending",
      category: "withdrawal",
      withdrawalDetails,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await WithdrawalRequest.create({
      userId,
      amount: value,
      method,
      status: "pending",
      bankDetails: withdrawalDetails,
      upiId: method === "upi" ? upiId : null,
      transactionId: txn._id,
      referenceId,
    });

    const user = await User.findById(userId);
    if (user) {
      sendWithdrawalRequestEmail(user, {
        amount: value,
        method: method === "upi" ? "UPI" : "Bank Transfer",
        referenceId,
        accountDisplay,
      }).catch(() => {});
    }

    res.json({
      message: "Withdrawal request submitted. Funds will arrive in 2–3 business days.",
      referenceId,
      balance: wallet.balance,
      transactionId: txn._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const saveBankAccount = async (req, res) => {
  try {
    const { userId, accountHolderName, accountNumber, ifscCode, bankName, upiId } = req.body;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    if (!userId || !accountHolderName || !accountNumber || !ifscCode || !bankName) {
      return res.status(400).json({ message: "All bank fields are required" });
    }

    if (!ifscRegex.test(ifscCode)) {
      return res.status(400).json({ message: "Invalid IFSC code format" });
    }

    const encrypted = encryptAccountNumber(accountNumber);
    const last4 = String(accountNumber).slice(-4);

    const bank = await BankAccount.create({
      userId,
      accountHolderName,
      accountNumberLast4: last4,
      accountNumberEncrypted: encrypted,
      ifscCode: ifscCode.toUpperCase(),
      bankName,
      upiId: upiId || null,
    });

    res.json({
      message: "Bank account saved successfully",
      bankAccountId: bank._id,
      last4,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBankAccounts = async (req, res) => {
  try {
    const { userId } = req.params;
    const accounts = await BankAccount.find({ userId }).select("-accountNumberEncrypted");
    res.json({ accounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const value = parseFloat(amount);

    if (!value || value < 1) {
      return res.status(400).json({ message: "Minimum amount is ₹1" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(value * 100),
      currency: "inr",
      metadata: { userId: userId.toString(), walletCredit: value.toString() },
      description: `Wallet top-up for ${user.email}`,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, userId } = req.body;
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (intent.status !== "succeeded") {
      return res.status(400).json({ message: `Payment not succeeded. Status: ${intent.status}` });
    }

    const already = await Transaction.findOne({ stripePaymentIntentId: paymentIntentId });
    if (already) {
      return res.json({ message: "Already processed", alreadyProcessed: true });
    }

    const creditAmount = intent.amount / 100;
    const wallet = await getOrCreateWallet(userId);
    wallet.balance += creditAmount;
    wallet.totalEarned += creditAmount;
    await wallet.save();

    await Transaction.create({
      userId,
      type: "credit",
      amount: creditAmount,
      description: "Wallet top-up via Stripe",
      status: "completed",
      category: "stripe_topup",
      stripePaymentIntentId: paymentIntentId,
    });

    res.json({ message: "Wallet credited", balance: wallet.balance, credited: creditAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const adminGetWithdrawals = async (req, res) => {
  try {
    const { status = "all", page = 1, limit = 20 } = req.query;
    const query = status !== "all" ? { status } : {};
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [requests, total] = await Promise.all([
      WithdrawalRequest.find(query)
        .populate("userId", "name email")
        .populate("transactionId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      WithdrawalRequest.countDocuments(query),
    ]);

    res.json({ requests, total, page: parseInt(page, 10), totalPages: Math.ceil(total / parseInt(limit, 10)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const adminWithdrawalAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminNote } = req.body;
    const request = await WithdrawalRequest.findById(id).populate("userId", "name email");

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    if (action === "approve") {
      request.status = "completed";
      request.processedAt = new Date();
      request.adminNote = adminNote || "";

      await Transaction.findByIdAndUpdate(request.transactionId, {
        status: "completed",
        processedAt: new Date(),
      });

      sendWithdrawalCompletedEmail(request.userId, {
        amount: request.amount,
        referenceId: request.referenceId,
      }).catch(() => {});
    } else if (action === "reject") {
      request.status = "failed";
      request.adminNote = adminNote || "Rejected by admin";

      const wallet = await getOrCreateWallet(request.userId._id);
      wallet.balance += request.amount;
      wallet.totalWithdrawn -= request.amount;
      await wallet.save();

      await Transaction.findByIdAndUpdate(request.transactionId, {
        status: "failed",
        failureReason: adminNote || "Rejected by admin",
      });

      sendWithdrawalFailedEmail(request.userId, {
        amount: request.amount,
        reason: adminNote || "Your withdrawal could not be processed.",
      }).catch(() => {});
    } else {
      return res.status(400).json({ message: "Invalid action. Use approve or reject." });
    }

    await request.save();
    res.json({ message: `Withdrawal ${action}d successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBalance,
  getTransactions,
  addMoney,
  withdrawMoney,
  convertCreds,
  setWithdrawalPin,
  verifyWithdrawalPin,
  withdrawToBank,
  saveBankAccount,
  getBankAccounts,
  createPaymentIntent,
  confirmPayment,
  adminGetWithdrawals,
  adminWithdrawalAction,
};