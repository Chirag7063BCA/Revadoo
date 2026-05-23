import { motion } from "framer-motion";
import { Trophy, Flame } from "lucide-react";

const LeaderboardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-1"
    >
      {/* Left: Title block */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/40">
            <Trophy className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          {/* Pulse ring */}
          <span className="absolute -inset-1 rounded-2xl border-2 border-orange-400 opacity-40 animate-ping" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1
              className="text-3xl sm:text-4xl font-black tracking-tight text-black leading-none"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", letterSpacing: "0.04em" }}
            >
              LEADERBOARD
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-0.5 font-medium tracking-wide">
            Season 04 · Week 12 Rankings
          </p>
        </div>
      </div>

      {/* Right: Live badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
      >
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="text-orange-400">Live</span>
        <span className="text-gray-400">·</span>
        <span>Top 100</span>
      </motion.div>
    </motion.div>
  );
};

export default LeaderboardHeader;