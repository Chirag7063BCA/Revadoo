// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_referral_comp/ReferralsHeader.jsx

import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";

const ReferralsHeader = () => {
  return (
    <>
      <style>{`
        @keyframes pulseBlob1 {
          0%,100% { transform: scale(1);   opacity: .10; }
          50%      { transform: scale(1.3); opacity: .20; }
        }
        @keyframes pulseBlob2 {
          0%,100% { transform: scale(1);   opacity: .08; }
          50%      { transform: scale(1.2); opacity: .15; }
        }
        @keyframes shimmerText {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes floatIcon {
          0%,100% { transform: translateY(0px) rotate(0deg);   }
          33%      { transform: translateY(-8px) rotate(-4deg); }
          66%      { transform: translateY(-4px) rotate(3deg);  }
        }
        @keyframes borderPulse {
          0%,100% { border-color: rgba(249,115,22,0.3); }
          50%      { border-color: rgba(249,115,22,0.7); }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: -32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-white border border-orange-100 shadow-sm"
      >
        {/* blobs */}
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-orange-400 blur-[80px]"
          style={{ animation: "pulseBlob1 3.5s ease-in-out infinite" }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 right-8 h-56 w-56 rounded-full bg-orange-300 blur-[70px]"
          style={{ animation: "pulseBlob2 4.5s ease-in-out infinite 1s" }}
        />

        {/* top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

        <div className="relative z-10 px-6 py-10 sm:px-8 sm:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              {/* badge */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 240 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-50 px-4 py-1.5"
                style={{ animation: "borderPulse 2.5s ease-in-out infinite" }}
              >
                <Zap size={11} className="text-orange-500" fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">
                  Earn · Refer · Redeem
                </span>
              </motion.div>

              {/* headline */}
              <motion.h1
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.55 }}
                className="text-5xl font-black leading-none tracking-tight text-black sm:text-6xl md:text-7xl"
              >
                Referral
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg,#f97316 0%,#ea580c 40%,#f97316 65%,#c2410c 100%)",
                    backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "shimmerText 4s linear infinite",
                  }}
                >
                  Rewards
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 max-w-md text-sm leading-relaxed text-gray-500"
              >
                Invite friends to{" "}
                <span className="font-bold text-orange-500">REVADOO</span>,
                referral and redeem Creds, perks and rewards.
              </motion.p>

              {/* stat pills */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {[
                  { label: "Per referral", value: "50 TKN" },
                  { label: "Legend tier",  value: "5,000 TKN" },
                  { label: "Active users", value: "12.4K" },
                ].map(({ label, value }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-3 py-1.5"
                  >
                    <span className="text-[10px] text-gray-400">{label}</span>
                    <span className="text-[11px] font-black text-orange-500">{value}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* floating flame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 140 }}
              className="flex h-28 w-28 shrink-0 items-center justify-center self-start rounded-3xl border border-orange-200 bg-orange-50 sm:h-32 sm:w-32 md:self-auto"
              style={{
                animation: "floatIcon 4s ease-in-out infinite",
                boxShadow: "0 0 30px rgba(249,115,22,0.15)",
              }}
            >
              <Flame
                size={48}
                className="text-orange-500"
                style={{ filter: "drop-shadow(0 0 12px rgba(249,115,22,0.7))" }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ReferralsHeader;