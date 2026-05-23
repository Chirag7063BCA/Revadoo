import { useState, useEffect } from "react";
import Faqs from '../ContactUSComp/Faq'

const THEME = {
  bg: "#FAFAFA",
  cardBg: "#FFFFFF",
  textMain: "#111111",
  textMuted: "#666666",
  border: "rgba(0,0,0,0.08)",
  orange: "#FF6B00",
};

const SectionBadge = ({ label }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: "rgba(255,107,0,0.15)",
      border: "1px solid rgba(255,107,0,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="#FF6B00" strokeWidth="2" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: THEME.textMain, letterSpacing: "0.06em", fontWeight: 600 }}>
      {label}
    </span>
  </div>
);

const EmailIcon = ({ hovered }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", transform: hovered ? "scale(1.15) translateY(-1px)" : "scale(1)" }}>
    <rect x="2" y="4" width="20" height="16" rx="4" stroke={hovered ? "#FFFFFF" : "#FF6B00"} strokeWidth="1.8" style={{ transition: "stroke 0.3s ease" }} />
    <path d="M2 8l9.19 6.56c.48.34 1.14.34 1.62 0L22 8" stroke={hovered ? "#FFFFFF" : "#FF6B00"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s ease" }} />
    <circle cx="18" cy="8" r="2" fill={hovered ? "#FFFFFF" : "transparent"} style={{ transition: "all 0.3s ease", opacity: hovered ? 1 : 0, transform: hovered ? "scale(1)" : "scale(0)" }} />
  </svg>
);

const PhoneIcon = ({ hovered }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", transform: hovered ? "scale(1.15) rotate(8deg)" : "scale(1)" }}>
    <path d="M21.36 16.21l-3.6-1.8a2.5 2.5 0 00-3.1.66l-1.35 1.66a15.46 15.46 0 01-8.2-8.2l1.66-1.35a2.5 2.5 0 00.66-3.1l-1.8-3.6A2.5 2.5 0 003.13 2H3a18.33 18.33 0 0018.3 18.3h.68a2.5 2.5 0 001.38-2.5z" stroke={hovered ? "#FFFFFF" : "#FF6B00"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s ease" }} />
    <path d="M15 3h6v6M21 3l-5.5 5.5" stroke={hovered ? "#FFFFFF" : "#FF6B00"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.3s ease", opacity: hovered ? 1 : 0, transform: hovered ? "translate(-2px, 2px)" : "translate(0,0)" }} />
  </svg>
);

const LocationIcon = ({ hovered }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", transform: hovered ? "scale(1.15) translateY(-3px)" : "scale(1)" }}>
    <path d="M12 21A15 15 0 003 9a9 9 0 0118 0 15 15 0 00-9 12z" stroke={hovered ? "#FFFFFF" : "#FF6B00"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s ease" }} />
    <circle cx="12" cy="9" r="3" stroke={hovered ? "#FFFFFF" : "#FF6B00"} strokeWidth="1.8" style={{ transition: "stroke 0.3s ease" }} />
    <ellipse cx="12" cy="22" rx="5" ry="1.5" fill={hovered ? "rgba(255,255,255,0.5)" : "rgba(255,107,0,0.15)"} style={{ transition: "all 0.3s ease" }} />
  </svg>
);

const ContactCard = ({ IconComponent, title, value, delay = 0, isEmail = false }) => {
  const [hovered, setHovered] = useState(false);

  // PRO FIX: Direct Gmail compose URL instad of mailto
  const Tag = isEmail ? "a" : "div";
  const tagProps = isEmail ? { 
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=revadoo@gmail.com",
    target: "_blank", 
    rel: "noopener noreferrer" 
  } : {};

  return (
    <Tag
      {...tagProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: "none",
        background: hovered ? THEME.orange : THEME.cardBg,
        border: `1px solid ${hovered ? THEME.orange : THEME.border}`,
        borderRadius: 14, padding: "16px 18px",
        display: "flex", alignItems: "center", gap: 14,
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        animation: `fadeSlideUp 0.6s ease ${delay}s both`,
        position: "relative", overflow: "hidden",
        boxShadow: hovered ? "0 12px 32px rgba(255,107,0,0.25)" : "0 2px 10px rgba(0,0,0,0.02)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        transform: hovered ? "translateX(300%)" : "translateX(0)",
        transition: hovered ? "transform 0.8s ease" : "none",
        pointerEvents: "none"
      }} />

      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: hovered ? "rgba(255,255,255,0.2)" : "#F5F5F5",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.04)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.3s ease",
        backdropFilter: hovered ? "blur(4px)" : "none",
      }}>
        <IconComponent hovered={hovered} />
      </div>
      <div style={{ flex: 1, position: "relative", zIndex: 2 }}>
        <p style={{ margin: 0, marginBottom: 2, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: hovered ? "#FFFFFF" : THEME.textMain, transition: "color 0.3s ease" }}>{title}</p>
        <p style={{ margin: 0, fontFamily: "'DM Mono', monospace", fontSize: "12px", color: hovered ? "rgba(255,255,255,0.8)" : THEME.textMuted, transition: "color 0.3s ease" }}>{value}</p>
      </div>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background: hovered ? "rgba(255,255,255,0.2)" : "#F5F5F5",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.04)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.3s ease",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
      }}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L10 2M10 2H4M10 2V8" stroke={hovered ? "#FFFFFF" : "#888888"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s ease" }} />
        </svg>
      </div>
    </Tag>
  );
};

