// LOCATION: Backend/utils/dbIndexes.js
// Call once after mongoose.connect() in server.js:
//   require("./utils/dbIndexes")();
//
// Creates the indexes that make every query in this app fast.
// Safe to call on every startup — createIndex is idempotent.

const mongoose = require("mongoose");

module.exports = async function ensureIndexes() {
  try {
    const db = mongoose.connection.db;

    // ── Task ─────────────────────────────────────
    // list query: isActive tasks sorted by createdAt
    await db.collection("tasks").createIndex(
      { isActive: 1, createdAt: -1 },
      { background: true }
    );
    // expiry filtering
    await db.collection("tasks").createIndex(
      { expiresAt: 1 },
      { background: true, sparse: true }
    );

    // ── TaskSubmission ────────────────────────────
    // unique compound already in model schema — ensure it exists
    await db.collection("tasksubmissions").createIndex(
      { userId: 1, taskId: 1 },
      { unique: true, background: true }
    );
    // admin review queue
    await db.collection("tasksubmissions").createIndex(
      { status: 1, submittedAt: -1 },
      { background: true }
    );
    // aggregate by taskId (used in admin list)
    await db.collection("tasksubmissions").createIndex(
      { taskId: 1, status: 1 },
      { background: true }
    );
    // user's own submissions
    await db.collection("tasksubmissions").createIndex(
      { userId: 1, submittedAt: -1 },
      { background: true }
    );

    // ── User ─────────────────────────────────────
    // leaderboard sort
    await db.collection("users").createIndex(
      { creds: -1 },
      { background: true }
    );

    // ── Referral ─────────────────────────────────
    await db.collection("referrals").createIndex(
      { referrer: 1, createdAt: -1 },
      { background: true }
    );
    await db.collection("referrals").createIndex(
      { status: 1 },
      { background: true }
    );

    // ── Transaction ───────────────────────────────
    await db.collection("transactions").createIndex(
      { userId: 1, createdAt: -1 },
      { background: true }
    );

    console.log("✅ DB indexes ensured");
  } catch (err) {
    console.error("Index creation warning:", err.message);
  }
};