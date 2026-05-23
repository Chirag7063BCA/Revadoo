// LOCATION: Backend/routes/taskSubmissions.js
const express        = require("express");
const router         = express.Router();
const TaskSubmission = require("../models/TaskSubmission");
const Task           = require("../models/Task");
const { protectRoute } = require("../middleware/authMiddleware");

const REVIEW_HOURS = 24;

// ── POST /api/task-submissions ────────────────────────────────────────────────
// User submits screenshot after completing a task
router.post("/", protectRoute, async (req, res) => {
  try {
    const { taskId, screenshotData } = req.body;
    if (!taskId) return res.status(400).json({ message: "taskId is required." });

    const task = await Task.findById(taskId);
    if (!task)         return res.status(404).json({ message: "Task not found." });
    if (!task.isActive) return res.status(400).json({ message: "Task is no longer active." });

    // Check task expiry
    if (task.expiresAt && new Date() > new Date(task.expiresAt)) {
      return res.status(400).json({ message: "This task has expired." });
    }

    // Check duplicate submission
    const existing = await TaskSubmission.findOne({ userId: req.user._id, taskId });
    if (existing) {
      return res.status(400).json({ message: "You have already submitted this task.", submission: existing });
    }

    const submittedAt    = new Date();
    const reviewDeadline = new Date(submittedAt.getTime() + REVIEW_HOURS * 60 * 60 * 1000);

    const submission = await TaskSubmission.create({
      userId:         req.user._id,
      taskId,
      screenshotData: screenshotData || "",
      status:         "pending",
      submittedAt,
      reviewDeadline,
      earnedPoints:   task.reward,
    });

    res.status(201).json({ message: "Submission received! Under review for up to 24 hours.", submission });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already submitted this task." });
    }
    console.error("Task submission error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ── GET /api/task-submissions/my ─────────────────────────────────────────────
// Logged-in user: get all their submissions with task info
router.get("/my", protectRoute, async (req, res) => {
  try {
    const submissions = await TaskSubmission.find({ userId: req.user._id })
      .populate("taskId", "title platform reward time")
      .sort({ submittedAt: -1 })
      .lean();

    res.json(submissions);
  } catch (err) {
    console.error("Get my submissions:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;