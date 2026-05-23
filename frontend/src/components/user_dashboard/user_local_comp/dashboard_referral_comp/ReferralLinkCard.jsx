// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_referral_comp/ReferralLinkCard.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCheck, Hash, AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import { apiUrl } from "../../../../services/apiConfig";

const ReferralLinkCard = () => {
  const [referralCode, setReferralCode] = useState("");
  const [copied,       setCopied]       = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(apiUrl("/auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReferralCode(res.data.referralCode || "");
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const copyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <style>{`
        @keyframes shimmerPill {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes blobFloat {
          0%,100% { transform: scale(1);    opacity: .08; }
          50%      { transform: scale(1.25); opacity: .15; }
        }
        @keyframes dotPulse {
          0%,100% { transform: scale(1);   opacity: 1;   }
          50%      { transform: scale(1.6); opacity: 0.6; }
        }
        @keyframes codeGlow {
          0%,100% { box-shadow: 0 0 0px rgba(249,115,22,0.1); }
          50%      { box-shadow: 0 0 20px rgba(249,115,22,0.2); }
        }
        @keyframes cardPulse {
          0%,100% { box-shadow: 0 2px 16px rgba(249,115,22,0.08); }
          50%      { box-shadow: 0 4px 28px rgba(249,115,22,0.18); }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl bg-white border border-orange-100"
        style={{ animation: "cardPulse 3s ease-in-out infinite" }}
      >
        {/* top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

        {/* blob */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-orange-400 blur-3xl"
          style={{ animation: "blobFloat 4s ease-in-out infinite" }}
        />

        <div className="relative z-10 px-5 py-6 sm:px-7 sm:py-7">

          {/* header row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50">
                <Hash size={17} className="text-orange-500" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500">
                  Your Referral Code
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Share this code — friends enter it on signup
                </p>
              </div>
            </div>

            {/* active pill */}
            <div
              className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-[10px] font-black text-white"
              style={{
                background: "linear-gradient(90deg,#f97316 0%,#fb923c 40%,#f97316 60%,#ea580c 100%)",
                backgroundSize: "200% auto",
                animation: "shimmerPill 2.5s linear infinite",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-white"
                style={{ animation: "dotPulse 1.5s ease-in-out infinite" }}
              />
              ACTIVE
            </div>
          </div>

          {/* CODE display */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="ld"
                className="mb-6 h-20 w-full animate-pulse rounded-2xl bg-gray-100"
              />
            ) : error ? (
              <motion.div
                key="er"
                className="mb-6 flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-6"
              >
                <AlertCircle size={14} className="text-red-400" />
                <p className="text-sm text-red-400">Failed to load — check your token</p>
              </motion.div>
            ) : referralCode ? (
              <motion.div
                key="code"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 py-7"
                style={{ animation: "codeGlow 3s ease-in-out infinite" }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-2">
                  Your Code
                </p>
                <p
                  className="text-4xl font-black tracking-[0.3em] sm:text-5xl"
                  style={{
                    background: "linear-gradient(135deg,#f97316,#ea580c,#f97316)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "shimmerPill 3s linear infinite",
                  }}
                >
                  {referralCode}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="nocode"
                className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 py-7 gap-2"
              >
                <RefreshCw size={20} className="text-gray-300" />
                <p className="text-sm text-gray-400">No code yet — re-register or contact support</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* copy button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={copyCode}
            disabled={loading || error || !referralCode}
            className="relative w-full overflow-hidden flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black transition-all duration-300 disabled:opacity-40"
            style={
              copied
                ? { background: "#22c55e", boxShadow: "0 0 24px rgba(34,197,94,0.4)", color: "#fff" }
                : { background: "linear-gradient(135deg,#ea580c,#f97316,#fb923c)", boxShadow: "0 0 24px rgba(249,115,22,0.35)", color: "#fff" }
            }
          >
            {!copied && (
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.4) 50%,transparent 100%)",
                  backgroundSize: "200% auto",
                  animation: "shimmerPill 2s linear infinite",
                }}
              />
            )}
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="y"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="relative z-10 flex items-center gap-2"
                >
                  <CheckCheck size={16} /> Code Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="n"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="relative z-10 flex items-center gap-2"
                >
                  <Copy size={16} /> Copy Code
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* hint */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-orange-200" />
            <p className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <Sparkles size={10} className="text-orange-400" />
              Friend enters this code on signup — you earn automatically
            </p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-orange-200" />
          </div>

        </div>
      </motion.div>
    </>
  );
};

export default ReferralLinkCard;
// # 🚀 Referral System — Postman Testing Guide

// Base URL: `http://localhost:5000`

// ---

// ## 📋 Table of Contents
// 1. [Register User](#1-register-user)
// 2. [Login](#2-login)
// 3. [Get Current User](#3-get-current-user)
// 4. [Generate Referral Code](#4-generate-referral-code)
// 5. [Register New User WITH Referral Code](#5-register-new-user-with-referral-code)
// 6. [Check Referral Stats](#6-check-referral-stats)
// 7. [Check Referral Grid](#7-check-referral-grid)
// 8. [Full Flow Summary](#8-full-flow-summary)

// ---

// ## 1. Register User

// **Creates a new user. Every new user gets an auto-generated referral code.**

// ```
// Method : POST
// URL    : http://localhost:5000/api/auth/register
// Headers: Content-Type: application/json
// ```

// **Body (raw → JSON):**
// ```json
// {
//   "username": "Sristy",
//   "email": "sristy123@gmail.com",
//   "password": "123456",
//   "confirm": "123456"
// }
// ```

// **Expected Response (201):**
// ```json
// {
//   "message": "Account created successfully!",
//   "token": "eyJhbGci...",
//   "user": {
//     "id": "69bc342c...",
//     "username": "Sristy",
//     "email": "sristy123@gmail.com",
//     "creds": 250,
//     "referralCode": "65B36A",
//     "createdAt": "2026-03-19T17:36:44.275Z"
//   }
// }
// ```

// > ✅ Save the `token` — you'll need it for all protected routes
// > ✅ Save the `referralCode` — share this with friends

// ---

// ## 2. Login

// **Login with existing account.**

// ```
// Method : POST
// URL    : http://localhost:5000/api/auth/login
// Headers: Content-Type: application/json
// ```

// **Body (raw → JSON):**
// ```json
// {
//   "email": "sristy123@gmail.com",
//   "password": "123456"
// }
// ```

// **Expected Response (200):**
// ```json
// {
//   "message": "Login successful!",
//   "token": "eyJhbGci...",
//   "user": {
//     "id": "69bc342c...",
//     "username": "Sristy",
//     "email": "sristy123@gmail.com",
//     "creds": 250,
//     "createdAt": "2026-03-19T17:36:44.275Z"
//   }
// }
// ```

// > ✅ Copy the `token` from this response

// ---

// ## 3. Get Current User

// **Returns logged-in user's profile including referral code.**

// ```
// Method : GET
// URL    : http://localhost:5000/api/auth/me
// Headers: Authorization: Bearer <YOUR_TOKEN>
// ```

// **Expected Response (200):**
// ```json
// {
//   "id": "69bc342c...",
//   "username": "Sristy",
//   "email": "sristy123@gmail.com",
//   "creds": 250,
//   "referralCode": "65B36A",
//   "createdAt": "2026-03-19T17:36:44.275Z"
// }
// ```

// > ✅ `referralCode` is shown here — copy it to share with friends

// ---

// ## 4. Generate Referral Code

// **Use this ONLY for old users who registered before the referral system was added.
// New users get a code automatically on register.**

// ```
// Method : POST
// URL    : http://localhost:5000/api/auth/generate-referral-code
// Headers: Authorization: Bearer <YOUR_TOKEN>
// ```

// **No body needed.**

// **Expected Response (200):**
// ```json
// {
//   "referralCode": "65B36A"
// }
// ```

// > ✅ If you already have a code — it just returns your existing one
// > ✅ If you don't have one — it generates and saves a new one

// ---

// ## 5. Register New User WITH Referral Code

// **Register a second user using the first user's referral code.**

// ```
// Method : POST
// URL    : http://localhost:5000/api/auth/register
// Headers: Content-Type: application/json
// ```

// **Body (raw → JSON):**
// ```json
// {
//   "username": "testuser2",
//   "email": "testuser2@gmail.com",
//   "password": "123456",
//   "confirm": "123456",
//   "referral": "65B36A"
// }
// ```

// **Expected Response (201):**
// ```json
// {
//   "message": "Account created successfully!",
//   "token": "eyJhbGci...",
//   "user": {
//     "id": "69bc3914...",
//     "username": "testuser2",
//     "email": "testuser2@gmail.com",
//     "creds": 250,
//     "referralCode": "E10BCC",
//     "referredBy": "69bc342c...",
//     "referredByCode": "65B36A",
//     "createdAt": "2026-03-19T17:57:40.275Z"
//   }
// }
// ```

// > ✅ `referredBy` = Sristy's ID — referral is linked
// > ✅ `testuser2` also gets their own unique referral code `E10BCC`
// > ✅ Sristy gets +100 tokens (50 base + 50 milestone bonus for 1st referral)

// ---

// ## 6. Check Referral Stats

// **Returns total referrals, active referrals and total earnings for logged-in user.**

// ```
// Method : GET
// URL    : http://localhost:5000/api/referrals/stats
// Headers: Authorization: Bearer <SRISTY_TOKEN>
// ```

// **Expected Response (200):**
// ```json
// {
//   "totalReferrals": 1,
//   "activeReferrals": 1,
//   "totalEarnings": 100
// }
// ```

// > ✅ Used by `ReferralsStats.jsx` to show the 3 stat cards on dashboard

// ---

// ## 7. Check Referral Grid

// **Returns list of all users referred by logged-in user.**

// ```
// Method : GET
// URL    : http://localhost:5000/api/referrals
// Headers: Authorization: Bearer <SRISTY_TOKEN>
// ```

// **Expected Response (200):**
// ```json
// [
//   {
//     "_id": "69bc3914...",
//     "name": "testuser2",
//     "joined": "2026-03-19T17:57:40.790Z",
//     "status": "Active",
//     "earnings": 100
//   }
// ]
// ```

// > ✅ Used by `ReferralsGrid.jsx` to show the referrals table on dashboard

// ---

// ## 8. Full Flow Summary

// ```
// Step 1 → Register User 1 (Sristy)         POST /api/auth/register
// Step 2 → Login as Sristy                  POST /api/auth/login
// Step 3 → Get referral code                GET  /api/auth/me
//                                           OR
//                                           POST /api/auth/generate-referral-code
// Step 4 → Share code "65B36A" with friend
// Step 5 → Friend registers with code       POST /api/auth/register + "referral": "65B36A"
// Step 6 → Check Sristy's stats             GET  /api/referrals/stats
// Step 7 → Check Sristy's referral grid     GET  /api/referrals
// ```

// ---

// ## 🎯 Milestone Bonuses

// When a referrer hits these counts they get a bonus on top of the 50 TKN base reward:

// | Milestone | Referrals Needed | Bonus Tokens | Total Earned |
// |-----------|-----------------|--------------|--------------|
// | Starter   | 1               | +50 TKN      | 100 TKN      |
// | Raider    | 5               | +300 TKN     | 350 TKN      |
// | Elite     | 15              | +1,000 TKN   | 1,050 TKN    |
// | Legend    | 50              | +5,000 TKN   | 5,050 TKN    |

// ---

// ## ⚠️ Common Errors

// | Error | Reason | Fix |
// |-------|--------|-----|
// | `"Not authorized. Please login."` | Token missing or wrong | Add `Authorization: Bearer <token>` in Headers |
// | `"Invalid referral code"` | Code doesn't exist in DB | Check code is correct and user exists |
// | `"This email is already registered"` | Duplicate email | Use a different email |
// | `"Route not found"` | Wrong URL | Check base URL and endpoint spelling |
// | `"Passwords do not match"` | `password` ≠ `confirm` | Make both fields identical |

// ---

// ## 📁 Files Changed

// | File | What Changed |
// |------|-------------|
// | `routes/auth.js` | Added `generate-referral-code` route, fixed `/me` response shape, added milestone bonuses on register |
// | `routes/referral.js` | Added `protectRoute`, filter by logged-in user only |
// | `routes/referralStats.js` | Added `protectRoute`, fixed ObjectId for aggregate |
// | `middleware/auth.js` | Fixed `"secretkey"` → `process.env.JWT_SECRET` |
// | `server.js` | Fixed route order — stats before referrals |
// | `ReferralLinkCard.jsx` | Shows referral CODE instead of link |