const express = require("express");
const router = express.Router();
const User = require("../models/User");
const SpinResult = require("../models/SpinResult");
const { protectRoute } = require("../middleware/authMiddleware");

const PAID_COST = 100;
const FREE_SPIN_WINDOW_MS = 24 * 60 * 60 * 1000;

const SEGMENTS = [
  { index: 0, label: "Better luck next time", rewardType: "none", rewardValue: 0, weight: 50 },
  { index: 1, label: "10 Creds", rewardType: "credits", rewardValue: 10, weight: 20 },
  { index: 2, label: "100 Creds", rewardType: "credits", rewardValue: 100, weight: 12 },
  { index: 3, label: "500 Mini Jackpot", rewardType: "credits", rewardValue: 500, weight: 5 },
  { index: 4, label: "Better luck next time", rewardType: "none", rewardValue: 0, weight: 10 },
  { index: 5, label: "10 Creds", rewardType: "credits", rewardValue: 10, weight: 1 },
  { index: 6, label: "100 Creds", rewardType: "credits", rewardValue: 100, weight: 2.8 },
  { index: 7, label: "1000 Jackpot", rewardType: "credits", rewardValue: 1000, weight: 0.2 },
];

const TOTAL_WEIGHT = SEGMENTS.reduce((sum, segment) => sum + segment.weight, 0);

function pickSegment() {
  let remaining = Math.random() * TOTAL_WEIGHT;

  for (const segment of SEGMENTS) {
    remaining -= segment.weight;
    if (remaining <= 0) return segment;
  }

  return SEGMENTS[0];
}

router.get("/status", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("creds lastSpinTime totalSpins");
    const now = Date.now();
    const lastSpin = user.lastSpinTime ? new Date(user.lastSpinTime).getTime() : 0;
    const elapsed = now - lastSpin;
    const canFreeSpin = elapsed >= FREE_SPIN_WINDOW_MS;

    res.json({
      canFreeSpin,
      msUntilFree: canFreeSpin ? 0 : FREE_SPIN_WINDOW_MS - elapsed,
      creds: user.creds || 0,
      canPaidSpin: (user.creds || 0) >= PAID_COST,
      paidCost: PAID_COST,
      totalSpins: user.totalSpins || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/", protectRoute, async (req, res) => {
  try {
    const { type = "free" } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (type === "free") {
      const elapsed = Date.now() - (user.lastSpinTime ? new Date(user.lastSpinTime).getTime() : 0);
      if (elapsed < FREE_SPIN_WINDOW_MS) {
        return res.status(429).json({
          message: "Free spin not ready yet.",
          msUntilFree: FREE_SPIN_WINDOW_MS - elapsed,
        });
      }
    }

    if (type === "paid") {
      if ((user.creds || 0) < PAID_COST) {
        return res.status(400).json({ message: `Need ${PAID_COST} credits to spin.` });
      }
      user.creds -= PAID_COST;
    }

    const segment = pickSegment();

    if (segment.rewardType === "credits") {
      user.creds = (user.creds || 0) + segment.rewardValue;
    }

    if (type === "free") {
      user.lastSpinTime = new Date();
    }

    user.totalSpins = (user.totalSpins || 0) + 1;
    await user.save();

    await SpinResult.create({
      userId: user._id,
      rewardType: segment.rewardType,
      rewardValue: segment.rewardValue,
      rewardLabel: segment.label,
      spinType: type,
      segmentIndex: segment.index,
    });

    res.json({
      segmentIndex: segment.index,
      rewardType: segment.rewardType,
      rewardValue: segment.rewardValue,
      rewardLabel: segment.label,
      newCreds: user.creds,
    });
  } catch (error) {
    console.error("Spin error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/history", protectRoute, async (req, res) => {
  try {
    const history = await SpinResult.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;