import React, { useState } from "react";

// ─── Theme Colors ─────────────────────────────────────────────────────────────
const THEME = {
  bg: "#FAFAFA",
  cardBg: "#FFFFFF",
  textMain: "#111111",
  textMuted: "#666666",
  border: "rgba(0,0,0,0.08)",
  orange: "#FF6B00",
};

// ─── Main Component (Interactive FAQ) ─────────────────────────────────────────
export default function InteractiveFAQ() {
  const [activeCat, setActiveCat] = useState("earnings");

  const categories = [
    { id: "earnings", label: "Earnings & Payouts", icon: "💰" },
    { id: "security", label: "Account & Security", icon: "🛡️" },
    { id: "tasks", label: "Tasks & Offers", icon: "🎯" },
    { id: "general", label: "General Inquiries", icon: "🌐" },
  ];

  // Informative & Realistic FAQ Data
  const FAQ_DATA = {
    earnings: [
      { q: "What is the minimum payout threshold?", a: "We believe in instant access to your funds. There is absolutely zero minimum threshold. You can cash out as soon as you complete your first task." },
      { q: "How long do withdrawals take?", a: "Withdrawals to Crypto (BTC, USDT) and PayPal are processed instantly via our automated smart-contract system. Bank transfers may take 1-2 business days." },
      { q: "What payout methods are supported?", a: "We support over 10 different global payout methods including PayPal, Bitcoin, Ethereum, USDT, Amazon Gift Cards, and direct Bank Wire." },
      { q: "Are there any hidden withdrawal fees?", a: "No hidden fees. Standard blockchain network fees apply for crypto withdrawals, but premium tier users get 3 free withdrawals per month." },
      { q: "Why is my payout pending?", a: "For security, large withdrawals or first-time cashouts might trigger a manual review to prevent fraud. This usually concludes within 12 hours." }
    ],
    security: [
      { q: "Is my personal data secure?", a: "Yes. We employ military-grade AES-256 encryption for all user data. Your privacy is our top priority and we never sell your data to third parties." },
      { q: "Can I use a VPN or Proxy?", a: "No. To maintain ecosystem integrity and advertiser trust, VPNs and proxies are strictly prohibited and will result in instant account suspension." },
      { q: "How does KYC verification work?", a: "Level 1 verification takes 30 seconds. Just upload a valid ID and our AI instantly verifies your identity so you can start earning without limits." },
      { q: "How do I enable Two-Factor Authentication (2FA)?", a: "Navigate to your Account Settings > Security. We recommend using Google Authenticator or Authy to secure your wallet." },
      { q: "What if my account is hacked?", a: "Contact our 24/7 support immediately. We will freeze all outgoing transactions and help you recover access securely." }
    ],
    tasks: [
      { q: "How often are new tasks added?", a: "Our AI engine aggregates over 500+ new micro-tasks globally every 24 hours. Keep refreshing your dashboard for fresh opportunities." },
      { q: "Why was my task rejected?", a: "Tasks are verified by both AI and human auditors. Rejections typically occur if instructions weren't fully followed or if proof screenshots were blurry." },
      { q: "Do task payouts vary by region?", a: "Yes, advertisers target specific demographics, which can affect the payout rate based on your geographical location." },
      { q: "Is there a daily limit to tasks?", a: "No! You can complete as many tasks as are available to your demographic. The more you work, the more you earn." },
      { q: "How do surveys match with my profile?", a: "Our algorithm matches you based on the profile data you filled out during sign-up. Keeping your profile updated ensures higher-paying survey matches." }
    ],
    general: [
      { q: "What exactly is this platform?", a: "We are a next-generation task marketplace connecting everyday users with global advertisers, allowing you to turn spare time into real income." },
      { q: "How does the referral program work?", a: "Share your unique referral link to earn a lifetime 10% commission on all your referrals' task earnings. There is no cap on how many friends you can invite." },
      { q: "Can I use multiple devices?", a: "Absolutely. You can log in from your phone, tablet, or desktop. However, creating multiple accounts per user is strictly forbidden." },
      { q: "Do you have a mobile app?", a: "Our web platform is fully progressive and optimized for mobile browsers. A native iOS and Android app is currently in beta testing." },
      { q: "How do I contact live support?", a: "Use the contact form above, or click the chat widget in the bottom right corner of your dashboard for immediate assistance." }
    ]
  };

  return (
    <div style={{ 
      width: "100%", maxWidth: 1150, margin: "0 auto", 
      padding: "40px 20px", position: "relative", zIndex: 10,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      
      {/* Custom Scrollbar Styles injected for FAQ scroller */}
      <style>{`
        .faq-scroller::-webkit-scrollbar { width: 6px; }
        .faq-scroller::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); border-radius: 4px; }
        .faq-scroller::-webkit-scrollbar-thumb { background: rgba(255,107,0,0.3); border-radius: 4px; }
        .faq-scroller::-webkit-scrollbar-thumb:hover { background: rgba(255,107,0,0.6); }
      `}</style>

      {/* Top Header Logo Row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 50, animation: "fadeSlideUp 0.6s ease both" }}>
        <div style={{ 
          width: 34, height: 34, borderRadius: 6, border: `2px solid ${THEME.textMain}`, 
          display: "flex", alignItems: "center", justifyContent: "center", 
          position: "relative", overflow: "hidden" 
        }}>
          <div style={{ position: "absolute", inset: 0, background: "#EAEAEA", transform: "skewX(-15deg) translateX(4px)" }} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: THEME.textMain, position: "relative", zIndex: 2 }}>F</span>
        </div>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: THEME.textMain, letterSpacing: "0.04em" }}>
          HELP & SUPPORT CENTER
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
        
        {/* ─── Left Side: Categories ─── */}
        <div style={{ flex: "1 1 400px", animation: "fadeSlideUp 0.6s ease 0.1s both" }}>
          <h2 style={{ 
            fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: "clamp(48px, 6vw, 72px)", 
            color: THEME.textMain, lineHeight: 1.05, marginBottom: 36 
          }}>
            How can we <span style={{ color: THEME.orange }}>help you?</span>
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {categories.map((cat) => {
              const isSel = activeCat === cat.id;
              return (
                <div key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
                  background: isSel ? THEME.orange : THEME.cardBg,
                  color: isSel ? "#FFF" : THEME.textMain,
                  border: `1px solid ${isSel ? THEME.orange : THEME.border}`,
                  padding: "20px 24px", borderRadius: 16, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 16,
                  fontWeight: 700, fontSize: 16,
                  boxShadow: isSel ? "0 8px 24px rgba(255,107,0,0.25)" : "0 2px 10px rgba(0,0,0,0.02)",
                  transform: isSel ? "translateY(-3px)" : "translateY(0)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}>
                  <span style={{ fontSize: 24, opacity: isSel ? 1 : 0.6, transition: "opacity 0.3s" }}>{cat.icon}</span>
                  {cat.label}
                </div>
              )
            })}
          </div>
        </div>

        {/* ─── Right Side: Scrollable Interactive FAQs ─── */}
        <div style={{
          flex: "1 1 450px",
          background: THEME.cardBg,
          border: `1px solid ${THEME.border}`,
          borderRadius: 24, padding: "36px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.04)",
          animation: "fadeSlideUp 0.6s ease 0.2s both",
          position: "relative", overflow: "hidden",
          display: "flex", flexDirection: "column"
        }}>
          {/* Subtle BG glow inside card */}
          <div style={{ position: "absolute", top: -50, right: -50, width: 250, height: 250, background: "radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          
          <h3 style={{ fontWeight: 800, fontSize: 22, color: THEME.textMain, marginBottom: 24, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: THEME.orange }}>|</span> {categories.find(c => c.id === activeCat).label} FAQs
          </h3>
          
          {/* Scrollable Container */}
          <div className="faq-scroller" style={{ 
             flex: 1, maxHeight: "400px", overflowY: "auto", paddingRight: "16px", 
             display: "flex", flexDirection: "column", gap: 16 
          }}>
            {FAQ_DATA[activeCat].map((item, index) => (
              <div key={`${activeCat}-${index}`} style={{
                background: "#F9F9F9",
                border: `1px solid ${THEME.border}`,
                borderRadius: 16, padding: "20px",
                transition: "all 0.3s ease",
                animation: `fadeSlideUp 0.4s ease ${index * 0.1}s both`
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.border = `1px solid rgba(255,107,0,0.4)`; 
                e.currentTarget.style.background = "#FFFFFF"; 
                e.currentTarget.style.transform = "translateX(4px)"; 
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,107,0,0.05)";
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.border = `1px solid ${THEME.border}`; 
                e.currentTarget.style.background = "#F9F9F9"; 
                e.currentTarget.style.transform = "translateX(0)"; 
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <h4 style={{ fontWeight: 700, fontSize: 15, color: THEME.textMain, marginBottom: 10, display: "flex", gap: 10, alignItems: "flex-start", lineHeight: 1.4 }}>
                  <span style={{ color: THEME.orange, flexShrink: 0, fontWeight: 800 }}>Q.</span>
                  {item.q}
                </h4>
                <p style={{ fontSize: 13, color: THEME.textMuted, lineHeight: 1.6, margin: "0 0 0 24px" }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}