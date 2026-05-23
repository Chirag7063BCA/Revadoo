import { motion } from "framer-motion";
import { Crown } from "lucide-react";

const defaultTop3 = [
  { rank: 1, username: "PlayerOne", points: 980, avatar: "https://i.pravatar.cc/100?img=1" },
  { rank: 2, username: "GamerGirl", points: 870, avatar: "https://i.pravatar.cc/100?img=5" },
  { rank: 3, username: "NoobMaster", points: 820, avatar: "https://i.pravatar.cc/100?img=3" },
];

const podiumConfig = {
  1: { height: "h-36 sm:h-44", order: "order-2", avatarSize: "w-20 h-20 sm:w-24 sm:h-24", ring: "ring-4 ring-orange-400", labelSize: "text-5xl", delay: 0.2  },
  2: { height: "h-24 sm:h-32", order: "order-1", avatarSize: "w-16 h-16 sm:w-20 sm:h-20", ring: "ring-4 ring-gray-300",   labelSize: "text-4xl", delay: 0.35 },
  3: { height: "h-20 sm:h-28", order: "order-3", avatarSize: "w-16 h-16 sm:w-20 sm:h-20", ring: "ring-4 ring-orange-300", labelSize: "text-4xl", delay: 0.35 },
};

const podiumBg  = { 1: "bg-orange-400", 2: "bg-gray-800", 3: "bg-black" };
const coinStyle = { 1: "bg-orange-500 text-white", 2: "bg-gray-100 text-gray-800", 3: "bg-orange-50 text-orange-700" };

const PodiumPlayer = ({ player, userData }) => {
  const cfg = podiumConfig[player.rank];
  return (
    <div className={`flex flex-col items-center ${cfg.order} relative`} style={{ flex: 1 }}>
      {/* Crown */}
      {player.rank === 1 && (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="absolute -top-7 z-30"
        >
          <Crown className="w-8 h-8 text-orange-400 drop-shadow-lg" fill="currentColor" />
        </motion.div>
      )}

      {/* Avatar */}
      <motion.div
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: cfg.delay, type: "spring", stiffness: 260, damping: 18 }}
        className="relative mb-2 z-20"
      >
        <img
          src={player.avatar || userData?.avatar}
          alt={player.username}
          className={`${cfg.avatarSize} rounded-full object-cover ${cfg.ring} shadow-xl bg-white`}
        />
        {player.rank === 1 && (
          <div className="absolute inset-0 rounded-full bg-orange-400 opacity-25 blur-xl scale-125 -z-10" />
        )}
      </motion.div>

      {/* Coin badge */}
      <motion.span
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: cfg.delay + 0.15 }}
        className={`px-3 py-0.5 rounded-full text-xs font-black shadow mb-1 ${coinStyle[player.rank]}`}
      >
        {player.points.toLocaleString()} pts
      </motion.span>

      {/* Name */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: cfg.delay + 0.2 }}
        className="text-sm font-black text-black text-center mb-2 leading-tight px-1"
      >
        {player.username}
      </motion.p>

      {/* Block */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: cfg.delay + 0.05, duration: 0.45, ease: "easeOut" }}
        style={{ originY: 1 }}
        className={`w-full ${cfg.height} ${podiumBg[player.rank]} rounded-t-2xl flex items-center justify-center shadow-lg overflow-hidden relative`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        <span
          className={`${cfg.labelSize} font-black text-white/80 select-none`}
          style={{ fontFamily: "Impact, 'Bebas Neue', sans-serif" }}
        >
          {player.rank}
        </span>
      </motion.div>
    </div>
  );
};

const LeaderboardPodium = ({ top3 = defaultTop3, userData }) => {
  const sorted = [
    top3.find(p => p.rank === 2),
    top3.find(p => p.rank === 1),
    top3.find(p => p.rank === 3),
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-2 sm:px-6 pt-10 pb-0"
    >
      <div className="flex items-end justify-center gap-2 sm:gap-4">
        {sorted.map(player => (
          <PodiumPlayer key={player.rank} player={player} userData={userData} />
        ))}
      </div>
    </motion.div>
  );
};

export default LeaderboardPodium;