const LeftPanel = () => (
  <div className="left-panel">
    <SectionBadge label="Contact" />
    <h1 style={{
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      fontSize: "clamp(38px, 4.5vw, 58px)",
      color: THEME.textMain, letterSpacing: "0.02em",
      lineHeight: 1.05, margin: "0 0 12px",
      animation: "fadeSlideUp 0.5s ease 0.1s both",
    }}>
      Get in touch
    </h1>
    <p style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: "15px",
      color: THEME.textMuted, lineHeight: 1.7,
      margin: "0 0 32px", maxWidth: 290,
      animation: "fadeSlideUp 0.5s ease 0.2s both",
    }}>
      Have Questions or Any support Contact Us....
    </p>
    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
      <ContactCard IconComponent={EmailIcon} title="Email us" value="revadoo@gmail.com" delay={0.3} isEmail={true} />
      <ContactCard IconComponent={PhoneIcon} title="Call us" value="950112xxxx" delay={0.4} />
      <ContactCard IconComponent={LocationIcon} title="Our location" value="Punjab, INDIA" delay={0.5} />
    </div>
  </div>
);

const FormField = ({ type = "text", placeholder, value, onChange, multiline = false, delay = 0 }) => {
  const [focused, setFocused] = useState(false);
  const shared = {
    width: "100%", boxSizing: "border-box",
    background: focused ? "rgba(0,0,0,0.01)" : "#F9F9F9",
    border: `1px solid ${focused ? "rgba(0,0,0,0.3)" : THEME.border}`,
    borderRadius: 12,
    padding: multiline ? "14px 16px" : "13px 16px",
    color: THEME.textMain,
    fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
    outline: "none", resize: "none",
    transition: "all 0.3s ease",
    animation: `fadeSlideUp 0.5s ease ${delay}s both`,
    boxShadow: focused ? "0 0 0 3px rgba(0,0,0,0.03)" : "none",
    display: "block",
  };
  return multiline
    ? <textarea placeholder={placeholder} value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} rows={6} style={shared} />
    : <input type={type} placeholder={placeholder} value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={shared} />;
};

