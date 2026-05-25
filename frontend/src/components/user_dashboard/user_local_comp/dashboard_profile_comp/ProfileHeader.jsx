import React, { useState, useRef, useEffect } from "react";

import a1 from "../../../../assets/Avatar/a1.png";
import a2 from "../../../../assets/Avatar/a2.png";
import a3 from "../../../../assets/Avatar/a3.png";
import a4 from "../../../../assets/Avatar/a4.png";
import a5 from "../../../../assets/Avatar/a5.png";
import a6 from "../../../../assets/Avatar/a6.png";
import a7 from "../../../../assets/Avatar/a7.png";
import a8 from "../../../../assets/Avatar/a8.png";
import a9 from "../../../../assets/Avatar/a9.png";
import a10 from "../../../../assets/Avatar/a10.png";
import a11 from "../../../../assets/Avatar/a11.png";
import a12 from "../../../../assets/Avatar/a12.png";
import g1 from "../../../../assets/Avatar/g1.png";
import g2 from "../../../../assets/Avatar/g2.png";
import g3 from "../../../../assets/Avatar/g3.png";
import g4 from "../../../../assets/Avatar/g4.png";
import g5 from "../../../../assets/Avatar/g5.png";
import g6 from "../../../../assets/Avatar/g6.png";
import g7 from "../../../../assets/Avatar/g7.png";
import g8 from "../../../../assets/Avatar/g8.png";


const PRESET_AVATARS = [
  { id: 1, src: a1, label: "Avatar 1" },
  { id: 2, src: a2, label: "Avatar 2" },
  { id: 3, src: a3, label: "Avatar 3" },
  { id: 4, src: a4, label: "Avatar 4" },
  { id: 5, src: a5, label: "Avatar 5" },
  { id: 6, src: a6, label: "Avatar 6" },
  { id: 7, src: a7, label: "Avatar 7" },
  { id: 8, src: a8, label: "Avatar 8" },
  { id: 9, src: a9, label: "Avatar 9" },
  { id: 10, src: a10, label: "Avatar 10" },
  { id: 11, src: a11, label: "Avatar 11" },
  { id: 12, src: a12, label: "Avatar 12" },
  { id: 13, src: g1, label: "Avatar 13" },
  { id: 14, src: g2, label: "Avatar 14" },
  { id: 15, src: g3, label: "Avatar 15" },
  { id: 16, src: g4, label: "Avatar 16" },
  { id: 17, src: g5, label: "Avatar 17" },
  { id: 18, src: g6, label: "Avatar 18" },
  { id: 19, src: g7, label: "Avatar 19" },
  { id: 20, src: g8, label: "Avatar 20" },
];

