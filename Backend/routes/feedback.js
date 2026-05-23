// Backend/routes/feedback.js
const express  = require("express");
const router   = express.Router();
const Feedback = require("../models/Feedback");
const { protectRoute } = require("../middleware/authMiddleware");

// ════════════════════════════════════════════════════════
// @route   POST /api/feedback
// @desc    Submit feedback — saved to DB with user info
// @access  Private
// ════════════════════════════════════════════════════════
router.post("/", protectRoute, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({ message: "Subject is required" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const feedback = await Feedback.create({
      userId:   req.user._id,
      username: req.user.username,
      email:    req.user.email,
      subject:  subject.trim(),
      message:  message.trim(),
      status:   "pending",
    });

    console.log(`📩 Feedback received from ${req.user.username}: "${subject}"`);

    res.status(201).json({
      message:  "Feedback submitted successfully! Thank you.",
      feedback: {
        id:        feedback._id,
        subject:   feedback.subject,
        status:    feedback.status,
        createdAt: feedback.createdAt,
      },
    });
  } catch (err) {
    console.error("Feedback error:", err.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ════════════════════════════════════════════════════════
// @route   GET /api/feedback/mine
// @desc    Get all feedback submitted by logged-in user
// @access  Private
// ════════════════════════════════════════════════════════
router.get("/mine", protectRoute, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    console.error("Get feedback error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;