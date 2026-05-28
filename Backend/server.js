// server.js
const dns = require("dns");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

dns.setDefaultResultOrder("ipv4first");

// Use custom DNS resolvers only when explicitly configured.
const dnsServers = (process.env.DNS_SERVERS || "")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);
if (dnsServers.length) {
  dns.setServers(dnsServers);
}

const ensureIndexes = require("./utils/dbIndexes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");

const normalizeOrigin = (value) => String(value || "").replace(/\/$/, "");
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  normalizeOrigin(process.env.CLIENT_URL || "http://localhost:5174"),
  normalizeOrigin(process.env.FRONTEND_BASE_URL || ""),
  normalizeOrigin(process.env.ADMIN_CLIENT_URL || ""),
].filter(Boolean);
const allowedOrigins = new Set(defaultOrigins);

// Routes import
const walletRoutes = require("./routes/walletRoutes");
const userRoutes = require("./routes/userRoutes");
// 👇 NEW: Survey route import kiya
const surveyRoutes = require("./routes/surveyRoutes");
const leaderboardRoutes = require("./routes/leaderboard");
const lotteryRoutes = require("./routes/lotteries");
const blogRoutes = require("./routes/blog");

// ✅ Initialize app FIRST
const app = express();

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(compression());
// MUST be before express.json()
app.use(
  "/api/wallet/stripe-webhook",
  express.raw({ type: "application/json" }),
  require("./routes/stripeWebhook")
);

// Then your existing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ FIXED server.js — only change these 2 lines order
app.use("/api/auth", require("./routes/auth"));
app.use("/api/wallet", walletRoutes);
app.use("/api/user", userRoutes);

// Admin task management routes
app.use("/api/tasks/bundle", require("./routes/taskBundle"));
app.use("/api/task-submissions", require("./routes/taskSubmissions"));
app.use("/api/admin/tasks", require("./routes/adminTasks"));

// Quiz & Attempt Routes
app.use("/api/quizzes", require("./routes/quizzes"));
app.use("/api/attempts", require("./routes/attempts"));

// Contact & Feedback Routes
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/blog", blogRoutes);
app.use("/api/spin", require("./routes/spin"));
app.use("/api/shortlinks", require("./routes/shortlinks"));

// ⚠️ STATS must come BEFORE /api/referrals
app.use("/api/referrals", require("./routes/referral"));

// 👇 NEW: Survey API route register kiya
app.use("/api/surveys", surveyRoutes);

//top leaderboard route
app.use("/api/leaderboard", leaderboardRoutes);

//Admin routes
app.use("/api/admin/leaderboard", require("./routes/adminLeaderboard"));
app.use("/api/admin/referrals", require("./routes/adminReferral"));
app.use("/api/admin/users", require("./routes/adminUsers"));
app.use("/api/admin/dashboard", require("./routes/adminDashboard"));

// Lottery routes
app.use("/api/lotteries", lotteryRoutes);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend running successfully",
  });
});

const frontendBase = (process.env.FRONTEND_BASE_URL || process.env.CLIENT_URL || "http://localhost:5174").replace(/\/$/, "");

app.get("/s/:code", (req, res) => {
  return res.redirect(`${frontendBase}/s/${encodeURIComponent(req.params.code)}`);
});

app.get("/visit/:code", (req, res) => {
  return res.redirect(
    `${frontendBase}/visit/${encodeURIComponent(req.params.code)}`
  );
});

app.get("/verify", (req, res) => {
  const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  return res.redirect(`${frontendBase}/verify${query}`);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 3030;

const MONGO_RETRY_MS = Number(process.env.MONGO_RETRY_MS || 10000);
let indexesEnsured = false;

const connectMongoWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("MongoDB connected successfully");

    if (!indexesEnsured) {
      indexesEnsured = true;
      ensureIndexes();
    }
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.log(`Retrying MongoDB connection in ${MONGO_RETRY_MS / 1000}s...`);
    setTimeout(connectMongoWithRetry, MONGO_RETRY_MS);
  }
};

// Start API server even if DB is temporarily unavailable.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectMongoWithRetry();
});
