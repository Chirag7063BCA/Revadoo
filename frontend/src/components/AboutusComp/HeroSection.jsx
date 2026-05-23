import React from 'react';

// Aapke code se exact BtnPrimary yahan daal diya hai
const BtnPrimary = ({ children, href = '#' }) => (
  <a href={href} style={{
    display: 'inline-block', background: '#FF6B00', color: '#fff',
    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
    fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '15px 40px', borderRadius: 8, textDecoration: 'none', transition: 'background 0.2s',
  }}
    onMouseEnter={e => e.currentTarget.style.background = '#e55f00'}
    onMouseLeave={e => e.currentTarget.style.background = '#FF6B00'}
  >{children}</a>
)

const HeroSection = ({ gridBg }) => {
  return (
    <>
      <style>{`
        /* Hero section - Thoda sa compress kiya (85vh) */
        .about-hero { 
          position: relative; 
          min-height: 85vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          overflow: hidden; 
          background: transparent; 
        }

        /* ════ AMBIENT GLOW ════ */
        @keyframes pulseGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.9; }
        }

        /* ════ HUD CORNER ELEMENTS (Sci-Fi Vibe) ════ */
        .hud-element {
          position: absolute;
          font-family: 'Barlow Condensed', monospace;
          font-size: 0.75rem;
          color: rgba(255,107,0,0.8);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 12px;
          pointer-events: none;
          z-index: 5;
        }
        .hud-line {
          height: 1px;
          background: rgba(255,107,0,0.4);
          position: relative;
        }
        .hud-line::after {
          content: '';
          position: absolute;
          right: 0; top: -1px;
          width: 3px; height: 3px;
          background: #FF6B00;
        }
        
        .hud-top-left { top: 40px; left: 40px; }
        .hud-top-left .hud-line { width: 60px; }
        
        .hud-bottom-right { bottom: 40px; right: 40px; flex-direction: row-reverse; }
        .hud-bottom-right .hud-line { width: 100px; transform: scaleX(-1); }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .hud-element { display: none; } 
        }
      `}</style>
      
      <section className="about-hero">
        
        {/* Transparent Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, ...gridBg, pointerEvents: 'none' }} />
        
        {/* Animated Glowing Orb in background */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 'min(900px,100vw)', height: 600, pointerEvents: 'none',
          background: 'radial-gradient(ellipse,rgba(255,107,0,0.12) 0%,transparent 60%)',
          animation: 'pulseGlow 5s infinite ease-in-out'
        }} />

        {/* ════ HUD ELEMENTS ════ */}
        <div className="hud-element hud-top-left">
          <div className="hud-line"></div>
          <span>SYS.ONLINE</span>
        </div>
        <div className="hud-element hud-bottom-right">
          <span>SYNC_VOL: {'>'} $10M</span>
          <div className="hud-line"></div>
        </div>

        {/* ════ MAIN CONTENT ════ */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 clamp(16px,5vw,24px)', width: '100%' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 32, height: 2, background: '#FF6B00' }} />
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.3em', color: '#FF6B00', textTransform: 'uppercase' }}>
              REWARDS PROTOCOL
            </span>
            <div style={{ width: 32, height: 2, background: '#FF6B00' }} />
          </div>
          
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
            fontSize: 'clamp(3rem, 10vw, 8rem)', letterSpacing: '-0.02em',
            lineHeight: 0.9, color: '#0A0A0A', 
            textTransform: 'uppercase', marginBottom: 24,
          }}>
            DO TASKS.<br />
            <span style={{ color: '#FF6B00' }}>EARN REWARDS.</span>
          </h1>
          
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400,
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            color: 'rgba(0,0,0,0.6)', 
            maxWidth: 520, margin: '0 auto',
            lineHeight: 1.7, letterSpacing: '0.02em',
            marginBottom: 36, /* Button ke upar space ke liye */
          }}>
            We built the simplest architecture to convert your spare time into real digital assets, cash, and gift cards.
          </p>

          {/* ════ BUTTON ════ */}
          <BtnPrimary href="#about-us">
            ABOUT US
          </BtnPrimary>

        </div>
      </section>
    </>
  );
};

export default HeroSection;