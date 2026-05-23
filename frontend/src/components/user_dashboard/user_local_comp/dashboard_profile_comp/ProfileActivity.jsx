// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_profile_comp/ProfileActivity.jsx
// CHANGES: connected to real /api/wallet/transactions/:userId — shows live activity feed

import { useState, useEffect } from "react";
import { apiOriginUrl } from "../../../../services/apiConfig";

const BASE = apiOriginUrl();

const TYPE_CONFIG = {
  credit: {
    icon: (
      <div style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0fdf4", flexShrink: 0 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    ),
    color: "#22c55e",
    prefix: "+",
  },
  debit: {
    icon: (
      <div style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #ef4444", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff5f5", flexShrink: 0 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    ),
    color: "#ef4444",
    prefix: "-",
  },
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 30) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const SkeletonRow = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 8px", borderBottom: "1px solid #f4f4f4" }}>
    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#f0f0f0", flexShrink: 0 }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ height: 13, width: "60%", borderRadius: 6, background: "#f0f0f0" }} />
      <div style={{ height: 11, width: "35%", borderRadius: 6, background: "#f5f5f5" }} />
    </div>
    <div style={{ height: 13, width: 50, borderRadius: 6, background: "#f0f0f0" }} />
  </div>
);

const ProfileActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Get userId from /me then fetch transactions
    fetch(`${BASE}/api/auth/me`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((me) => {
        if (!me.id) { setLoading(false); return; }
        return fetch(`${BASE}/api/wallet/transactions/${me.id}`);
      })
      .then((r) => r?.json())
      .then((txns) => {
        if (Array.isArray(txns)) {
          setActivities(txns.slice(0, 10)); // show last 10
          // total credits received
          const earned = txns
            .filter((t) => t.type === "credit")
            .reduce((s, t) => s + (t.amount || 0), 0);
          setTotal(earned);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');
        .act-row:hover { background: #fff8f0; }
      `}</style>

      <div style={{ background: "#ffffff", borderRadius: 20, padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", fontFamily: "'DM Sans', sans-serif" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2.3" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.07em", color: "#0a0a0a" }}>
              Recent Activity
            </span>
          </div>
          {!loading && total > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#0a0a0a", borderRadius: 99, padding: "5px 14px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF6B00" stroke="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FF6B00", letterSpacing: "0.06em" }}>
                {total.toLocaleString()} TKN
              </span>
            </div>
          )}
        </div>

        {/* List */}
        <div>
          {loading ? (
            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
          ) : activities.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#ccc" }}>
              <span style={{ fontSize: 32 }}>📋</span>
              <p style={{ fontSize: "0.85rem", marginTop: 8 }}>No activity yet</p>
            </div>
          ) : activities.map((txn, i) => {
            const cfg = TYPE_CONFIG[txn.type] || TYPE_CONFIG.credit;
            return (
              <div
                key={txn._id || i}
                className="act-row"
                style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 8px", borderBottom: i < activities.length - 1 ? "1px solid #f4f4f4" : "none", borderRadius: 10, transition: "background 0.15s" }}
              >
                {cfg.icon}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0a0a0a", lineHeight: 1.4 }}>
                      {txn.description || (txn.type === "credit" ? "Credits received" : "Credits deducted")}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "#bbb", whiteSpace: "nowrap", flexShrink: 0, marginTop: 2 }}>
                      {timeAgo(txn.createdAt)}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: cfg.color, fontWeight: 700, marginTop: 3, display: "block" }}>
                    {cfg.prefix}{txn.amount} TKN
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProfileActivity;