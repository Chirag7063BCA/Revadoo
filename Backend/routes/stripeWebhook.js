// stripeWebhook.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");

router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const { userId, walletCredit } = intent.metadata;

    try {
      const already = await Transaction.findOne({ stripePaymentIntentId: intent.id });
      if (!already && userId) {
        const credit = parseFloat(walletCredit);
        let wallet = await Wallet.findOne({ userId });
        if (!wallet) wallet = await Wallet.create({ userId });
        wallet.balance += credit;
        wallet.totalEarned += credit;
        await wallet.save();
        await Transaction.create({
          userId,
          type: "credit",
          amount: credit,
          description: "Wallet top-up via Stripe (webhook)",
          status: "completed",
          category: "stripe_topup",
          stripePaymentIntentId: intent.id,
        });
      }
    } catch (e) {
      console.error("Webhook error:", e);
    }
  }

  res.json({ received: true });
});

module.exports = router;