const SubmitButton = ({ loading }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="submit" disabled={loading}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", padding: "15px", borderRadius: 12,
        background: hovered && !loading ? "#E66000" : THEME.orange,
        color: "#FFFFFF",
        border: `1px solid ${hovered && !loading ? "#E66000" : THEME.orange}`,
        fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.04em",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        opacity: loading ? 0.7 : 1,
        animation: "fadeSlideUp 0.5s ease 0.7s both",
        boxShadow: hovered && !loading ? "0 6px 20px rgba(255,107,0,0.3)" : "0 2px 8px rgba(255,107,0,0.08)",
      }}
    >
      {loading
        ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
            </svg>
            Sending...
          </span>
        : "Submit"
      }
    </button>
  );
};

const ContactForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [formHovered, setFormHovered] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    onSuccess();
    setForm({ name: "", email: "", phone: "", message: "" });
  };
  return (
    <div
      className="contact-form-container"
      onMouseEnter={() => setFormHovered(true)}
      onMouseLeave={() => setFormHovered(false)}
      style={{
        background: THEME.cardBg,
        border: `1px solid ${formHovered ? "rgba(0,0,0,0.15)" : THEME.border}`,
        borderRadius: 20, padding: "26px",
        boxShadow: formHovered ? "0 12px 32px rgba(0,0,0,0.08)" : "0 4px 24px rgba(0,0,0,0.04)",
        animation: "fadeSlideUp 0.6s ease 0.15s both",
        position: "relative", overflow: "hidden",
        transition: "all 0.3s ease",
        transform: formHovered ? "translateY(-4px)" : "translateY(0)",
      }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 13, width: "100%" }}>
        <FormField placeholder="Name" value={form.name} onChange={handleChange("name")} delay={0.2} />
        <FormField type="email" placeholder="Email" value={form.email} onChange={handleChange("email")} delay={0.3} />
        <FormField type="tel" placeholder="Mobile Number" value={form.phone} onChange={handleChange("phone")} delay={0.4} />
        <FormField placeholder="Message" value={form.message} onChange={handleChange("message")} multiline delay={0.5} />
        <SubmitButton loading={loading} />
      </form>
    </div>
  );
};

const MapSection = () => {
  const [mapHovered, setMapHovered] = useState(false);
  const lat = 40.7233;
  const lon = -73.9971;
  const zoom = 16;

  return (
    <div style={{
      width: "100%", maxWidth: 1080,
      margin: "44px auto 0",
      animation: "fadeSlideUp 0.7s ease 0.65s both",
      position: "relative", zIndex: 10,
    }}>
      <div className="map-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "rgba(255,107,0,0.1)",
            border: "1px solid rgba(255,107,0,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" stroke="#FF6B00" strokeWidth="1.8" />
              <circle cx="12" cy="9" r="2.5" stroke="#FF6B00" strokeWidth="1.8" />
            </svg>
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: THEME.textMain }}>
              Our Location
            </p>
            <p style={{ margin: 0, fontFamily: "'DM Mono', monospace", fontSize: "11px", color: THEME.textMuted, letterSpacing: "0.04em" }}>
              Crosby Street, SoHo · New York, US
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative", width: 10, height: 10 }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "#FF6B00", animation: "ping 1.6s ease-in-out infinite",
            }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#FF6B00" }} />
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: THEME.textMuted, letterSpacing: "0.07em", fontWeight: 500 }}>
            LIVE LOCATION
          </span>
        </div>
      </div>

      <div
        onMouseEnter={() => setMapHovered(true)}
        onMouseLeave={() => setMapHovered(false)}
        style={{
          position: "relative", borderRadius: 20, overflow: "hidden",
          border: `1px solid ${mapHovered ? "rgba(0,0,0,0.15)" : THEME.border}`,
          transition: "all 0.3s ease",
          boxShadow: mapHovered
            ? "0 16px 40px rgba(0,0,0,0.08)"
            : "0 8px 24px rgba(0,0,0,0.04)",
          height: 280,
          transform: mapHovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        <iframe
          title="Location Map"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.009},${lat - 0.005},${lon + 0.009},${lat + 0.005}&layer=mapnik&marker=${lat},${lon}`}
          style={{
            width: "100%", height: "100%", border: "none", display: "block",
          }}
          loading="lazy"
        />

        <div style={{
          position: "absolute", top: 14, left: 14,
          background: "rgba(255,255,255,0.9)",
          border: `1px solid ${THEME.border}`,
          borderRadius: 8, padding: "5px 11px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: THEME.textMain, letterSpacing: "0.06em", fontWeight: 500 }}>
            40.7233° N · 73.9971° W
          </span>
        </div>

        <div style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(255,255,255,0.9)",
          border: `1px solid ${THEME.border}`,
          borderRadius: 8, padding: "5px 11px",
          backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", gap: 6,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00", flexShrink: 0, animation: "ping 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: THEME.textMuted, letterSpacing: "0.05em", fontWeight: 500 }}>
            SoHo, Manhattan
          </span>
        </div>

        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`}
          target="_blank"
          rel="noreferrer"
          style={{
            position: "absolute", bottom: 14, right: 14,
            background: "rgba(255,255,255,0.9)",
            border: `1px solid ${THEME.border}`,
            borderRadius: 8, padding: "7px 14px",
            backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", gap: 7,
            textDecoration: "none", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, color: THEME.textMain }}>
            Open in Maps
          </span>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#FF6B00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <div style={{
          position: "absolute", bottom: 14, left: 14,
          background: "rgba(255,255,255,0.9)",
          border: `1px solid ${THEME.border}`,
          borderRadius: 8, padding: "6px 12px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, color: THEME.textMuted }}>
            📍 Crosby St, New York, NY 10012
          </span>
        </div>
      </div>
    </div>
  );
};

