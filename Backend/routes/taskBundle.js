// LOCATION: Backend/routes/taskBundle.js
// Single endpoint returns tasks + user submissions in ONE request
// Cuts network round trips in half — this is the biggest speed win

const express        = require("express");
const router         = express.Router();
const Task           = require("../models/Task");
const TaskSubmission = require("../models/TaskSubmission");
const jwt            = require("jsonwebtoken");

const TASK_LIST_FIELDS = "title description thumbnail platform reward timeMinutes link expiresAt isActive createdAt";

// GET /api/tasks/bundle
// Public-ish: tasks always returned, submissions only if JWT present
router.get("/", async (req, res) => {
  try {
    res.set("Cache-Control", "private, max-age=10");
    const now = new Date();

    // Always fetch tasks including thumbnail so user cards can display uploaded images.
    const tasksPromise = Task.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select(TASK_LIST_FIELDS)
      .lean();

    // Try to decode JWT for submissions — fail silently if missing/expired
    let submissionsPromise = Promise.resolve([]);
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(
          authHeader.split(" ")[1],
          process.env.JWT_SECRET
        );
        const authUserId = decoded.userId || decoded.id || decoded._id;
        submissionsPromise = authUserId
          ? TaskSubmission.find({ userId: authUserId })
          .select("taskId status earnedPoints submittedAt reviewDeadline")
          .lean()
          : Promise.resolve([]);
      } catch {}
    }

    // Fire both in parallel
    const [tasks, submissions] = await Promise.all([tasksPromise, submissionsPromise]);

    // Mark expired server-side so client doesn't need extra logic
    const tasksWithExpiry = tasks.map((t) => ({
      ...t,
      expired: t.expiresAt ? now > new Date(t.expiresAt) : false,
    }));

    // Map submissions by taskId string for O(1) frontend lookup
    const submissionsMap = {};
    submissions.forEach((s) => {
      submissionsMap[s.taskId.toString()] = s;
    });

    res.json({ tasks: tasksWithExpiry, submissions: submissionsMap });
  } catch (err) {
    console.error("Bundle error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;