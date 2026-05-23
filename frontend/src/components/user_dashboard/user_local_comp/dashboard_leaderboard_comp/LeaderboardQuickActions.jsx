import { motion } from "framer-motion";
import { Trophy, Gift, Zap, BarChart2 } from "lucide-react";

// Pass `onAction` prop to connect button callbacks to backend
const actions = [
  {
    icon: Trophy,
    label: "Top Players",
    desc: "View hall of fame",
    color: "text-orange-500",
    bg: "bg-orange-50",
    hover: "hover:bg-orange-100",
    border: "border-orange-200",
    action: "top_players",
  },
  {
    icon: Gift,
    label: "Rewards",
    desc: "Claim your prizes",
    color: "text-purple-500",
    bg: "bg-purple-50",
    hover: "hover:bg-purple-100",
    border: "border-purple-200",
    action: "rewards",
  },
  {
    icon: Zap,
    label: "Weekly Challenge",
    desc: "Earn bonus points",
    color: "text-amber-500",
    bg: "bg-amber-50",
    hover: "hover:bg-amber-100",
    border: "border-amber-200",
    action: "weekly_challenge",
  },
  {
    icon: BarChart2,
    label: "Stats Overview",
    desc: "Detailed analytics",
    color: "text-blue-500",
    bg: "bg-blue-50",
    hover: "hover:bg-blue-100",
    border: "border-blue-200",
    action: "stats",
  },
];

const LeaderboardQuickActions = ({ onAction = () => {} }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * idx, duration: 0.4 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAction(action.action)}
            className={`group relative overflow-hidden rounded-2xl border ${action.border} ${action.bg} ${action.hover} p-4 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer shadow-sm`}
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl ${action.bg} border ${action.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <Icon className={`w-5 h-5 ${action.color}`} strokeWidth={2.5} />
            </div>

            {/* Text */}
            <div className="text-center">
              <p className="text-sm font-bold text-black">{action.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{action.desc}</p>
            </div>

            {/* Bottom accent bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${action.color.replace("text-", "bg-")} origin-left`}
            />
          </motion.button>
        );
      })}
    </div>
  );
};

export default LeaderboardQuickActions;