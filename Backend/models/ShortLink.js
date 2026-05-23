const mongoose = require("mongoose");

const shortLinkSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      default: "Shortlink",
      trim: true,
    },
    externalUrl: {
      type: String,
      default: "",
      trim: true,
    },
    reward: {
      type: Number,
      required: true,
      min: 0,
    },
    shortlinkType: {
      type: String,
      enum: ["starter", "standard", "advanced", "premium"],
      default: "starter",
    },
    timerSeconds: {
      type: Number,
      default: 10,
      min: 3,
      max: 300,
    },
    verificationMethod: {
      type: String,
      enum: ["checkbox", "math"],
      default: "checkbox",
    },
    scheduledStartAt: {
      type: Date,
      default: null,
    },
    scheduledEndAt: {
      type: Date,
      default: null,
    },
    topImageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    topText: {
      type: String,
      default: "",
      trim: true,
    },
    middleImageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    middleText: {
      type: String,
      default: "",
      trim: true,
    },
    extraText: {
      type: String,
      default: "",
      trim: true,
    },
    actionButtonLabel: {
      type: String,
      default: "Redirect to Website",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ShortLink || mongoose.model("ShortLink", shortLinkSchema);
