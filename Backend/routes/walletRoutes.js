// walletRoutes.js
const express = require("express");
const router = express.Router();
const {
  getBalance,
  getTransactions,
  addMoney,
  withdrawMoney,
  convertCreds,
  setWithdrawalPin,
  verifyWithdrawalPin,
  withdrawToBank,
  saveBankAccount,
  getBankAccounts,
  createPaymentIntent,
  confirmPayment,
  adminGetWithdrawals,
  adminWithdrawalAction,
} = require("../Controllers/walletController");
const { withdrawalLimiter, conversionLimiter, pinLimiter } = require("../utils/rateLimiter");

router.get("/balance/:userId", getBalance);
router.get("/transactions/:userId", getTransactions);
router.post("/add", addMoney);
router.post("/withdraw", withdrawMoney);
router.post("/convert-creds", conversionLimiter, convertCreds);
router.post("/set-withdrawal-pin", setWithdrawalPin);
router.post("/verify-withdrawal-pin", pinLimiter, verifyWithdrawalPin);
router.post("/save-bank-account", saveBankAccount);
router.get("/bank-accounts/:userId", getBankAccounts);
router.post("/withdraw-to-bank", withdrawalLimiter, withdrawToBank);
router.post("/create-payment-intent", createPaymentIntent);
router.post("/confirm-payment", confirmPayment);
router.get("/admin/withdrawals", adminGetWithdrawals);
router.post("/admin/withdrawals/:id/action", adminWithdrawalAction);

module.exports = router;
