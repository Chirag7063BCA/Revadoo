const mongoose = require("mongoose");

const userTaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "completed",
    },
    earnedPoints: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate completion of same task by same user
userTaskSchema.index({ userId: 1, taskId: 1 }, { unique: true });

module.exports = mongoose.model("UserTask", userTaskSchema);