const ProfileHeader = () => {
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [username, setUsername] = useState("User");
  const [initial, setInitial] = useState("U");
  const [dragOver, setDragOver] = useState(false);
  const [uploadHovered, setUploadHovered] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("settings-fonts")) {
      const link = document.createElement("link");
      link.id = "settings-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
    try {
      const avatar = localStorage.getItem("userAvatar");
      if (avatar) { setCurrentAvatar(avatar); setSelectedAvatar(avatar); }
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        setUsername(user.username || "User");
        setInitial((user.username || "U").charAt(0).toUpperCase());
      }
    } catch (e) { }
  }, []);

  const handlePresetSelect = (src) => setSelectedAvatar(src);

  const handleFileChange = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setSelectedAvatar(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleSave = async () => {
    if (!selectedAvatar || selectedAvatar === currentAvatar) return;
    setSaving(true);
    try {
      localStorage.setItem("userAvatar", selectedAvatar);
      setCurrentAvatar(selectedAvatar);
      window.dispatchEvent(new CustomEvent("avatarUpdated", { detail: { avatar: selectedAvatar } }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const isDirty = selectedAvatar && selectedAvatar !== currentAvatar;
  const isUploadActive = dragOver || uploadHovered;

  const AvatarCircle = ({ src, size, border = 2 }) => (
    <div style={{
      width: size, height: size, borderRadius: "50%", overflow: "hidden",
      flexShrink: 0,
      border: `${border}px solid #FF6B00`,
      background: src ? "transparent" : "linear-gradient(135deg,#FF6B00,#FF8C00)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {src
        ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <span style={{ color: "#fff", fontWeight: 700, fontSize: size * 0.32 }}>{initial}</span>
      }
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes spin-av { to { transform: rotate(360deg); } }
        .av-spin { animation: spin-av 0.75s linear infinite; }

        .preset-btn {
          transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s ease;
          cursor: pointer; background: none; border: none; padding: 0;
        }
        .preset-btn:hover .avatar-ring {
          box-shadow: 0 6px 20px rgba(255,107,0,0.25);
          transform: scale(1.07) translateY(-2px);
        }
        .avatar-ring {
          transition: transform 0.18s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.18s ease,
                      border-color 0.18s ease;
        }
        .avatar-ring.selected {
          transform: scale(1.1) translateY(-3px);
          box-shadow: 0 0 0 3px #FF6B00, 0 8px 24px rgba(255,107,0,0.3);
        }
        .reset-btn:hover { border-color: #0a0a0a !important; color: #0a0a0a !important; }
        .save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(255,107,0,0.4) !important;
        }

        /* Upload zone dash animation */
        @keyframes dash-move {
          to { stroke-dashoffset: -20; }
        }
        .upload-border-svg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          pointer-events: none;
        }
        .upload-border-rect {
          fill: none;
          stroke: #FF6B00;
          stroke-width: 2;
          stroke-dasharray: 8 5;
          rx: 12; ry: 12;
          transition: stroke-width 0.2s;
        }
        .upload-active .upload-border-rect {
          stroke-width: 2.5;
          animation: dash-move 0.4s linear infinite;
        }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Page Header ── */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px 16px 0 0",
          padding: "26px 32px 20px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 24, borderRadius: 99, background: "#FF6B00" }} />
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.8rem", letterSpacing: "0.08em",
                color: "#0a0a0a", margin: 0, lineHeight: 1,
              }}>
                Your Profile
              </h1>
            </div>
            <p style={{ color: "#b0b0b0", fontSize: "0.8rem", margin: "0 0 0 13px" }}>
              Manage your account  Profile and preferences
            </p>
          </div>

          {/* User pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "7px 16px 7px 7px",
            background: "#0a0a0a", borderRadius: 999,
            boxShadow: "0 2px 14px rgba(0,0,0,0.14)",
          }}>
            <AvatarCircle src={currentAvatar} size={34} border={2} />
            <span style={{ color: "#fff", fontSize: "0.83rem", fontWeight: 500 }}>{username}</span>
          </div>
        </div>

        {/* ── Avatar Panel ── */}
        <div style={{
          background: "#fff", borderRadius: "0 0 16px 16px",
          padding: "28px 32px 30px",
        }}>
          {/* Section label */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 26 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span style={{
              fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "#FF6B00",
            }}>
              Profile Avatar
            </span>
          </div>

          <div style={{ display: "flex", gap: 44, flexWrap: "wrap" }}>

            {/* ── Preset grid ── */}
            <div style={{ flex: 1, minWidth: 300 }}>
              <p style={{
                fontSize: "0.85rem", color: "#000000", fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 18
              }}>
                Presets
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                {PRESET_AVATARS.map((av) => {
                  const isSel = selectedAvatar === av.src;
                  return (
                    <button
                      key={av.id}
                      className="preset-btn"
                      onClick={() => handlePresetSelect(av.src)}
                      style={{ outline: "none" }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <div
                          className={`avatar-ring${isSel ? " selected" : ""}`}
                          style={{
                            width: 62, height: 62, borderRadius: "50%",
                            overflow: "hidden", position: "relative",
                            border: isSel ? "none" : "2.5px solid #e8e8e8",
                            background: "#f5f5f5",
                          }}
                        >
                          <img
                            src={av.src}
                            alt={av.label}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              const p = e.target.parentNode;
                              p.style.background = "linear-gradient(135deg,#FF6B00,#FF8C00)";
                              if (!p.querySelector(".fallback-letter")) {
                                const s = document.createElement("span");
                                s.className = "fallback-letter";
                                s.textContent = av.label.charAt(0);
                                s.style.cssText = "color:#fff;font-weight:700;font-size:1.2rem;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;";
                                p.appendChild(s);
                              }
                            }}
                          />
                          {isSel && (
                            <div style={{
                              position: "absolute", inset: 0, borderRadius: "50%",
                              background: "rgba(255,107,0,0.12)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <div style={{
                                width: 20, height: 20, borderRadius: "50%",
                                background: "#FF6B00",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 2px 8px rgba(255,107,0,0.5)",
                              }}>
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5.2l2 2.3 4-5" stroke="white" strokeWidth="1.8"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                        <span style={{
                          fontSize: "0.65rem", fontWeight: 600,
                          letterSpacing: "0.06em", textTransform: "uppercase",
                          color: isSel ? "#FF6B00" : "#c8c8c8",
                          transition: "color 0.15s",
                        }}>
                          {av.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 10, background: "#f1740e", alignSelf: "stretch", flexShrink: 0 }} />

            {/* ── Right col: Upload + Preview ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 190, flexShrink: 0 }}>

              {/* ── Upload Custom ── */}
              <div>
                <p style={{
                  fontSize: "1.00rem", color: "#000000", fontWeight: 900,
                  letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12
                }}>
                  Upload Custom
                </p>

                {/* Card */}
                <div
                  className={isUploadActive ? "upload-active" : ""}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={() => setUploadHovered(true)}
                  onMouseLeave={() => setUploadHovered(false)}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  style={{
                    position: "relative",
                    height: 130,
                    borderRadius: 12,
                    cursor: "pointer",
                    /* Black background — slightly lifted on hover */
                    background: isUploadActive ? "#1a1a1a" : "#0a0a0a",
                    /* No CSS border — SVG animated dashes handle it */
                    border: "none",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "background 0.22s, transform 0.18s, box-shadow 0.18s",
                    transform: isUploadActive ? "translateY(-2px)" : "none",
                    boxShadow: isUploadActive
                      ? "0 10px 32px rgba(255,107,0,0.28), inset 0 0 0 1px rgba(255,107,0,0.15)"
                      : "0 2px 12px rgba(0,0,0,0.18)",
                    overflow: "hidden",
                  }}
                >
                  {/* SVG animated dashed border */}
                  <svg
                    className="upload-border-svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", borderRadius: 12 }}
                  >
                    <rect
                      className="upload-border-rect"
                      x="1" y="1"
                      width="98" height="98"
                      rx="11" ry="11"
                      style={{
                        fill: "none",
                        stroke: isUploadActive ? "#FF6B00" : "rgba(255,107,0,0.45)",
                        strokeWidth: isUploadActive ? 2.5 : 1.8,
                        strokeDasharray: "8 5",
                        strokeDashoffset: 0,
                        transition: "stroke 0.2s, strokeWidth 0.2s",
                        ...(isUploadActive ? { animation: "dash-move 0.5s linear infinite" } : {}),
                      }}
                    />
                  </svg>

                  {/* Upload icon circle */}
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: isUploadActive ? "rgba(255,107,0,0.2)" : "rgba(255,107,0,0.1)",
                    border: "1px solid rgba(255,107,0,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s, transform 0.2s",
                    transform: isUploadActive ? "scale(1.1)" : "scale(1)",
                  }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                      stroke="#FF6B00" strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>

                  {/* Text */}
                  <div style={{ textAlign: "center", lineHeight: 1.6 }}>
                    <span style={{
                      display: "block",
                      fontSize: "0.78rem", fontWeight: 600,
                      color: "#FF6B00",
                      letterSpacing: "0.01em",
                    }}>
                      Drop image here
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "rgba(255,107,0,0.6)" }}>
                      or{" "}
                      <span style={{
                        color: "#FF6B00", fontWeight: 700,
                        textDecoration: isUploadActive ? "underline" : "none",
                        transition: "text-decoration 0.15s",
                      }}>
                        browse files
                      </span>
                    </span>
                  </div>

                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e.target.files[0])} />
                </div>
              </div>

              {/* Preview */}
              <div>
                <p style={{
                  fontSize: "0.75rem", color: "#000000", fontWeight: 600,
                  letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14
                }}>
                  Preview
                </p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
                  <div>
                    <div style={{
                      width: 70, height: 70, borderRadius: "50%", overflow: "hidden",
                      border: "3px solid #FF6B00",
                      background: selectedAvatar ? "transparent" : "linear-gradient(135deg,#FF6B00,#FF8C00)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 20px rgba(255,107,0,0.18)",
                    }}>
                      {selectedAvatar
                        ? <img src={selectedAvatar} alt="lg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.5rem" }}>{initial}</span>
                      }
                    </div>
                    <p style={{
                      fontSize: "0.6rem", color: "#000000", textAlign: "center",
                      margin: "6px 0 0", letterSpacing: "0.06em", textTransform: "uppercase"
                    }}>Profile</p>
                  </div>
                  <div>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", overflow: "hidden",
                      border: "2px solid #FF6B00",
                      background: selectedAvatar ? "transparent" : "linear-gradient(135deg,#FF6B00,#FF8C00)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {selectedAvatar
                        ? <img src={selectedAvatar} alt="sm" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.75rem" }}>{initial}</span>
                      }
                    </div>
                    <p style={{
                      fontSize: "0.89rem", color: "#000000", textAlign: "center",
                      margin: "6px 0 0", letterSpacing: "0.03em", textTransform: "uppercase"
                    }}>Header</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Action Bar ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 28, paddingTop: 22,
            borderTop: "1.5px solid #f4f4f4",
          }}>
            {isDirty && (
              <p style={{ fontSize: "0.75rem", color: "#aaa", margin: 0 }}>
                <span style={{ color: "#FF6B00", fontWeight: 600 }}>●</span> Unsaved changes
              </p>
            )}
            {!isDirty && <div />}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="reset-btn"
                onClick={() => setSelectedAvatar(currentAvatar)}
                style={{
                  background: "none", border: "1.5px solid #e8e8e8",
                  borderRadius: 8, padding: "9px 20px",
                  fontSize: "0.8rem", fontWeight: 600, color: "#aaa",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  transition: "border-color 0.15s, color 0.15s",
                }}
              >
                Reset
              </button>

              <button
                className="save-btn"
                onClick={handleSave}
                disabled={!isDirty || saving}
                style={{
                  background: isDirty ? "linear-gradient(135deg,#FF6B00,#FF8C00)" : "#f0f0f0",
                  border: "none", borderRadius: 8,
                  padding: "9px 26px",
                  fontSize: "0.83rem", fontWeight: 700,
                  color: isDirty ? "#fff" : "#ccc",
                  cursor: isDirty && !saving ? "pointer" : "not-allowed",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", gap: 7,
                  boxShadow: isDirty ? "0 4px 16px rgba(255,107,0,0.28)" : "none",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  letterSpacing: "0.02em",
                }}
              >
                {saving ? (
                  <>
                    <svg className="av-spin" width="13" height="13" viewBox="0 0 24 24"
                      fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Saving…
                  </>
                ) : saved ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Saved!
                  </>
                ) : "Save Avatar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;