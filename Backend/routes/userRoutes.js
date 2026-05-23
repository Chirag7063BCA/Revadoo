const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Attempt = require("../models/Attempt");
const UserTask = require("../models/UserTask");
const Survey = require("../models/Survey");
const Referral = require("../models/Referral");
const { protectRoute: auth } = require("../middleware/authMiddleware");

const resolveAuthUserId = (req) => req.user?.id || req.user?.userId || req.user?._id;

const isValidObjectId = (value) => {
  if (!value) return false;
  return /^([0-9a-fA-F]{24})$/.test(String(value));
};

router.get("/me", auth, async (req, res) => {
  try {
    const authUserId = resolveAuthUserId(req);
    if (!isValidObjectId(authUserId)) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(authUserId).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const authUserId = resolveAuthUserId(req);
    if (!isValidObjectId(authUserId)) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(authUserId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user stats
router.get("/stats/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Fetch all related data in parallel
    const [transactions, attempts, tasks, surveys, referrals, referredCount] =
      await Promise.all([
        Transaction.find({ userId }).lean(),
        Attempt.find({ userId }).lean(),
        UserTask.find({ userId }).lean(),
        Survey.find({ userId }).lean(),
        Referral.find({ referrer: userId }).lean(),
        User.countDocuments({ referredBy: userId }),
      ]);

    // Calculate totals
    const totalEarned = transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalSpent = transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const user = await User.findById(userId).select("wallet creds");

    const stats = {
      totalEarned,
      totalSpent,
      currentWallet: user?.wallet || 0,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === "completed").length,
      totalReferrals: referredCount,
      quizAttempts: attempts.length,
      surveyCompleted: surveys.length,
    };

    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get dashboard stats (for cards)
router.get("/dashboard-stats", auth, async (req, res) => {
  try {
    const userId = resolveAuthUserId(req);
    if (!isValidObjectId(userId)) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(userId);

    const [completedTasks, attemptedQuizzes, completedSurveys, referrals] =
      await Promise.all([
        UserTask.countDocuments({ userId, status: "completed" }),
        Attempt.countDocuments({ userId }),
        Survey.countDocuments({ userId }),
        Referral.countDocuments({ referrer: userId }),
      ]);

    const transactions = await Transaction.find({ userId }).lean();
    const totalEarnings = transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    res.json({
      success: true,
      stats: {
        completedTasks,
        totalEarnings,
        completedSurveys,
        totalReferrals: referrals,
        wallet: user?.wallet,
        creds: user?.creds,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
