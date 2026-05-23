const mongoose = require("mongoose");

const shortLinkVisitSchema = new mongoose.Schema(
  {
    shortLinkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortLink",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    visitToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["started", "verified", "expired"],
      default: "started",
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ShortLinkVisit ||
  mongoose.model("ShortLinkVisit", shortLinkVisitSchema);
