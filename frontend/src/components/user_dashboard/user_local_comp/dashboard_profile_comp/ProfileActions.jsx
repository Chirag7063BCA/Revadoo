// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_profile_comp/ProfileActions.jsx
// Redesigned logout — custom yes/no modal + success toast, no browser confirm()

import { useState } from "react";

const ProfileActions = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loggingOut,  setLoggingOut]  = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogoutConfirm = () => {
    setLoggingOut(true);
    // Small delay so the user sees the spinner, then clear + show success toast
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userAvatar");
      setLoggingOut(false);
      setShowConfirm(false);
      setShowSuccess(true);
      // Redirect after toast
      setTimeout(() => { window.location.href = "/AuthPage"; }, 1800);
    }, 800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes pa-overlay-in { from { opacity:0 } to { opacity:1 } }
        @keyframes pa-modal-in   { from { opacity:0; transform:scale(0.92) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes pa-toast-in   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pa-spin       { to { transform:rotate(360deg) } }

        .pa-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: pa-overlay-in 0.2s ease;
        }
        .pa-backdrop {
          position: absolute; inset: 0;
          background: rgba(10,10,10,0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .pa-modal {
          position: relative; z-index: 1;
          background: #fff; border-radius: 22px;
          padding: 32px 28px 26px;
          width: 100%; max-width: 380px;
          box-shadow: 0 28px 80px rgba(0,0,0,0.22);
          animation: pa-modal-in 0.28s cubic-bezier(.34,1.56,.64,1);
          font-family: 'DM Sans', sans-serif;
          text-align: center;
        }
        .pa-toast {
          position: fixed;
          bottom: 32px; left: 50%; transform: translateX(-50%);
          z-index: 99999;
          background: #0a0a0a;
          color: #fff;
          border-radius: 14px;
          padding: 14px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem; font-weight: 600;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.28);
          animation: pa-toast-in 0.3s cubic-bezier(.34,1.56,.64,1);
          white-space: nowrap;
        }
        .pa-logout-trigger {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: none;
          border: 1.5px solid #f0f0f0;
          border-radius: 14px;
          padding: 13px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem; font-weight: 700;
          color: #0a0a0a;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.01em;
        }
        .pa-logout-trigger:hover {
          border-color: #ef4444;
          background: #fff5f5;
          color: #ef4444;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(239,68,68,0.12);
        }
        .pa-yes-btn {
          flex: 1;
          background: #ef4444;
          border: none; border-radius: 12px;
          padding: 13px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem; font-weight: 700;
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: background 0.15s, transform 0.15s;
        }
        .pa-yes-btn:hover:not(:disabled) { background: #dc2626; transform: translateY(-1px); }
        .pa-yes-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .pa-no-btn {
          flex: 1;
          background: none;
          border: 1.5px solid #e8e8e8; border-radius: 12px;
          padding: 13px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem; font-weight: 600;
          color: #888; cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .pa-no-btn:hover { border-color: #0a0a0a; color: #0a0a0a; }
      `}</style>

      {/* ── Logout trigger button ── */}
      <button className="pa-logout-trigger" onClick={() => setShowConfirm(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>

      {/* ── Confirm modal ── */}
      {showConfirm && (
        <div className="pa-overlay">
          <div className="pa-backdrop" onClick={() => !loggingOut && setShowConfirm(false)} />
          <div className="pa-modal">
            {/* Icon */}
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fff5f5", border: "2px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>

            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.06em", color: "#0a0a0a", margin: "0 0 8px" }}>
              Logout?
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#aaa", margin: "0 0 26px", lineHeight: 1.5 }}>
              Are you sure you want to log out of your account?
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="pa-no-btn" onClick={() => setShowConfirm(false)} disabled={loggingOut}>
                Cancel
              </button>
              <button className="pa-yes-btn" onClick={handleLogoutConfirm} disabled={loggingOut}>
                {loggingOut ? (
                  <>
                    <svg style={{ animation: "pa-spin 0.7s linear infinite" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Logging out…
                  </>
                ) : "Yes, Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success toast ── */}
      {showSuccess && (
        <div className="pa-toast">
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          Logged out successfully
        </div>
      )}
    </>
  );
};

export default ProfileActions;