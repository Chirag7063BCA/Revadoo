import React from 'react'

const CTASECTION = () => {
  return (
    <section
      id="cta-section"
      aria-labelledby="cta-heading"
      style={{
        padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,48px)',
        background: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 'min(700px,90vw)', height: 'min(500px,60vw)',
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse,rgba(255,107,0,0.14) 0%,transparent 70%)',
      }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,107,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,0,0.04) 1px,transparent 1px)',
        backgroundSize: 'clamp(32px,8vw,64px) clamp(32px,8vw,64px)',
      }} />

      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="sec-label" style={{ justifyContent: 'center', marginBottom: 24 }}>
          GET STARTED TODAY
        </div>

        <h2
          id="cta-heading"
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 'clamp(2.5rem,6vw,5.5rem)',
            letterSpacing: '0.04em', lineHeight: 0.95,
            marginBottom: 28, color: '#fff',
          }}
        >
          YOUR TIME HAS<br />
          <span style={{ color: '#FF6B00' }}>VALUE.</span><br />
          START CLAIMING IT.
        </h2>

        <p style={{
          fontSize: 'clamp(0.9rem,2vw,1.05rem)',
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.75,
          maxWidth: 480,
          margin: '0 auto 48px',
        }}>
          Join 2.4 million earners who are already turning spare minutes into real money. Free forever. No catch.
        </p>

        {/* ── FIX: Removed width:'clamp(180px,40vw,auto)' — 'auto' is not a valid
            clamp() max value and silently breaks button sizing on mobile.
            flexbox wrapping on the parent handles layout instead. ── */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '0 16px',
        }}>
          <a
            href="#tasks-section"
            className="btn-primary"
            style={{
              fontSize: 'clamp(0.9rem,2vw,1.05rem)',
              padding: 'clamp(12px,2vw,16px) clamp(24px,5vw,44px)',
              minWidth: 180,
            }}
          >
            Create Free Account &nbsp;→
          </a>
          <a
            href="#how-it-works"
            className="btn-outline"
            style={{
              fontSize: 'clamp(0.9rem,2vw,1.05rem)',
              padding: 'clamp(12px,2vw,16px) clamp(24px,5vw,44px)',
              color: 'rgba(255,255,255,0.7)',
              borderColor: 'rgba(255,255,255,0.15)',
              minWidth: 180,
            }}
          >
            Learn More
          </a>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(12px,3vw,32px)',
          marginTop: 48,
          flexWrap: 'wrap',
          padding: '0 16px',
        }}>
          {['✓ Free Forever', '✓ Instant Payouts', '✓ No Hidden Fees', '✓ 100+ Reward Options'].map(t => (
            <span key={t} style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 'clamp(0.62rem,1.2vw,0.72rem)',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.08em',
            }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CTASECTION