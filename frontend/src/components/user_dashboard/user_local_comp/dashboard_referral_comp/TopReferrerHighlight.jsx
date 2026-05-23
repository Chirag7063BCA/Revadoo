// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_referral_comp/TopReferrerHighlight.jsx

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Star, Shield, Gem, CheckCircle2, Lock } from "lucide-react";
import { apiUrl } from "../../../../services/apiConfig";

// Static style config per milestone — only visual, not data
const MILESTONE_STYLES = [
  { id: "starter", label: "Starter", Icon: Zap,    grad: "from-orange-500 to-orange-300", glow: "rgba(249,115,22,0.2)",  iconBg: "bg-orange-500" },
  { id: "raider",  label: "Raider",  Icon: Star,   grad: "from-gray-700 to-gray-500",     glow: "rgba(0,0,0,0.1)",       iconBg: "bg-gray-800"   },
  { id: "elite",   label: "Elite",   Icon: Shield, grad: "from-orange-500 to-orange-400", glow: "rgba(249,115,22,0.25)", iconBg: "bg-orange-500" },
  { id: "legend",  label: "Legend",  Icon: Gem,    grad: "from-orange-600 to-orange-400", glow: "rgba(249,115,22,0.3)",  iconBg: "bg-orange-600" },
];

// Default milestone data (used while loading or if API fails)
const DEFAULT_MILESTONES = [
  { refs: 1,  reward: 50   },
  { refs: 5,  reward: 300  },
  { refs: 15, reward: 1000 },
  { refs: 50, reward: 5000 },
];

// ── Single milestone card ────────────────────────────────────────────────────
const MilestoneCard = ({ style, refs, reward, totalReferrals, idx }) => {
  const { Icon, label, grad, glow, iconBg } = style;
  const done   = totalReferrals >= refs;
  const pct    = Math.min((totalReferrals / refs) * 100, 100);
  const active = !done && totalReferrals > 0 && totalReferrals < refs;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.08, type: "spring", stiffness: 180, damping: 18 }}
      className="relative overflow-hidden rounded-2xl border p-4 transition-all duration-300"
      style={{
        background:  done ? "rgba(249,115,22,0.06)" : active ? "#fafafa" : "#f9f9f9",
        borderColor: done ? "rgba(249,115,22,0.3)"  : active ? "rgba(249,115,22,0.15)" : "rgba(0,0,0,0.06)",
        boxShadow:   done ? `0 0 18px ${glow}` : "none",
      }}
    >
      <div className="relative z-10 flex items-center gap-3">
        {/* icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${done ? iconBg : "bg-gray-100"}`}
          style={done ? { boxShadow: `0 0 10px ${glow}` } : {}}
        >
          {done
            ? <Icon size={18} className="text-white" />
            : <Lock size={16} className="text-gray-400" />
          }
        </div>

        {/* label + reward */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-black ${done ? "text-black" : "text-gray-400"}`}>
              {label}
            </p>
            {done && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 320 }}
              >
                <CheckCircle2 size={14} className="text-orange-500" />
              </motion.div>
            )}
          </div>
          <p className={`text-[10px] ${done ? "text-gray-500" : "text-gray-400"}`}>
            {refs} referrals →{" "}
            <span className={done ? "font-bold text-orange-500" : ""}>
              +{reward.toLocaleString()} TKN
            </span>
          </p>
        </div>

        {/* badge / progress count */}
        {done ? (
          <div
            className="shrink-0 rounded-xl px-2.5 py-1 text-[10px] font-black text-white"
            style={{
              background: "linear-gradient(90deg,#f97316,#fb923c)",
              boxShadow: "0 0 8px rgba(249,115,22,0.4)",
            }}
          >
            DONE
          </div>
        ) : (
          <p className="shrink-0 text-[10px] font-bold text-gray-400">
            {totalReferrals}/{refs}
          </p>
        )}
      </div>

      {/* progress bar */}
      {!done && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.1, delay: 0.3 + idx * 0.1, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${grad}`}
          />
        </div>
      )}
    </motion.div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
