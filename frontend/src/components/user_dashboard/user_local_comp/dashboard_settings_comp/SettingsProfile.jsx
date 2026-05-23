// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_settings_comp/SettingsProfile.jsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Calendar, Star, Shield, Trophy, Zap, Coins, Eye, EyeOff, Key } from "lucide-react";
import { apiUrl } from "../../../../services/apiConfig";

const SettingsProfile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({ username: "", email: "", initial: "U", avatar: null, memberSince: "", creds: 0, tempPassword: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const avatar = localStorage.getItem("userAvatar") || null;
      if (stored) {
        const user = JSON.parse(stored);
        setProfile({ username: user.username||"User", email: user.email||"", initial: (user.username||"U").charAt(0).toUpperCase(), avatar, creds: user.creds||0, tempPassword: user.tempPassword||null,
          memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US",{month:"long",year:"numeric"}) : "" });
      }
    } catch {}

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res  = await fetch(apiUrl("/auth/me"), { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        const avatar = data.avatar || localStorage.getItem("userAvatar") || null;
        setProfile({ username: data.username||"User", email: data.email||"", initial: (data.username||"U").charAt(0).toUpperCase(), avatar, creds: data.creds||0, tempPassword: data.tempPassword||null,
          memberSince: data.createdAt ? new Date(data.createdAt).toLocaleDateString("en-US",{month:"long",year:"numeric"}) : "" });
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProfile();

    const onAvatar = (e) => setProfile((p) => ({ ...p, avatar: e.detail.avatar }));
    window.addEventListener("avatarUpdated", onAvatar);
    return () => window.removeEventListener("avatarUpdated", onAvatar);
  }, []);

  const BADGES = [
    { Icon: Star,   label: "Early Member", color: "#f97316", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.2)"  },
    { Icon: Shield, label: "Verified",     color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)"  },
    { Icon: Trophy, label: "Top Referrer", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)"  },
  ];

  return (
    <>
      <style>{`
        @keyframes blobP1 { 0%,100%{opacity:.10;transform:scale(1)} 50%{opacity:.18;transform:scale(1.22)} }
        @keyframes blobP2 { 0%,100%{opacity:.07;transform:scale(1)} 50%{opacity:.14;transform:scale(1.18)} }
        @keyframes avatarGlow {
          0%,100%{box-shadow:0 0 0 6px rgba(249,115,22,0.10),0 8px 32px rgba(249,115,22,0.18)}
          50%    {box-shadow:0 0 0 12px rgba(249,115,22,0.16),0 14px 48px rgba(249,115,22,0.30)}
        }
        @keyframes onlinePulse {0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:0.7}}
        @keyframes shimmerBar  {0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes floatBadge  {0%,100%{transform:translateY(0px)}50%{transform:translateY(-4px)}}
        @keyframes credsPulse  {0%,100%{box-shadow:0 0 0px rgba(249,115,22,0.1)}50%{box-shadow:0 0 24px rgba(249,115,22,0.22)}}
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-orange-100 bg-white shadow-sm"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-300 blur-3xl" style={{ animation: "blobP1 4s ease-in-out infinite" }} />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-orange-200 blur-3xl" style={{ animation: "blobP2 5s ease-in-out infinite 1s" }} />
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

        <div className="relative z-10 flex flex-col lg:flex-row">

          {/* ── LEFT ── */}
          <div className="flex items-center justify-center border-b border-orange-100 p-6 sm:p-8 lg:w-1/2 lg:border-b-0 lg:border-r lg:p-10">
            <div className="flex flex-col items-center gap-4 text-center w-full max-w-xs">

              {/* avatar */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 160 }}
                className="relative shrink-0"
              >
                <div
                  className="flex items-center justify-center overflow-hidden rounded-full"
                  style={{ width: 120, height: 120, border: "4px solid #f97316", animation: "avatarGlow 3.5s ease-in-out infinite",
                    background: profile.avatar ? "transparent" : "linear-gradient(135deg,#f97316,#ea580c)" }}
                >
                  {loading ? <div className="h-full w-full animate-pulse bg-orange-100" />
                    : profile.avatar ? <img src={profile.avatar} alt="avatar" className="h-full w-full object-cover" />
                    : <span style={{ fontSize: "3.8rem", fontWeight: 900, color: "#fff" }}>{profile.initial}</span>}
                </div>
                <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500"
                  style={{ border: "3px solid #fff", animation: "onlinePulse 2s ease-in-out infinite" }} />
              </motion.div>

              {/* name */}
              {loading
                ? <div className="h-7 w-36 animate-pulse rounded-xl bg-gray-100" />
                : <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="text-xl sm:text-2xl font-black text-black">{profile.username}</motion.h2>}

              {/* email */}
              {loading
                ? <div className="h-4 w-48 animate-pulse rounded-lg bg-gray-100" />
                : <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                    className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 break-all">
                    <Mail size={12} className="text-orange-400 shrink-0" />{profile.email}
                  </motion.p>}

              {/* password display (if auto-generated) */}
              {!loading && profile.tempPassword && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
                  className="flex items-center gap-2 text-xs text-gray-400 bg-orange-50/50 px-3 py-1.5 rounded-lg border border-orange-100/50 w-full justify-center">
                  <Key size={12} className="text-orange-400 shrink-0" />
                  <span className="font-semibold text-gray-500">Auto-Password:</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded shadow-sm text-orange-600 font-bold border border-orange-100 min-w-[70px] text-center">
                    {showPassword ? profile.tempPassword : "••••••••"}
                  </span>
                  <button onClick={() => setShowPassword(!showPassword)} 
                    className="flex items-center justify-center p-1 rounded-md hover:bg-orange-100 hover:text-orange-500 transition-colors text-gray-400">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </motion.div>
              )}

              {/* member since */}
              {!loading && profile.memberSince && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar size={11} className="text-orange-400 shrink-0" />Member since {profile.memberSince}
                </motion.p>
              )}

              {/* badges */}
              <div className="flex flex-wrap justify-center gap-2">
                {BADGES.map(({ Icon, label, color, bg, border }, i) => (
                  <motion.div key={label}
                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + i * 0.08, type: "spring", stiffness: 200 }}
                    className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] sm:text-[11px] font-black"
                    style={{ background: bg, border: `1px solid ${border}`, color, animation: `floatBadge ${2.5+i*0.4}s ease-in-out infinite` }}>
                    <Icon size={10} />{label}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT — creds ── */}
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-2 self-start">
              <Zap size={12} className="text-orange-500" fill="currentColor" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Token Balance</p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 160 }}
              className="w-full rounded-2xl sm:rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5 sm:p-6 flex flex-col items-center gap-4"
              style={{ animation: "credsPulse 3s ease-in-out infinite" }}
            >
              <motion.div
                initial={{ rotateY: 0 }} animate={{ rotateY: 360 }} transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-4 border-orange-200 bg-white"
                style={{ boxShadow: "0 0 24px rgba(249,115,22,0.2)" }}>
                <Coins size={24} className="text-orange-500 sm:hidden" />
                <Coins size={28} className="text-orange-500 hidden sm:block" />
              </motion.div>

              {loading
                ? <div className="h-12 w-28 animate-pulse rounded-2xl bg-orange-100" />
                : <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-black"
                    style={{ background: "linear-gradient(135deg,#f97316,#ea580c,#fb923c)", backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmerBar 3s linear infinite" }}>
                    {profile.creds.toLocaleString()}
                  </motion.p>}

              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-gray-400">TKN</p>

              <div className="w-full h-2 overflow-hidden rounded-full bg-orange-100">
                <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#ea580c,#f97316,#fb923c,#f97316)", backgroundSize: "200% auto", animation: "shimmerBar 2.5s linear infinite" }} />
              </div>

              <p className="text-xs text-gray-400 text-center">Earn more by completing tasks & referring friends</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SettingsProfile;