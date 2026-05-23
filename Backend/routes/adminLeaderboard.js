const express  = require("express");
const router   = express.Router();
const User     = require("../models/User");
const Settings = require("../models/Leaderboardsettings");
const { protectRoute } = require("../middleware/authMiddleware");

router.use(protectRoute);

// ── Singleton helper ─────────────────────────────────────────────────────────
const getSettings = () =>
  Settings.findOneAndUpdate(
    { singletonKey: "main" },
    { $setOnInsert: { singletonKey: "main" } },
    { upsert: true, returnDocument: 'after' }
  );

// GET /api/admin/leaderboard?limit=100
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);

    const [users, settings] = await Promise.all([
      User.find({}, "username email creds avatar createdAt")
        .sort({ creds: -1 })
        .limit(limit)
        .lean(),
      getSettings(),
    ]);

    const players = users.map((u, i) => ({
      rank    : i + 1,
      userId  : u._id,
      username: u.username,
      email   : u.email  || "",
      points  : u.creds  || 0,
      avatar  : u.avatar || null,
      isLeader: settings.manualLeaderId?.toString() === u._id.toString(),
      joinedAt: u.createdAt,
    }));

    res.json({ players, total: players.length });
  } catch (err) {
    console.error("Admin leaderboard:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/admin/leaderboard/settings
router.get("/settings", async (req, res) => {
  try {
    res.json(await getSettings());
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/admin/leaderboard/settings
router.post("/settings", async (req, res) => {
  try {
    const {
      autoResetDaily, autoResetWeekly, autoResetMonthly,
      dailyReward, weeklyReward, monthlyReward,
    } = req.body;

    const updated = await Settings.findOneAndUpdate(
      { singletonKey: "main" },
      { autoResetDaily, autoResetWeekly, autoResetMonthly, dailyReward, weeklyReward, monthlyReward },
      { upsert: true, returnDocument: 'after' }
    );
    res.json({ message: "Settings saved.", settings: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/admin/leaderboard/reset
router.post("/reset", async (req, res) => {
  try {
    const { type = "daily" } = req.body;
    const tsField = {
      daily  : "lastDailyReset",
      weekly : "lastWeeklyReset",
      monthly: "lastMonthlyReset",
    }[type];

    const update = tsField ? { [tsField]: new Date() } : {};
    await Settings.findOneAndUpdate({ singletonKey: "main" }, update, { upsert: true });

    if (type === "all") await User.updateMany({}, { $set: { creds: 0 } });

    res.json({ message: `${type} leaderboard reset.`, resetAt: new Date() });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/admin/leaderboard/announce
router.post("/announce", async (req, res) => {
  try {
    const top = await User.find({}, "username creds avatar")
      .sort({ creds: -1 })
      .limit(3)
      .lean();

    res.json({
      message: "Winners announced.",
      winners: top.map((u, i) => ({ rank: i + 1, username: u.username, points: u.creds })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/admin/leaderboard/export  →  CSV download
router.get("/export", async (req, res) => {
  try {
    const users = await User.find({}, "username email creds createdAt")
      .sort({ creds: -1 })
      .lean();

    const rows = [
      ["Rank", "Username", "Email", "Points", "Joined"],
      ...users.map((u, i) => [
        i + 1,
        u.username,
        u.email || "",
        u.creds || 0,
        new Date(u.createdAt).toLocaleDateString("en-US"),
      ]),
    ];

    const csv = rows.map((r) => r.map(String).join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="leaderboard_${Date.now()}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// PUT /api/admin/leaderboard/points/:userId
router.put("/points/:userId", async (req, res) => {
  try {
    const points = parseFloat(req.body.points);
    if (isNaN(points) || points < 0)
      return res.status(400).json({ message: "Valid non-negative points required." });

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { creds: points } },
      { returnDocument: 'after' }
    ).select("username creds");

    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "Points updated.", user: { username: user.username, points: user.creds } });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// PUT /api/admin/leaderboard/leader/:userId
router.put("/leader/:userId", async (req, res) => {
  try {
    await Settings.findOneAndUpdate(
      { singletonKey: "main" },
      { manualLeaderId: req.params.userId },
      { upsert: true }
    );
    res.json({ message: "Manual leader set." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;