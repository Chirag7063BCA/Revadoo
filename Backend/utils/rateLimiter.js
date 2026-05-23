// rateLimiter.js
const rateLimit = require("express-rate-limit");

const withdrawalLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  message: {
    message: "Too many withdrawal requests. Maximum 3 per day allowed.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const conversionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many conversion requests. Please try again after an hour.",
  },
});

const pinLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many PIN attempts. Locked for 30 minutes.",
  },
});

module.exports = { withdrawalLimiter, conversionLimiter, pinLimiter };