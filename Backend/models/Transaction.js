// Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit", "conversion"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    credsAmount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "reversed"],
      default: "completed",
    },
    category: {
      type: String,
      enum: [
        "task_reward",
        "creds_conversion",
        "withdrawal",
        "refund",
        "bonus",
        "stripe_topup",
      ],
      default: "task_reward",
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
      sparse: true,
    },
    withdrawalDetails: {
      method: { type: String, enum: ["bank_transfer", "upi"] },
      bankName: String,
      accountHolderName: String,
      accountNumberLast4: String,
      ifscCode: String,
      upiId: String,
      referenceId: String,
    },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    emailSent: { type: Boolean, default: false },
    processedAt: { type: Date, default: null },
    failureReason: { type: String, default: null },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);