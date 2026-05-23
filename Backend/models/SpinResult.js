const mongoose = require("mongoose");

const spinResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rewardType: { type: String, enum: ["credits", "cash", "none"], required: true },
  rewardValue: { type: Number, default: 0 },
  rewardLabel: { type: String, default: "" },
  spinType: { type: String, enum: ["free", "paid"], default: "free" },
  segmentIndex: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

spinResultSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("SpinResult", spinResultSchema);