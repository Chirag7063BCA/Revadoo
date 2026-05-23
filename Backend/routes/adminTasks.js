// LOCATION: Backend/routes/adminTasks.js
// PERF FIXES:
//  1. Stats use a single aggregate instead of 3 countDocuments per task (N+1 eliminated)
//  2. /stats route added so header can load independently & fast

const express        = require("express");
const router         = express.Router();
const Task           = require("../models/Task");
const TaskSubmission = require("../models/TaskSubmission");
const User           = require("../models/User");
const Transaction    = require("../models/Transaction");

const TASK_LIST_FIELDS = "title description thumbnail platform reward timeMinutes link expiresAt isActive createdAt";

// ══════════════════════════════════════════════════
// STATS  (fast — single aggregate)
// ══════════════════════════════════════════════════
router.get("/stats", async (req, res) => {
  try {
    const [activeTasks, subAgg] = await Promise.all([
      Task.countDocuments({ isActive: true }),
      TaskSubmission.aggregate([
        {
          $group: {
            _id:           "$status",
            count:         { $sum: 1 },
            totalEarnings: { $sum: "$earnedPoints" },
          },
        },
      ]),
    ]);

    let totalSubmissions = 0, pendingReview = 0, totalPaidTKN = 0;
    subAgg.forEach(({ _id, count, totalEarnings }) => {
      totalSubmissions += count;
      if (_id === "pending")  pendingReview = count;
      if (_id === "paid")     totalPaidTKN  = totalEarnings;
    });

    res.json({ activeTasks, totalSubmissions, pendingReview, totalPaidTKN });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ══════════════════════════════════════════════════
// LIST ALL TASKS  (includes thumbnail for admin table previews)
// ══════════════════════════════════════════════════
router.get("/", async (req, res) => {
  try {
    // 1. Fetch tasks with thumbnail so UI can render task images
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .select(TASK_LIST_FIELDS)
      .lean();

    if (tasks.length === 0) return res.json([]);

    // 2. ONE aggregate for all submission counts — replaces N*3 queries
    const taskIds = tasks.map((t) => t._id);
    const submissionCounts = await TaskSubmission.aggregate([
      { $match: { taskId: { $in: taskIds } } },
      {
        $group: {
          _id:     "$taskId",
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"]  }, 1, 0] } },
          approved:{ $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
          paid:    { $sum: { $cond: [{ $eq: ["$status", "paid"]     }, 1, 0] } },
        },
      },
    ]);

    // Map for O(1) lookup
    const countsMap = {};
    submissionCounts.forEach((c) => { countsMap[c._id.toString()] = c; });

    const now = new Date();
    const result = tasks.map((t) => {
      const c = countsMap[t._id.toString()] || {};
      return {
        ...t,
        expired: t.expiresAt ? now > new Date(t.expiresAt) : false,
        stats: { pending: c.pending || 0, approved: c.approved || 0, paid: c.paid || 0 },
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Admin get tasks:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ══════════════════════════════════════════════════
// SINGLE TASK  (includes thumbnail)
// ══════════════════════════════════════════════════
router.get("/:id", async (req, res, next) => {
  try {
    if (!Task.db.base.Types.ObjectId.isValid(req.params.id)) return next();
    const task = await Task.findById(req.params.id)
      .select(TASK_LIST_FIELDS)
      .lean();
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ══════════════════════════════════════════════════
// CREATE
// ══════════════════════════════════════════════════
router.post("/", async (req, res) => {
  try {
    const { title, description, platform, reward, timeMinutes, link, expiresAt, thumbnail } = req.body;
    if (!title || !platform || !reward) {
      return res.status(400).json({ message: "title, platform and reward are required." });
    }
    const task = await Task.create({
      title, description, platform, reward,
      timeMinutes: parseInt(timeMinutes) || 0,
      link, thumbnail: thumbnail || "",
      expiresAt: expiresAt || null,
    });
    // Return without thumbnail in response to keep it light
    const { thumbnail: _t, ...taskLight } = task.toObject();
    res.status(201).json({ message: "Task created.", task: taskLight });
  } catch (err) {
    console.error("Create task:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ══════════════════════════════════════════════════
// UPDATE
// ══════════════════════════════════════════════════
router.put("/:id", async (req, res, next) => {
  try {
    if (!Task.db.base.Types.ObjectId.isValid(req.params.id)) return next();
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" })
      .select(TASK_LIST_FIELDS);
    if (!task) return res.status(404).json({ message: "Task not found." });
    const { thumbnail: _t, ...taskLight } = task.toObject();
    res.json({ message: "Task updated.", task: taskLight });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ══════════════════════════════════════════════════
// DELETE
// ══════════════════════════════════════════════════
router.delete("/:id", async (req, res, next) => {
  try {
    if (!Task.db.base.Types.ObjectId.isValid(req.params.id)) return next();
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json({ message: "Task deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ══════════════════════════════════════════════════
// TOGGLE isActive
// ══════════════════════════════════════════════════
router.patch("/:id/toggle", async (req, res, next) => {
  try {
    if (!Task.db.base.Types.ObjectId.isValid(req.params.id)) return next();
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    task.isActive = !task.isActive;
    await task.save();
    res.json({ message: `Task ${task.isActive ? "activated" : "deactivated"}.`, task });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ══════════════════════════════════════════════════
// SUBMISSION REVIEW — list
// ══════════════════════════════════════════════════
router.get("/submissions", async (req, res) => {
  try {
    const page   = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit  = Math.min(parseInt(req.query.limit) || 20, 100);
    const status = req.query.status || "";
    const query  = status ? { status } : {};

    const [submissions, total] = await Promise.all([
      TaskSubmission.find(query)
        .select("-screenshotData")        // ← exclude screenshot from list
        .populate("userId", "username email")
        .populate("taskId", "title platform reward")
        .sort({ submittedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      TaskSubmission.countDocuments(query),
    ]);

    res.json({ submissions, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Single submission with screenshot (for preview modal)
router.get("/submissions/:id", async (req, res) => {
  try {
    const sub = await TaskSubmission.findById(req.params.id)
      .populate("userId", "username email")
      .populate("taskId", "title platform reward")
      .lean();
    if (!sub) return res.status(404).json({ message: "Not found." });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ══════════════════════════════════════════════════
// APPROVE / REJECT / PAY
// ══════════════════════════════════════════════════
router.put("/submissions/:id/approve", async (req, res) => {
  try {
    const { reviewNote = "" } = req.body;
    const sub = await TaskSubmission.findByIdAndUpdate(
      req.params.id,
      { status: "approved", reviewedAt: new Date(), reviewNote },
      { returnDocument: "after" }
    );
    if (!sub) return res.status(404).json({ message: "Submission not found." });
    res.json({ message: "Approved. Payment pending release.", submission: sub });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

router.put("/submissions/:id/reject", async (req, res) => {
  try {
    const { reviewNote = "Rejected by admin." } = req.body;
    const sub = await TaskSubmission.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", reviewedAt: new Date(), reviewNote },
      { returnDocument: "after" }
    );
    if (!sub) return res.status(404).json({ message: "Submission not found." });
    res.json({ message: "Rejected.", submission: sub });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

router.put("/submissions/:id/pay", async (req, res) => {
  try {
    const sub = await TaskSubmission.findById(req.params.id).populate("taskId", "title reward");
    if (!sub)                      return res.status(404).json({ message: "Submission not found." });
    if (sub.status !== "approved") return res.status(400).json({ message: "Must be approved first." });

    const points = sub.earnedPoints || sub.taskId?.reward || 0;
    await Promise.all([
      User.findByIdAndUpdate(sub.userId, { $inc: { creds: points } }),
      Transaction.create({ userId: sub.userId, type: "credit", amount: points, description: `Task reward: ${sub.taskId?.title || "Task"}` }),
      TaskSubmission.findByIdAndUpdate(sub._id, { status: "paid", paidAt: new Date() }),
    ]);

    res.json({ message: `${points} TKN paid to user.` });
  } catch (err) {
    console.error("Pay:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

router.put("/submissions/pay-all/approved", async (req, res) => {
  try {
    const approved = await TaskSubmission.find({ status: "approved" }).populate("taskId", "title reward");
    await Promise.all(
      approved.map((sub) => {
        const pts = sub.earnedPoints || sub.taskId?.reward || 0;
        return Promise.all([
          User.findByIdAndUpdate(sub.userId, { $inc: { creds: pts } }),
          Transaction.create({ userId: sub.userId, type: "credit", amount: pts, description: `Task reward: ${sub.taskId?.title || "Task"}` }),
          TaskSubmission.findByIdAndUpdate(sub._id, { status: "paid", paidAt: new Date() }),
        ]);
      })
    );
    res.json({ message: `${approved.length} submission(s) paid.` });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;