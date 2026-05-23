import { motion } from "framer-motion";
import {
  Crown, Star, CheckCircle, BarChart2, Zap,
  MapPin, Calendar, Shield, Award, TrendingUp,
  DollarSign, Target, Flame
} from "lucide-react";

const TopUserHighlight = ({
  topUser = {
    username: "PlayerOne",
    fullName: "Alex Johnson",
    avatar: "https://i.pravatar.cc/100?img=1",
    bio: "Competitive player & survey expert. Always chasing the top spot 🏆",
    location: "New York, USA",
    joinedDate: "Jan 2024",
    badge: "Grand Champion",
    points: 980,
    tasks: 15,
    surveys: 5,
    winStreak: 7,
    level: 42,
    rank: "Diamond",
    totalEarned: "$1,240",
    completionRate: 94,
    weeklyGrowth: "+18%",
  },
  userData,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-black text-white shadow-xl"
    >
      {/* ── Background FX ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-orange-500 opacity-[0.12] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-orange-600 opacity-[0.08] blur-2xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ── Grand Champion Title Banner ── */}
      <div className="relative flex items-center justify-between px-5 sm:px-7 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-md shadow-orange-500/40">
            <Crown className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <div>
            <p
              className="text-lg sm:text-xl font-black text-white uppercase tracking-widest leading-none"
              style={{ fontFamily: "Impact, 'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
            >
              Grand Champion
            </p>
            <p className="text-[10px] text-orange-400 font-bold tracking-widest uppercase">Season 04 · Week 12</p>
          </div>
        </div>

        {/* Live #1 pill */}
        <div className="flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
          <Flame className="w-3 h-3 text-orange-400" />
          #1 This Week
        </div>
      </div>

      {/* Thin orange accent line */}
      <div className="mx-5 sm:mx-7 h-px bg-gradient-to-r from-orange-500 via-orange-400 to-transparent opacity-60" />

      {/* ── Player Profile ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative p-5 sm:p-7 flex flex-col sm:flex-row gap-6"
      >
        {/* ── LEFT COL: Avatar + identity ── */}
        <div className="flex flex-col items-center sm:items-start gap-3 flex-shrink-0">
          {/* Avatar */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2.5 rounded-full border-2 border-dashed border-orange-500 opacity-50"
            />
            <img
              src={topUser.avatar || userData?.avatar}
              alt={topUser.username}
              className="w-24 h-24 rounded-full border-4 border-orange-500 object-cover relative z-10 shadow-xl shadow-orange-500/20"
            />
            {/* Crown pin */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
              <Crown className="w-6 h-6 text-orange-400 drop-shadow-glow" fill="currentColor" />
            </div>
            {/* Online dot */}
            <span className="absolute bottom-1 right-1 z-20 w-4 h-4 rounded-full bg-green-400 border-2 border-black" />
          </div>

          {/* Stars */}
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-orange-400" fill="currentColor" />
            ))}
          </div>

          {/* Level + Rank */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-lg px-2.5 py-1">
              <Shield className="w-3 h-3 text-orange-400" />
              <span className="text-xs font-black text-orange-300">Lvl {topUser.level}</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-500/20 border border-blue-500/30 rounded-lg px-2.5 py-1">
              <Award className="w-3 h-3 text-blue-400" />
              <span className="text-xs font-black text-blue-300">{topUser.rank}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COL: all info ── */}
        <div className="flex flex-col gap-4 flex-1 min-w-0 text-center sm:text-left">

          {/* Name + location + joined */}
          <div>
            <h2
              className="text-2xl sm:text-3xl font-black text-white leading-tight"
              style={{ fontFamily: "Impact, 'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              {topUser.username}
            </h2>
            <p className="text-sm text-gray-300 font-semibold">{topUser.fullName}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />{topUser.location}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />Joined {topUser.joinedDate}
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 italic">
            "{topUser.bio}"
          </p>

          {/* Stats pills row */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {[
              { icon: Zap,         val: topUser.points.toLocaleString(), label: "Points",  color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
              { icon: CheckCircle, val: topUser.tasks,                   label: "Tasks",   color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20"  },
              { icon: BarChart2,   val: topUser.surveys,                 label: "Surveys", color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20"    },
            ].map(({ icon: Icon, val, label, color, bg }, i) => (
              <div key={i} className={`flex items-center gap-2 border rounded-xl px-3 py-2 ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
                <div className="text-left">
                  <p className="text-sm font-black text-white leading-none">{val}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Earnings + Completion + Growth row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: DollarSign, val: topUser.totalEarned,         label: "Earned",     color: "text-orange-400" },
              { icon: Target,     val: `${topUser.completionRate}%`, label: "Completion", color: "text-green-400"  },
              { icon: TrendingUp, val: topUser.weeklyGrowth,         label: "This Week",  color: "text-purple-400" },
            ].map(({ icon: Icon, val, label, color }, i) => (
              <div key={i} className="flex flex-col items-center bg-white/5 border border-white/8 rounded-xl py-2.5 px-2">
                <Icon className={`w-4 h-4 ${color} mb-1`} />
                <span className={`text-base font-black leading-none ${color}`} style={{ fontFamily: "Impact, sans-serif" }}>
                  {val}
                </span>
                <span className="text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">{label}</span>
              </div>
            ))}
          </div>

          {/* Win streak */}
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="flex gap-1 items-end">
              {[...Array(topUser.winStreak)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.05 * i + 0.3, duration: 0.3 }}
                  className="w-2 rounded-full bg-orange-500"
                  style={{ height: `${7 + i * 3}px` }}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-orange-400">{topUser.winStreak} Week Win Streak 🔥</span>
          </div>

          {/* Animated completion bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Task Completion Rate</span>
              <span className="text-[10px] text-green-400 font-black">{topUser.completionRate}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${topUser.completionRate}%` }}
                transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
              />
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default TopUserHighlight;