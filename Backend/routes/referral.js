const express    = require("express");
const router     = express.Router();
const mongoose   = require("mongoose");
const Referral   = require("../models/Referral");
const { protectRoute } = require("../middleware/authMiddleware");

router.get("/", protectRoute, async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user._id })
      .populate("referredUser", "username createdAt")
      .sort({ createdAt: -1 });

    const formatted = referrals.map((r) => ({
      _id:      r._id,
      name:     r.referredUser?.username || "Unknown",
      joined:   r.referredUser?.createdAt || r.createdAt,
      status:   r.status,
      earnings: r.earnings,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching referrals" });
  }
});

router.get("/stats", protectRoute, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [totalReferrals, activeReferrals, earningsData] = await Promise.all([
      Referral.countDocuments({ referrer: userId }),
      Referral.countDocuments({ referrer: userId, status: "Active" }),
      Referral.aggregate([
        { $match: { referrer: userId } },
        { $group: { _id: null, total: { $sum: "$earnings" } } },
      ]),
    ]);

    res.json({
      totalReferrals,
      activeReferrals,
      totalEarnings: earningsData[0]?.total || 0,
    });
  } catch (err) {
    console.error("Referral stats error:", err.message);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

module.exports = router;