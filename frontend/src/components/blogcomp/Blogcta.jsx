import React from 'react';

const ORANGE = '#FF6B00';
const DARK   = '#0A0A0A';

export default function BlogCTA() {
  return (
    <section
      aria-labelledby="blog-cta-heading"
      style={{
        background: DARK,
        padding: 'clamp(60px,8vw,100px) clamp(16px,4vw,64px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid bg */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,107,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,0,0.04) 1px,transparent 1px)',
          backgroundSize: 'clamp(32px,5vw,56px) clamp(32px,5vw,56px)',
        }}
      />
      {/* Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '70%', height: '80%',
          background: 'radial-gradient(ellipse,rgba(255,107,0,0.12) 0%,transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="sec-label" style={{ color: ORANGE, justifyContent: 'center' }}>
          Start Earning Today
        </div>

        <h2
          id="blog-cta-heading"
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 'clamp(2.4rem,6vw,5rem)',
            lineHeight: 0.93, letterSpacing: '0.04em',
            color: '#fff', textTransform: 'uppercase',
            marginBottom: 24, wordBreak: 'break-word',
          }}
        >
          PUT WHAT YOU<br />
          <span style={{ color: ORANGE }}>JUST READ</span><br />
          INTO ACTION.
        </h2>

        <p
          style={{
            fontFamily: "'Manrope',sans-serif",
            fontSize: 'clamp(13px,1.2vw,16px)',
            color: 'rgba(255,255,255,0.45)', lineHeight: 1.8,
            maxWidth: 480, margin: '0 auto 44px', wordBreak: 'break-word',
          }}
        >
          Every strategy on this blog works — but only if you use it. Join 2.4 million
          earners who are already converting spare time into real rewards.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', padding: '0 16px' }}>
          <a
            href="#tasks-section"
            className="btn-primary"
            style={{ fontSize: 'clamp(0.85rem,1.5vw,1rem)', padding: 'clamp(12px,2vw,16px) clamp(24px,4vw,44px)' }}
          >
            Create Free Account →
          </a>
          <a
            href="#rewards-section"
            className="btn-outline"
            style={{
              fontSize: 'clamp(0.85rem,1.5vw,1rem)',
              padding: 'clamp(12px,2vw,16px) clamp(24px,4vw,44px)',
              color: 'rgba(255,255,255,0.6)',
              borderColor: 'rgba(255,255,255,0.15)',
            }}
          >
            View Rewards
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(10px,3vw,32px)', marginTop: 44, flexWrap: 'wrap' }}>
          {['✓ Free Forever', '✓ Instant Payouts', '✓ No Hidden Fees', '✓ 100+ Reward Options'].map(t => (
            <span
              key={t}
              style={{
                fontFamily: "'Manrope',sans-serif",
                fontSize: 'clamp(0.6rem,1vw,0.72rem)',
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.08em', fontWeight: 600, whiteSpace: 'nowrap',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}