const SuccessToast = ({ show }) => (
  <div style={{
    position: "fixed", bottom: 32, right: 32,
    background: THEME.cardBg,
    border: "1px solid rgba(255,107,0,0.4)",
    borderRadius: 14, padding: "14px 22px",
    display: "flex", alignItems: "center", gap: 12,
    boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,107,0,0.05)",
    transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
    transform: show ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
    opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none",
    zIndex: 9999,
  }}>
    <div style={{
      width: 34, height: 34, borderRadius: "50%",
      background: "rgba(255,107,0,0.1)",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l5 5L19 7" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div>
      <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: THEME.textMain }}>Message sent!</p>
      <p style={{ margin: 0, fontFamily: "'DM Mono', monospace", fontSize: "11px", color: THEME.textMuted }}>We'll get back to you soon.</p>
    </div>
  </div>
);

export default function Contactus() {
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAFAFA; margin: 0; }
        ::placeholder { color: #888888; font-family: 'DM Sans', sans-serif; font-size: 14px; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping {
          0%   { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #FAFAFA; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,0,0.35); border-radius: 2px; }

        .hero-row {
            display: flex;
            flex-direction: row;
            gap: 56px;
            align-items: flex-start;
        }
        .left-panel {
            flex: 0 0 46%;
            padding-right: 36px;
        }
        .contact-form-container {
            flex: 1;
            width: 100%;
        }

        @media (max-width: 900px) {
            .hero-row {
                flex-direction: column !important;
                gap: 40px !important;
            }
            .left-panel {
                flex: 1 1 100% !important;
                padding-right: 0 !important;
                width: 100%;
            }
            .contact-form-container {
                flex: 1 1 100% !important;
            }
            .map-header {
                flex-direction: column;
                align-items: flex-start !important;
                gap: 12px;
            }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: THEME.bg,
        position: "relative",
        padding: "60px 5% 80px", 
        overflow: "hidden",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}>
        <div className="hero-row" style={{
          position: "relative", zIndex: 10,
          width: "100%", maxWidth: 1080,
          margin: "0 auto",
        }}>
          <LeftPanel />
          <ContactForm onSuccess={handleSuccess} />
        </div>

        <Faqs/>
        <MapSection />
        <SuccessToast show={success} />
      </div>
    </>
  );
}