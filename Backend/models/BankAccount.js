// BankAccount.js
const mongoose = require("mongoose");

const bankAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountHolderName: { type: String, required: true },
    accountNumberLast4: { type: String, required: true },
    accountNumberEncrypted: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
    upiId: { type: String, default: null },
    isPrimary: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BankAccount", bankAccountSchema);