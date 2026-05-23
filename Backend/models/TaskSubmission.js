// LOCATION: Backend/models/TaskSubmission.js
const mongoose = require("mongoose");

const taskSubmissionSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true },
    taskId:       { type: mongoose.Schema.Types.ObjectId, ref: "Task",  required: true },

    // Base64 data URL stored directly — swap for S3 URL in production
    screenshotData: { type: String, default: "" },

    // pending → approved → paid   |   pending → rejected
    status: {
      type:    String,
      enum:    ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },

    submittedAt:    { type: Date,   default: Date.now },
    reviewDeadline: { type: Date },           // submittedAt + 24 h
    reviewedAt:     { type: Date,   default: null },
    paidAt:         { type: Date,   default: null },
    reviewNote:     { type: String, default: "" },
    earnedPoints:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Unique: one submission per user per task (prevent duplicate claims)
taskSubmissionSchema.index({ userId: 1, taskId: 1 }, { unique: true });

// Reuse compiled model when this file is required with different path casing.
module.exports =
  mongoose.models.TaskSubmission ||
  mongoose.model("TaskSubmission", taskSubmissionSchema);