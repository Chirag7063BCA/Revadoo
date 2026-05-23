// Backend/models/Feedback.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  // ── Who sent it ─────────────────────────────────
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  username: { type: String, default: "Anonymous" },
  email:    { type: String, default: "" },

  // ── Feedback content ────────────────────────────
  subject:  { type: String, required: true, trim: true },
  message:  { type: String, required: true, trim: true },

  // ── Status ──────────────────────────────────────
  status: {
    type:    String,
    enum:    ["pending", "reviewed", "resolved"],
    default: "pending",
  },

  // ── Timestamps ──────────────────────────────────
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", feedbackSchema);