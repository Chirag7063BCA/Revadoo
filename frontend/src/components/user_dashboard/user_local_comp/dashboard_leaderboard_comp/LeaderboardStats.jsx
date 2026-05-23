// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_leaderboard_comp/LeaderboardStats.jsx
// ONLY CHANGE: replaced hardcoded localStorage.getItem("token") with getToken()
// All visual code is 100% identical to the original.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Zap, TrendingUp } from "lucide-react";
import { apiGet } from "./Leaderboardapi";

const useCountUp = (target) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    const steps = 60;
    const inc   = target / steps;
    let   cur   = 0;
    const id = setInterval(() => {
      cur += inc;
      if (cur >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(cur));
    }, 1000 / steps);
    return () => clearInterval(id);
  }, [target]);
  return val;
};

const StatCard = ({ title, value, icon: Icon, accent, bg, border, suffix, idx, loading }) => {
  const count = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * idx, duration: 0.5 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl border ${border} ${bg} p-5 flex items-center gap-4 shadow-sm`}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-md flex-shrink-0`}>
        <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">{title}</p>
        <div className="flex items-baseline gap-1 mt-0.5">
          {loading ? (
            <div className="h-7 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <span className="text-2xl font-black text-black" style={{ fontFamily: "'Bebas Neue','Impact',sans-serif" }}>
              {count.toLocaleString()}
            </span>
          )}
          {!loading && suffix && (
            <span className="text-xs font-bold text-gray-400 uppercase">{suffix}</span>
          )}
        </div>
      </div>
      <div className={`absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-gradient-to-br ${accent} opacity-10`} />
    </motion.div>
  );
};

const LeaderboardStats = () => {
  const [stats,   setStats]   = useState({ totalPlayers: 0, totalCreds: 0, avgCreds: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet("/api/leaderboard/stats");
        if (data) setStats(data);
      } catch (err) {
        console.error("LeaderboardStats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const CARDS = [
    { title: "Total Players",    value: stats.totalPlayers, icon: Users,      accent: "from-orange-400 to-orange-600", bg: "bg-orange-50", border: "border-orange-200", suffix: ""    },
    { title: "Total Points",     value: stats.totalCreds,   icon: Zap,        accent: "from-black to-gray-700",        bg: "bg-gray-50",   border: "border-gray-200",   suffix: "TKN" },
    { title: "Avg Player Creds", value: stats.avgCreds,     icon: TrendingUp, accent: "from-orange-500 to-amber-500",  bg: "bg-orange-50", border: "border-orange-200", suffix: "TKN" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {CARDS.map((c, i) => <StatCard key={c.title} {...c} idx={i} loading={loading} />)}
    </div>
  );
};

export default LeaderboardStats;