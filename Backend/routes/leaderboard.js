// Backend/routes/leaderboard.js
const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const TaskSubmission = require("../models/TaskSubmission");
const Transaction = require("../models/Transaction");
const { protectRoute } = require("../middleware/authMiddleware");

// ════════════════════════════════════════════════════════
// @route   GET /api/leaderboard
// @desc    Top 100 users sorted by creds with tasks/surveys counts
// @access  Private
// ════════════════════════════════════════════════════════
router.get("/", protectRoute, async (req, res) => {
  try {
    const top = await User.find({}, "username creds createdAt avatar")
      .sort({ creds: -1 })
      .limit(100)
      .lean();

    const [taskCounts, surveyCounts] = await Promise.all([
      TaskSubmission.aggregate([
        { $match: { status: { $in: ["approved", "paid"] } } },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ]),
      Transaction.aggregate([
        { $match: { type: "credit", description: { $regex: "Survey", $options: "i" } } },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ]),
    ]);

    const taskCountMap = {};
    taskCounts.forEach((row) => {
      taskCountMap[row._id.toString()] = row.count;
    });

    const surveyCountMap = {};
    surveyCounts.forEach((row) => {
      surveyCountMap[row._id.toString()] = row.count;
    });

    const players = top.map((u, i) => ({
      rank:      i + 1,
      userId:    u._id,
      username:  u.username,
      creds:     u.creds     || 0,
      avatar:    u.avatar    || null,
      initial:   (u.username || "U").charAt(0).toUpperCase(),
      joinedAt:  u.createdAt,
      tasks:     taskCountMap[u._id.toString()] || 0,
      surveys:   surveyCountMap[u._id.toString()] || 0,
    }));

    res.json(players);
  } catch (err) {
    console.error("Leaderboard error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ════════════════════════════════════════════════════════
// @route   GET /api/leaderboard/stats
// @desc    Total players, total creds, avg creds
// @access  Private
// ════════════════════════════════════════════════════════
router.get("/stats", protectRoute, async (req, res) => {
  try {
    const [totalPlayers, agg] = await Promise.all([
      User.countDocuments(),
      User.aggregate([
        { $group: { _id: null, totalCreds: { $sum: "$creds" }, avgCreds: { $avg: "$creds" } } }
      ]),
    ]);

    const totalCreds = agg[0]?.totalCreds || 0;
    const avgCreds   = Math.round(agg[0]?.avgCreds || 0);

    res.json({ totalPlayers, totalCreds, avgCreds });
  } catch (err) {
    console.error("Leaderboard stats error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ════════════════════════════════════════════════════════
// @route   GET /api/leaderboard/me
// @desc    Logged-in user's rank + surrounding players
// @access  Private
// ════════════════════════════════════════════════════════
router.get("/me", protectRoute, async (req, res) => {
  try {
    const myRank = await User.countDocuments({ creds: { $gt: req.user.creds } }) + 1;
    res.json({ rank: myRank, creds: req.user.creds, username: req.user.username });
  } catch (err) {
    console.error("My rank error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;