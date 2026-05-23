const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Attempt = require("../models/Attempt");
const UserTask = require("../models/UserTask");
const Survey = require("../models/Survey");
const Referral = require("../models/Referral");
const Quiz = require("../models/Quiz");
const Task = require("../models/Task");

const toDateBucket = (date) =>
  new Date(date).toISOString().slice(0, 10);

const resolveSince = (range) => {
  const now = new Date();
  const since = new Date(now);
  switch (range) {
    case "daily":
      since.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      since.setDate(now.getDate() - 6);
      since.setHours(0, 0, 0, 0);
      break;
    case "monthly":
      since.setDate(now.getDate() - 29);
      since.setHours(0, 0, 0, 0);
      break;
    case "yearly":
      since.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return null;
  }
  return since;
};

router.get("/overview", async (req, res) => {
  try {
    const range = String(req.query.range || "overall").toLowerCase();
    const since = resolveSince(range);
    const [
      totalUsers,
      activeUsers,
      bannedUsers,
      passwordResetPendingUsers,
      recentUsers,
      totalQuizzes,
      recentQuizzes,
      totalTasks,
      activeTasks,
      recentTasks,
      totalSurveys,
      recentSurveys,
      totalAttempts,
      recentAttempts,
      totalLeaderboardUsers,
      topEarners,
      transactions,
      referralsAgg,
      taskCompletionCount,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ status: "banned" }),
      User.countDocuments({ resetPasswordOtp: { $ne: null } }),
      User.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .select("_id username email wallet creds status createdAt resetPasswordExpires")
        .lean(),
      Quiz.countDocuments(),
      Quiz.find().sort({ createdAt: -1 }).limit(6).select("title reward createdAt").lean(),
      Task.countDocuments(),
      Task.countDocuments({ isActive: true }),
      Task.find().sort({ createdAt: -1 }).limit(6).select("title reward isActive createdAt expiresAt").lean(),
      Survey.countDocuments(),
      Survey.find().sort({ createdAt: -1 }).limit(6).select("title reward createdAt expiresAt").lean(),
      Attempt.countDocuments(),
      Attempt.find().sort({ createdAt: -1 }).limit(8).select("userId quizId score earnedCoins createdAt").lean(),
      User.countDocuments(),
      User.find().sort({ creds: -1 }).limit(8).select("_id username email creds wallet avatar createdAt").lean(),
      Transaction.find().sort({ createdAt: -1 }).limit(2000).select("type amount createdAt userId description").lean(),
      Referral.aggregate([{ $group: { _id: null, totalEarnings: { $sum: "$earnings" }, totalReferrals: { $sum: 1 } } }]),
      UserTask.countDocuments({ status: "completed" }),
    ]);

    const totalEarned = transactions
      .filter((tx) => tx.type === "credit")
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    const filterByRange = (items, field = "createdAt") =>
      since ? items.filter((item) => new Date(item[field]) >= since) : items;

    const filteredUsers = filterByRange(recentUsers);
    const filteredQuizzes = filterByRange(recentQuizzes);
    const filteredTasks = filterByRange(recentTasks);
    const filteredSurveys = filterByRange(recentSurveys);
    const filteredAttempts = filterByRange(recentAttempts);
    const filteredEarners = topEarners;

    const creditsByDay = transactions.reduce((acc, tx) => {
      const day = toDateBucket(tx.createdAt);
      acc[day] = acc[day] || { day, earned: 0, spent: 0 };
      if (tx.type === "credit") acc[day].earned += tx.amount || 0;
      if (tx.type === "debit") acc[day].spent += tx.amount || 0;
      return acc;
    }, {});

    const rangeTransactions = since
      ? transactions.filter((tx) => new Date(tx.createdAt) >= since)
      : transactions;

    const rangeCreditsByDay = rangeTransactions.reduce((acc, tx) => {
      const day = toDateBucket(tx.createdAt);
      acc[day] = acc[day] || { day, earned: 0, spent: 0 };
      if (tx.type === "credit") acc[day].earned += tx.amount || 0;
      if (tx.type === "debit") acc[day].spent += tx.amount || 0;
      return acc;
    }, {});

    res.json({
      success: true,
      range,
      stats: {
        totalUsers: since ? filteredUsers.length : totalUsers,
        activeUsers: since ? filteredUsers.filter((u) => u.status === "active").length : activeUsers,
        bannedUsers: since ? filteredUsers.filter((u) => u.status === "banned").length : bannedUsers,
        passwordResetPendingUsers: since ? filteredUsers.filter((u) => u.resetPasswordOtp).length : passwordResetPendingUsers,
        totalQuizzes: since ? filteredQuizzes.length : totalQuizzes,
        totalTasks: since ? filteredTasks.length : totalTasks,
        activeTasks: since ? filteredTasks.filter((t) => t.isActive).length : activeTasks,
        totalSurveys: since ? filteredSurveys.length : totalSurveys,
        totalAttempts: since ? filteredAttempts.length : totalAttempts,
        totalLeaderboardUsers: since ? filteredEarners.length : totalLeaderboardUsers,
        totalEarned: since
          ? rangeTransactions.filter((tx) => tx.type === "credit").reduce((sum, tx) => sum + (tx.amount || 0), 0)
          : totalEarned,
        referralEarnings: referralsAgg[0]?.totalEarnings || 0,
        totalReferrals: referralsAgg[0]?.totalReferrals || 0,
        taskCompletionCount,
      },
      recentUsers: filteredUsers,
      recentQuizzes: filteredQuizzes,
      recentTasks: filteredTasks,
      recentSurveys: filteredSurveys,
      recentAttempts: filteredAttempts,
      topEarners,
      creditsByDay: Object.values(since ? rangeCreditsByDay : creditsByDay).slice(-14),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
