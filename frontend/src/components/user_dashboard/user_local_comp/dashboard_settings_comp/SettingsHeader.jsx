// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_settings_comp/SettingsHeader.jsx

import { motion } from "framer-motion";
import { Settings, Zap } from "lucide-react";

const SettingsHeader = () => {
  return (
    <>
      <style>{`
        @keyframes floatIcon {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(-8px); }
        }
        @keyframes pulseBlobH {
          0%,100% { opacity: .08; transform: scale(1);   }
          50%      { opacity: .15; transform: scale(1.2); }
        }
        @keyframes shimmerTextH {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-orange-100 shadow-sm px-5 py-6 sm:px-8 sm:py-10"
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 sm:h-56 sm:w-56 rounded-full bg-orange-300 blur-3xl" style={{ animation: "pulseBlobH 3.5s ease-in-out infinite" }} />
        <div className="pointer-events-none absolute -bottom-10 right-8 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-orange-200 blur-3xl" style={{ animation: "pulseBlobH 4.5s ease-in-out infinite 1s" }} />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 240 }}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1"
            >
              <Zap size={10} className="text-orange-500" fill="currentColor" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
                Account Settings
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-2xl sm:text-3xl md:text-4xl font-black text-black"
            >
              Settings
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-1.5 text-xs sm:text-sm text-gray-400"
            >
              Manage your account, security and preferences
            </motion.p>
          </div>

          {/* floating icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 160 }}
            className="flex h-14 w-14 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl sm:rounded-3xl border border-orange-200 bg-orange-50"
            style={{ animation: "floatIcon 3.5s ease-in-out infinite", boxShadow: "0 0 24px rgba(249,115,22,0.12)" }}
          >
            <Settings
              size={24}
              className="text-orange-500 sm:hidden"
              style={{ filter: "drop-shadow(0 0 6px rgba(249,115,22,0.5))" }}
            />
            <Settings
              size={36}
              className="text-orange-500 hidden sm:block"
              style={{ filter: "drop-shadow(0 0 8px rgba(249,115,22,0.5))" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default SettingsHeader;