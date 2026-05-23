// LOCATION: Backend/routes/adminReferral.js

const express          = require("express");
const router           = express.Router();
const Referral         = require("../models/Referral");
const User             = require("../models/User");
const ReferralSettings = require("../models/ReferralSettings"); // 👈 ADD THIS

// ── GET /api/admin/referrals/stats ───────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const [totalReferrals, activeReferrals, earningsAgg, uniqueReferrers] =
      await Promise.all([
        Referral.countDocuments(),
        Referral.countDocuments({ status: "Active" }),
        Referral.aggregate([{ $group: { _id: null, total: { $sum: "$earnings" } } }]),
        Referral.distinct("referrer"),
      ]);

    res.json({
      totalReferrals,
      activeReferrals,
      totalEarnings:   earningsAgg[0]?.total || 0,
      uniqueReferrers: uniqueReferrers.length,
    });
  } catch (err) {
    console.error("Admin referral stats:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ── GET /api/admin/referrals/top-referrers ───────────────────────────────────
router.get("/top-referrers", async (req, res) => {
  try {
    const top = await Referral.aggregate([
      {
        $group: {
          _id:            "$referrer",
          totalReferrals: { $sum: 1 },
          totalEarnings:  { $sum: "$earnings" },
          activeCount:    { $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] } },
        },
      },
      { $sort: { totalReferrals: -1 } },
      { $limit: 10 },
    ]);

    const populated = await Promise.all(
      top.map(async (item) => {
        const user = await User.findById(item._id).select("username email creds").lean();
        return {
          userId:         item._id,
          username:       user?.username || "Deleted User",
          email:          user?.email    || "",
          creds:          user?.creds    || 0,
          totalReferrals: item.totalReferrals,
          totalEarnings:  item.totalEarnings,
          activeCount:    item.activeCount,
        };
      })
    );

    res.json(populated);
  } catch (err) {
    console.error("Top referrers:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ── GET /api/admin/referrals/settings ────────────────────────────────────────
router.get("/settings", async (req, res) => {
  try {
    let settings = await ReferralSettings.findOne().lean();
    if (!settings) settings = await ReferralSettings.create({});
    res.json(settings);
  } catch (err) {
    console.error("GET referral settings:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ── POST /api/admin/referrals/settings ───────────────────────────────────────
router.post("/settings", async (req, res) => {
  try {
    const allowed = [
      "baseReward", "payoutMethod", "autoPayout",
      "milestone1Refs", "milestone1Bonus",
      "milestone2Refs", "milestone2Bonus",
      "milestone3Refs", "milestone3Bonus",
      "milestone4Refs", "milestone4Bonus",
    ];
    const update = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

    const settings = await ReferralSettings.findOneAndUpdate(
      {},
      { $set: update },
      { upsert: true, returnDocument: "after", runValidators: true }
    );
    res.json({ message: "Settings saved successfully", settings });
  } catch (err) {
    console.error("POST referral settings:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ── GET /api/admin/referrals?page=1&limit=20&search=&status= ─────────────────
router.get("/", async (req, res) => {
  try {
    const page   = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit  = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip   = (page - 1) * limit;
    const status = req.query.status || "";
    const search = req.query.search  || "";

    const matchStage = {};
    if (status) matchStage.status = status;

    let referrals = await Referral.find(matchStage)
      .populate("referrer",     "username email")
      .populate("referredUser", "username email createdAt")
      .sort({ createdAt: -1 })
      .lean();

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      referrals = referrals.filter(
        (r) =>
          r.referrer?.username?.toLowerCase().includes(q) ||
          r.referredUser?.username?.toLowerCase().includes(q)
      );
    }

    const total = referrals.length;
    const paged = referrals.slice(skip, skip + limit);

    res.json({ referrals: paged, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Admin referrals list:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ── PUT /api/admin/referrals/:id/status ──────────────────────────────────────
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "Pending", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    )
      .populate("referrer",     "username")
      .populate("referredUser", "username");

    if (!referral) return res.status(404).json({ message: "Referral not found." });
    res.json({ message: "Status updated.", referral });
  } catch (err) {
    console.error("Update referral status:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ── DELETE /api/admin/referrals/:id ──────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const referral = await Referral.findByIdAndDelete(req.params.id);
    if (!referral) return res.status(404).json({ message: "Referral not found." });
    res.json({ message: "Referral deleted." });
  } catch (err) {
    console.error("Delete referral:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ── GET /api/admin/referrals/export ──────────────────────────────────────────
router.get("/export", async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate("referrer",     "username email")
      .populate("referredUser", "username email createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const rows = [
      ["Referrer", "Referrer Email", "Referred User", "Referred Email", "Status", "Earnings (TKN)", "Date"],
      ...referrals.map((r) => [
        r.referrer?.username     || "Deleted",
        r.referrer?.email        || "",
        r.referredUser?.username || "Deleted",
        r.referredUser?.email    || "",
        r.status,
        r.earnings,
        new Date(r.createdAt).toLocaleDateString("en-US"),
      ]),
    ];

    const csv = rows.map((row) => row.map(String).join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="referrals_${Date.now()}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error("Export referrals:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;