// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_profile_comp/ProfileCard.jsx
// CHANGES: fetches real data from /api/auth/me, removed Edit Profile button & modal trigger
//          (user cannot change username or email — read-only profile)

import { useState, useEffect } from "react";
import { apiOriginUrl } from "../../../../services/apiConfig";

const BASE = apiOriginUrl();

const ProfileCard = () => {
  const [user,    setUser]    = useState(null);
  const [avatar,  setAvatar]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load avatar from localStorage (set by ProfileHeader avatar picker)
    const stored = localStorage.getItem("userAvatar");
    if (stored) setAvatar(stored);

    // Fetch real user data from backend
    const token = localStorage.getItem("token");
    fetch(`${BASE}/api/auth/me`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.username) {
          setUser(d);
          // Keep localStorage in sync for other components
          localStorage.setItem("user", JSON.stringify(d));
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to localStorage cache
        try {
          const cached = localStorage.getItem("user");
          if (cached) setUser(JSON.parse(cached));
        } catch {}
        setLoading(false);
      });

    // Listen for avatar updates from ProfileHeader
    const onAvatar = (e) => setAvatar(e.detail.avatar);
    window.addEventListener("avatarUpdated", onAvatar);
    return () => window.removeEventListener("avatarUpdated", onAvatar);
  }, []);

  const initial     = (user?.username || "U").charAt(0).toUpperCase();
  const maskedEmail = user?.email
    ? user.email.charAt(0) + user.email.charAt(1) + user.email.charAt(2) +
      "****" + user.email.slice(user.email.indexOf("@"))
    : "••••@••••";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');
        .pc-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 32px 28px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
          min-width: 220px;
        }
        .pc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 90px;
          background: linear-gradient(135deg, rgba(255,107,0,0.08), rgba(255,140,0,0.04));
          border-radius: 20px 20px 60% 60%;
        }
        .pc-info-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .pc-info-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: #f8f8f8;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pc-watermark {
          position: absolute;
          bottom: -18px; right: -18px;
          opacity: 0.04;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 7rem;
          color: #FF6B00;
          pointer-events: none;
          line-height: 1;
          user-select: none;
        }
      `}</style>

      <div className="pc-card">
        {/* Avatar */}
        <div style={{ position: "relative", width: 100, height: 100, marginBottom: 16 }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            border: "3.5px solid #FF6B00",
            overflow: "hidden",
            background: "linear-gradient(135deg, #FF6B00, #FF8C00)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(255,107,0,0.22)",
          }}>
            {loading ? (
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
            ) : avatar ? (
              <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "2.2rem", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}>
                {initial}
              </span>
            )}
          </div>
        </div>

        {/* Username */}
        {loading ? (
          <div style={{ height: 32, width: 120, borderRadius: 8, background: "#f0f0f0", marginBottom: 12 }} />
        ) : (
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "2rem", letterSpacing: "0.06em",
            color: "#0a0a0a", margin: "0 0 4px", lineHeight: 1,
          }}>
            {user?.username || "User"}
          </h2>
        )}

        {/* Joined badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "#fff8f0", border: "1.5px solid #ffd4a8",
          borderRadius: 99, padding: "4px 12px", marginBottom: 20,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2.2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#FF6B00" }}>
            Joined {joinedDate}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: 1, background: "#f4f4f4", marginBottom: 18 }} />

        {/* Email row */}
        <div className="pc-info-row">
          <div className="pc-info-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          {loading
            ? <div style={{ height: 14, width: 140, borderRadius: 6, background: "#f0f0f0" }} />
            : <span style={{ fontSize: "0.82rem", color: "#555", fontWeight: 500 }}>{maskedEmail}</span>
          }
        </div>

        {/* Referral code row */}
        {user?.referralCode && (
          <div className="pc-info-row">
            <div className="pc-info-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2.2" strokeLinecap="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span style={{ fontSize: "0.82rem", color: "#555", fontWeight: 600, letterSpacing: "0.08em" }}>
              {user.referralCode}
            </span>
          </div>
        )}

        <div className="pc-watermark">P</div>
      </div>
    </>
  );
};

export default ProfileCard;