const mongoose = require("mongoose");

const shortLinkCompletionSchema = new mongoose.Schema(
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
    reward: {
      type: Number,
      required: true,
      min: 0,
    },
    visitToken: {
      type: String,
      required: true,
      trim: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

shortLinkCompletionSchema.index(
  { shortLinkId: 1, userId: 1 },
  { unique: true }
);

module.exports =
  mongoose.models.ShortLinkCompletion ||
  mongoose.model("ShortLinkCompletion", shortLinkCompletionSchema);