const TopReferrerHighlight = () => {
  const [totalReferrals, setTotal]      = useState(0);
  const [milestoneData,  setMilestone]  = useState(DEFAULT_MILESTONES);
  const [loading,        setLoading]    = useState(true);
  const [toast,          setToast]      = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch user stats AND admin settings in parallel
    Promise.all([
      fetch(apiUrl("/referrals/stats"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).then((r) => r.json()),

      fetch(apiUrl("/admin/referrals/settings"))
        .then((r) => r.json())
        .catch(() => ({})), // silently fall back to defaults if settings unreachable
    ])
      .then(([statsData, s]) => {
        setTotal(statsData.totalReferrals ?? 0);

        // Rebuild milestone data from DB values, falling back to defaults
        setMilestone([
          { refs: s.milestone1Refs ?? 1,  reward: s.milestone1Bonus ?? 50   },
          { refs: s.milestone2Refs ?? 5,  reward: s.milestone2Bonus ?? 300  },
          { refs: s.milestone3Refs ?? 15, reward: s.milestone3Bonus ?? 1000 },
          { refs: s.milestone4Refs ?? 50, reward: s.milestone4Bonus ?? 5000 },
        ]);
      })
      .catch((err) => console.error("TopReferrerHighlight:", err))
      .finally(() => setLoading(false));
  }, []);

  // Merge static style config with live DB data
  const milestones = MILESTONE_STYLES.map((style, i) => ({
    ...style,
    refs:   milestoneData[i]?.refs,
    reward: milestoneData[i]?.reward,
  }));

  const nextMilestone = milestones.find((m) => totalReferrals < m.refs);
  const refsNeeded    = nextMilestone ? nextMilestone.refs - totalReferrals : 0;

  return (
    <>
      <style>{`
        @keyframes pulseBlob {
          0%,100%{ opacity:.08; transform:scale(1);    }
          50%    { opacity:.15; transform:scale(1.18); }
        }
        @keyframes shimmerText {
          0%  { background-position:-300% center; }
          100%{ background-position: 300% center; }
        }
        @keyframes nudgePulse {
          0%,100% { box-shadow: 0 0 0px rgba(249,115,22,0.1); }
          50%      { box-shadow: 0 0 16px rgba(249,115,22,0.25); }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm"
      >
        <div
          className="pointer-events-none absolute -left-12 -top-12 h-56 w-56 rounded-full bg-orange-300 blur-[80px]"
          style={{ animation: "pulseBlob 3.5s ease-in-out infinite" }}
        />
        <div
          className="pointer-events-none absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-orange-200 blur-[70px]"
          style={{ animation: "pulseBlob 4.5s ease-in-out infinite 1s" }}
        />

        {/* top bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

        <div className="relative z-10 px-5 py-6 sm:px-6 sm:py-7">

          {/* header */}
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-0.5">
                <Gem size={11} className="text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500">
                  Milestones
                </span>
              </div>
              <h3 className="text-lg font-black text-black sm:text-xl">Referral Progress</h3>
            </div>

            {!loading && (
              <div className="flex items-center gap-1.5 rounded-2xl border border-orange-100 bg-orange-50 px-3 py-1.5">
                <span className="text-[10px] text-gray-400">Referred</span>
                <span
                  className="text-sm font-black"
                  style={{
                    background: "linear-gradient(90deg,#f97316 0%,#ea580c 50%,#f97316 100%)",
                    backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "shimmerText 3s linear infinite",
                  }}
                >
                  {totalReferrals}
                </span>
                <span className="text-[10px] text-gray-400">friends</span>
              </div>
            )}
          </div>

          {/* milestone cards */}
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-2xl border border-orange-100 bg-orange-50/50"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <MilestoneCard
                  key={m.id}
                  style={m}
                  refs={m.refs}
                  reward={m.reward}
                  totalReferrals={totalReferrals}
                  idx={i}
                />
              ))}
            </div>
          )}

          {/* nudge banner */}
          {!loading && nextMilestone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-center"
              style={{ animation: "nudgePulse 3s ease-in-out infinite" }}
            >
              <p className="text-xs text-gray-500">
                🔥 Refer{" "}
                <span className="font-black text-orange-500">{refsNeeded} more</span>{" "}
                {refsNeeded === 1 ? "friend" : "friends"} to unlock{" "}
                <span className="font-black text-black">{nextMilestone.label}</span> and earn{" "}
                <span className="font-black text-orange-500">
                  +{nextMilestone.reward.toLocaleString()} TKN
                </span>
              </p>
            </motion.div>
          )}

          {/* all milestones complete */}
          {!loading && !nextMilestone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-center"
              style={{ boxShadow: "0 0 20px rgba(249,115,22,0.15)" }}
            >
              <p className="text-sm font-black text-orange-500">
                🏆 Legend unlocked — all milestones complete!
              </p>
            </motion.div>
          )}
        </div>

        {/* toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: 16, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.88 }}
              className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-2xl bg-orange-500 px-5 py-2.5 text-xs font-black text-white shadow-xl"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default TopReferrerHighlight;