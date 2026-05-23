import { motion, AnimatePresence } from "framer-motion";
import { Crown, Medal, Award, CheckCircle, BarChart2, Zap } from "lucide-react";
import LeaderboardPodium from "./Leaderboardpodium";

// Pass `players` prop for backend data connectivity
const defaultPlayers = [
  { rank: 1, username: "PlayerOne",   points: 980, tasks: 15, surveys: 5, avatar: "https://i.pravatar.cc/40?img=1" },
  { rank: 2, username: "GamerGirl",   points: 870, tasks: 12, surveys: 7, avatar: "https://i.pravatar.cc/40?img=5" },
  { rank: 3, username: "NoobMaster",  points: 820, tasks: 10, surveys: 8, avatar: "https://i.pravatar.cc/40?img=3" },
  { rank: 4, username: "ProPlayer",   points: 750, tasks: 8,  surveys: 6, avatar: "https://i.pravatar.cc/40?img=4" },
  { rank: 5, username: "LuckyOne",    points: 700, tasks: 9,  surveys: 4, avatar: "https://i.pravatar.cc/40?img=7" },
  { rank: 6, username: "SpeedRacer",  points: 660, tasks: 7,  surveys: 3, avatar: "https://i.pravatar.cc/40?img=8" },
  { rank: 7, username: "ShadowX",     points: 610, tasks: 6,  surveys: 5, avatar: "https://i.pravatar.cc/40?img=9" },
];

const RankIcon = ({ rank }) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-orange-400" fill="currentColor" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" fill="currentColor" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-600" fill="currentColor" />;
  return null;
};

const rankColors = {
  1: "from-orange-400/20 to-orange-50 border-orange-300",
  2: "from-gray-300/20 to-gray-50 border-gray-300",
  3: "from-amber-400/20 to-amber-50 border-amber-300",
};

const LeaderboardGrid = ({ players = defaultPlayers }) => {
  const maxPoints = Math.max(...players.map(p => p.points));

  return (
    <div className="flex flex-col gap-2">
      {/* Podium — top 3 visual */}
      <LeaderboardPodium top3={players.filter(p => p.rank <= 3)} />

      {/* Divider */}
      <div className="flex items-center gap-3 mt-2 mb-1">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">All Rankings</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Column header (hidden on mobile) */}
      <div className="hidden sm:grid grid-cols-[48px_1fr_120px_100px_100px] gap-3 px-4 py-2">
        {["RANK", "PLAYER", "POINTS", "TASKS", "SURVEYS"].map((h) => (
          <span key={h} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</span>
        ))}
      </div>

      <AnimatePresence>
        {players.map((p, idx) => {
          const isTopThree = p.rank <= 3;
          const barWidth = Math.round((p.points / maxPoints) * 100);

          return (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.06 * idx, duration: 0.4 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
              className={`relative overflow-hidden rounded-2xl border bg-gradient-to-r
                ${isTopThree ? rankColors[p.rank] : "from-white to-white border-gray-100"}
                shadow-sm hover:shadow-md transition-shadow duration-200`}
            >
              {/* Progress bar BG */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-orange-500/30 rounded-full" style={{ width: `${barWidth}%` }} />

              <div className="grid grid-cols-[48px_1fr] sm:grid-cols-[48px_1fr_120px_100px_100px] gap-3 items-center px-4 py-3">
                {/* Rank */}
                <div className="flex flex-col items-center justify-center gap-0.5">
                  {isTopThree ? (
                    <RankIcon rank={p.rank} />
                  ) : (
                    <span className="text-lg font-black text-gray-300" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
                      {p.rank}
                    </span>
                  )}
                </div>

                {/* Player */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={p.avatar}
                      alt={p.username}
                      className="w-9 h-9 rounded-xl object-cover border-2 border-white shadow-sm"
                    />
                    {p.rank === 1 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-black text-sm truncate">{p.username}</p>
                    {/* Mobile sub-stats */}
                    <p className="text-xs text-gray-400 sm:hidden">
                      {p.points.toLocaleString()} pts · {p.tasks}T · {p.surveys}S
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                  <span className="font-black text-black text-sm" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
                    {p.points.toLocaleString()}
                  </span>
                </div>

                {/* Tasks */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 text-sm">{p.tasks}</span>
                </div>

                {/* Surveys */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 text-sm">{p.surveys}</span>
                </div>

              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default LeaderboardGrid;