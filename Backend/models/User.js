const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  tempPassword: {
    type: String,
    default: null,
  },

  wallet: {
    type: Number,
    default: 0,
  },

  creds: {
    type: Number,
    default: 250,
  },

  avatar: {
    type: String,
    default: null,
  },

  lastSpinTime: {
    type: Date,
    default: null,
  },

  totalSpins: {
    type: Number,
    default: 0,
  },

  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },

  referredByCode: {
    type: String,
    default: null,
  },

  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  status: {
    type: String,
    enum: ["active", "banned"],
    default: "active",
  },

  resetPasswordOtp: {
    type: String,
    default: null,
  },

  resetPasswordExpires: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
