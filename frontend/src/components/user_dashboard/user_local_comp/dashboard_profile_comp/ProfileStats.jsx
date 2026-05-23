// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_profile_comp/ProfileStats.jsx

import { useState, useEffect } from "react";
import { apiOriginUrl } from "../../../../services/apiConfig";

const BASE = apiOriginUrl();

const StatCard = ({ icon, label, value, sub, progress, color = "#FF6B00", suffix = "", loading }) => (
  <div style={{
    background: "#ffffff", borderRadius: 16, padding: "22px 24px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
    display: "flex", flexDirection: "column", gap: 8,
    fontFamily: "'DM Sans', sans-serif",
    flex: 1, minWidth: 140,
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
    </div>

    {loading ? (
      <div style={{ height: 34, width: 80, borderRadius: 8, background: "#f0f0f0", marginTop: 4 }} />
    ) : (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.1rem", color: "#0a0a0a", letterSpacing: "0.04em", lineHeight: 1 }}>
          {value}
        </span>
        {suffix && <span style={{ fontSize: "0.95rem", color: "#aaa", fontWeight: 600, marginBottom: 3 }}>{suffix}</span>}
      </div>
    )}

    {sub && !loading && <span style={{ fontSize: "0.72rem", color: "#aaa", fontWeight: 500 }}>{sub}</span>}

    {progress !== undefined && !loading && (
      <div style={{ marginTop: 4 }}>
        <div style={{ height: 5, borderRadius: 99, background: "#f0f0f0", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${Math.min(progress, 100)}%`, borderRadius: 99,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            transition: "width 0.8s cubic-bezier(.34,1.56,.64,1)",
          }} />
        </div>
      </div>
    )}
  </div>
);

const ProfileStats = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const h = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.all([
      fetch(`${BASE}/api/auth/me`,        { headers: h }).then((r) => r.json()),
      fetch(`${BASE}/api/leaderboard/me`, { headers: h }).then((r) => r.json()),
    ])
      .then(([me, lb]) => {
        setData({ creds: me.creds || 0, rank: lb.rank || "—" });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const CARDS = [
    {
      label: "Credits",
      value: data?.creds?.toLocaleString() || "0",
      sub: "Your current balance",
      progress: Math.min(((data?.creds || 0) / 5000) * 100, 100),
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF6B00" stroke="none">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 14.93V18h-2v-1.07A4.002 4.002 0 0 1 8 13h2a2 2 0 1 0 2-2c-2.206 0-4-1.794-4-4a4.002 4.002 0 0 1 3-3.874V2h2v1.126A4.002 4.002 0 0 1 16 7h-2a2 2 0 1 0-2 2c2.206 0 4 1.794 4 4a4.002 4.002 0 0 1-3 3.93z"/>
        </svg>
      ),
    },
    {
      label: "Leaderboard Rank",
      value: data?.rank ? `#${data.rank}` : "—",
      sub: "Global ranking",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF6B00" stroke="none">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {CARDS.map((c) => (
          <StatCard key={c.label} {...c} loading={loading} />
        ))}
      </div>
    </>
  );
};

export default ProfileStats;