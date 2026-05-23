// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_referral_comp/ReferralsStats.jsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Coins, UserCheck } from "lucide-react";
import { apiUrl } from "../../../../services/apiConfig";

const useCountUp = (target, delayMs = 0) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target && target !== 0) return;
    const t = setTimeout(() => {
      const steps = 60;
      const inc = target / steps;
      let cur = 0;
      const id = setInterval(() => {
        cur += inc;
        if (cur >= target) { setVal(target); clearInterval(id); }
        else setVal(Math.floor(cur));
      }, 1400 / steps);
      return () => clearInterval(id);
    }, delayMs);
    return () => clearTimeout(t);
  }, [target, delayMs]);
  return val;
};

const CARDS = [
  { key: "totalReferrals",  title: "Friends Referred", Icon: Users,     suffix: "",     accent: "orange" },
  { key: "totalEarnings",   title: "Tokens Earned",    Icon: Coins,     suffix: " TKN", accent: "black"  },
  { key: "activeReferrals", title: "Active Referrals", Icon: UserCheck, suffix: "",     accent: "orange" },
];

const FALLBACK = { totalReferrals: 0, totalEarnings: 0, activeReferrals: 0 };

const StatCard = ({ cfg, raw, idx }) => {
  const val      = useCountUp(raw ?? 0, idx * 150);
  const isOrange = cfg.accent === "orange";

  return (
    <>
      <style>{`
        @keyframes blobStat${idx} {
          0%,100% { transform: scale(1);    opacity: .10; }
          50%      { transform: scale(1.3);  opacity: .18; }
        }
        @keyframes cardGlow${idx} {
          0%,100% { box-shadow: 0 2px 12px rgba(249,115,22,0.08); }
          50%      { box-shadow: 0 4px 24px rgba(249,115,22,0.18); }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1, duration: 0.5, type: "spring", stiffness: 160 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="relative overflow-hidden rounded-3xl border bg-white p-6"
        style={{
          borderColor: isOrange ? "rgba(249,115,22,0.2)" : "rgba(0,0,0,0.08)",
          animation: isOrange ? `cardGlow${idx} 3s ease-in-out infinite` : "none",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* bg blob */}
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl"
          style={{
            background: isOrange ? "#f97316" : "#1f2937",
            animation: `blobStat${idx} ${3.5 + idx * 0.5}s ease-in-out infinite`,
          }}
        />

        {/* top accent */}
        <div
          className="absolute top-0 left-6 right-6 h-px"
          style={{
            background: isOrange
              ? "linear-gradient(90deg,transparent,#f97316,transparent)"
              : "linear-gradient(90deg,transparent,rgba(0,0,0,0.15),transparent)",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              {cfg.title}
            </p>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-2xl"
              style={{ background: isOrange ? "rgba(249,115,22,0.1)" : "rgba(0,0,0,0.06)" }}
            >
              <cfg.Icon size={16} className={isOrange ? "text-orange-500" : "text-gray-700"} />
            </div>
          </div>

          {/* number */}
          <motion.p
            className="text-4xl font-black sm:text-5xl"
            style={{
              background: isOrange
                ? "linear-gradient(135deg,#f97316,#ea580c)"
                : "linear-gradient(135deg,#111827,#374151)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {val.toLocaleString()}
            <span className="ml-1 text-base">{cfg.suffix}</span>
          </motion.p>

          {/* progress bar */}
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              transition={{ duration: 1.4, delay: 0.5 + idx * 0.15, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: isOrange
                  ? "linear-gradient(90deg,#ea580c,#f97316,#fb923c)"
                  : "linear-gradient(90deg,#374151,#1f2937)",
              }}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};

const ReferralsStats = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(apiUrl("/referrals/stats"), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => { if (!res.ok) { setStats(FALLBACK); return null; } return res.json(); })
      .then((data) => { if (!data) return; data.message ? setStats(FALLBACK) : setStats(data); })
      .catch(() => setStats(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-3xl border border-orange-100 bg-white shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {CARDS.map((cfg, i) => (
        <StatCard key={cfg.key} cfg={cfg} raw={stats[cfg.key]} idx={i} />
      ))}
    </div>
  );
};

export default ReferralsStats;