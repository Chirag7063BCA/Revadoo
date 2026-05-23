// LOCATION: Backend/models/Task.js  (REPLACE existing file)
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title:       { type: String,  required: true },
    description: { type: String,  default: "" },

    // Admin uploads their own image — stored as base64 data URL
    // Swap for S3 URL string in production
    thumbnail:   { type: String,  default: "" },

    // Free-text platform — no enum restriction, admin decides
    platform:    { type: String,  required: true, default: "custom" },

    reward:      { type: Number,  required: true },

    // Time limit in MINUTES — drives countdown timer in user dashboard
    // 0 = no time limit
    timeMinutes: { type: Number,  default: 1 },

    link:        { type: String,  default: "" },
    isActive:    { type: Boolean, default: true },
    expiresAt:   { type: Date,    default: null },  // null = never expires
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);