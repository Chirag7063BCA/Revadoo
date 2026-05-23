import React, { useState, useEffect, useRef } from "react";

const EditProfileModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("modal-fonts")) {
      const link = document.createElement("link");
      link.id = "modal-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
    if (isOpen) {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const user = JSON.parse(stored);
          setUsername(user.username || "");
          setEmail(user.email || "");
          setLocation(user.location || "");
        }
      } catch (e) {}
      setSaved(false);
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSave = async () => {
    if (!location.trim()) { setError("Location cannot be empty."); return; }
    setError("");
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const stored = localStorage.getItem("user");
      const existing = stored ? JSON.parse(stored) : {};
      const updated = { ...existing, location: location.trim() };
      localStorage.setItem("user", JSON.stringify(updated));

      window.dispatchEvent(new CustomEvent("profileUpdated", {
        detail: { username: existing.username, location: location.trim() },
      }));

      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 1200);
    } catch (err) { setError("Failed to save. Please try again."); }
    finally { setSaving(false); }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.93) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ep-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: overlay-in 0.22s ease;
        }
        .ep-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(10,10,10,0.52);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .ep-modal {
          position: relative;
          z-index: 1;
          background: #fff;
          border-radius: 20px;
          padding: 32px 32px 28px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.22);
          animation: modal-in 0.28s cubic-bezier(.34,1.56,.64,1);
          font-family: 'DM Sans', sans-serif;
        }
        .ep-close {
          position: absolute;
          top: 18px; right: 18px;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #f4f4f4;
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
        }
        .ep-close:hover { background: #fde8d8; transform: scale(1.08); }
        .ep-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #aaa;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 7px;
          display: block;
        }
        .ep-field {
          width: 100%;
          border: 1.8px solid #e8e8e8;
          border-radius: 10px;
          padding: 11px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #0a0a0a;
          background: #fafafa;
          transition: border-color 0.18s, box-shadow 0.18s;
          outline: none;
          box-sizing: border-box;
        }
        .ep-field:focus {
          border-color: #FF6B00;
          box-shadow: 0 0 0 3px rgba(255,107,0,0.12);
          background: #fff;
        }
        .ep-field:disabled {
          color: #bbb;
          background: #f5f5f5;
          cursor: not-allowed;
        }
        .ep-readonly-note {
          font-size: 0.68rem;
          color: #ccc;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ep-save-btn {
          width: 100%;
          background: linear-gradient(135deg, #FF6B00, #FF8C00);
          border: none;
          border-radius: 12px;
          padding: 13px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          letter-spacing: 0.03em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 18px rgba(255,107,0,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .ep-save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(255,107,0,0.38);
        }
        .ep-save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        @keyframes spin-ep { to { transform: rotate(360deg); } }
        .ep-spin { animation: spin-ep 0.75s linear infinite; }
        .ep-cancel-btn {
          width: 100%;
          background: none;
          border: 1.5px solid #e8e8e8;
          border-radius: 12px;
          padding: 12px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #aaa;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .ep-cancel-btn:hover { border-color: #0a0a0a; color: #0a0a0a; }
        @media (max-width: 480px) {
          .ep-modal { padding: 24px 20px 22px; }
        }
      `}</style>

      <div className="ep-overlay">
        <div className="ep-backdrop" onClick={onClose} />
        <div className="ep-modal" ref={modalRef}>
          {/* Close */}
          <button className="ep-close" onClick={onClose}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
            <div style={{ width: 3, height: 24, borderRadius: 99, background: "#FF6B00" }} />
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.7rem", letterSpacing: "0.07em",
              color: "#0a0a0a", margin: 0, lineHeight: 1,
            }}>Edit Profile</h2>
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 22 }}>

            {/* Username — read-only */}
            <div>
              <label className="ep-label">Username</label>
              <input
                className="ep-field"
                type="text"
                value={username}
                disabled
                placeholder="Username"
              />
              <div className="ep-readonly-note">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Username cannot be changed
              </div>
            </div>

            {/* Email — read-only */}
            <div>
              <label className="ep-label">Email</label>
              <input
                className="ep-field"
                type="email"
                value={email}
                disabled
                placeholder="Email"
              />
              <div className="ep-readonly-note">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Email cannot be changed
              </div>
            </div>

            {/* Location — editable */}
            <div>
              <label className="ep-label">Location</label>
              <input
                className="ep-field"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Delhi, India"
                maxLength={80}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#fff5f5", border: "1px solid #fecaca",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              fontSize: "0.8rem", color: "#ef4444", fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="ep-save-btn" onClick={handleSave} disabled={saving || saved}>
              {saving ? (
                <>
                  <svg className="ep-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving…
                </>
              ) : saved ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Saved!
                </>
              ) : "Save Changes"}
            </button>
            <button className="ep-cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;