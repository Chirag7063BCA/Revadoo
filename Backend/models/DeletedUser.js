// Backend/models/DeletedUser.js
const mongoose = require("mongoose");

const deletedUserSchema = new mongoose.Schema({
  // ── Original user data ──────────────────────────
  originalId:     { type: mongoose.Schema.Types.ObjectId, required: true },
  username:       { type: String },
  email:          { type: String },
  referralCode:   { type: String },
  referredBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  referredByCode: { type: String, default: null },
  creds:          { type: Number, default: 0 },
  wallet:         { type: Number, default: 0 },
  createdAt:      { type: Date },

  // ── Deletion metadata ───────────────────────────
  deletedAt:      { type: Date,   default: Date.now },
  reason:         { type: String, default: "User requested account deletion" },

  // ✅ NEW — reason user selected from the form
  deletionReason: { type: String, default: "" },
});

module.exports = mongoose.model("DeletedUser", deletedUserSchema);