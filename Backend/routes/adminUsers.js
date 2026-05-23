const express = require("express");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Attempt = require("../models/Attempt");
const UserTask = require("../models/UserTask");
const Referral = require("../models/Referral");
const { protectRoute: auth } = require("../middleware/authMiddleware");

const router = express.Router();

// Temporary: Simple admin check (can be enhanced with role-based access later)
const adminOnly = (req, res, next) => {
  // For now, just require authentication
  // Later, add role checking: if (req.user?.role !== 'admin') { ... }
  next();
};

// GET - List all users with pagination and filters
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "all" } = req.query;
    const skip = (page - 1) * limit;

    const filter = status && status !== "all" ? { status } : {};

    const users = await User.find(filter)
      .select("_id username email wallet creds status createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(filter);

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const transactionCount = await Transaction.countDocuments({
          userId: user._id,
        });
        const attemptCount = await Attempt.countDocuments({ userId: user._id });

        return {
          ...user,
          transactionCount,
          attemptCount,
        };
      }),
    );

    res.json({
      success: true,
      data: usersWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Search users by username
router.get("/search", auth, adminOnly, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({ success: true, data: [] });
    }

    const users = await User.find({
      username: { $regex: q, $options: "i" },
    })
      .select("_id username email wallet creds status createdAt")
      .limit(20)
      .lean();

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const transactionCount = await Transaction.countDocuments({
          userId: user._id,
        });
        const attemptCount = await Attempt.countDocuments({ userId: user._id });

        return {
          ...user,
          transactionCount,
          attemptCount,
        };
      }),
    );

    res.json({ success: true, data: usersWithStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get user details with complete information
router.get("/:id", auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch related data
    const [transactions, attempts, tasks, referrals, referredCount] =
      await Promise.all([
        Transaction.find({ userId: user._id })
          .sort({ createdAt: -1 })
          .limit(20),
        Attempt.find({ userId: user._id }).sort({ completedAt: -1 }).limit(10),
        UserTask.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10),
        Referral.find({ referrer: user._id }).lean(),
        User.countDocuments({ referredBy: user._id }),
      ]);

    // Calculate stats
    const totalEarned = transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpent = transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const quizStats = {
      totalAttempts: attempts.length,
      totalCorrect: attempts.filter((a) => a.score >= 50).length,
      totalWrong: attempts.filter((a) => a.score < 50).length,
      averageScore:
        attempts.length > 0
          ? (
              attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
            ).toFixed(2)
          : 0,
    };

    const userDetails = {
      _id: user._id,
      username: user.username,
      email: user.email,
      wallet: user.wallet,
      creds: user.creds,
      status: user.status,
      referralCode: user.referralCode,
      createdAt: user.createdAt,
      financials: {
        totalEarned,
        totalSpent,
        currentWallet: user.wallet,
      },
      quizStats,
      referralStats: {
        totalReferrals: referredCount,
        referralEarnings: referrals.reduce(
          (sum, r) => sum + (r.earnings || 0),
          0,
        ),
      },
      activityStats: {
        transactionCount: transactions.length,
        taskCount: tasks.length,
        quizAttempts: attempts.length,
      },
      recentTransactions: transactions.slice(0, 5),
      recentQuizzes: attempts.slice(0, 5),
    };

    res.json({ success: true, data: userDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Ban/Unban user
router.put("/:id/ban", auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newStatus = user.status === "active" ? "banned" : "active";
    user.status = newStatus;
    await user.save();

    res.json({
      success: true,
      message: `User ${newStatus === "banned" ? "banned" : "unbanned"} successfully`,
      status: newStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete user and all related data
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all related data
    await Promise.all([
      Transaction.deleteMany({ userId: user._id }),
      Attempt.deleteMany({ userId: user._id }),
      UserTask.deleteMany({ userId: user._id }),
      Referral.deleteMany({ referrer: user._id }),
      User.findByIdAndDelete(user._id),
    ]);

    res.json({
      success: true,
      message: "User and all related data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
