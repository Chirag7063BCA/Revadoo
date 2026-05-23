import React from 'react'

const HowItWorks = () => {
  const steps = [
    { num: '01', icon: '🆕', title: 'Create Free Account', desc: 'Sign up in 30 seconds. No credit card, no hidden fees. Your journey to earning starts immediately.' },
    { num: '02', icon: '🎯', title: 'Pick Your Tasks',     desc: 'Choose from surveys, mini games, creative challenges, watching content, and 50+ more task types updated daily.' },
    { num: '03', icon: '⚡', title: 'Earn Creds Instantly', desc: 'Every completed task drops Creds directly into your wallet. Watch your balance grow in real-time.' },
    { num: '04', icon: '💰', title: 'Cash Out Anytime',    desc: 'Convert Creds to PayPal cash, Amazon gift cards, crypto, or 100+ reward options with zero minimum threshold.' },
  ]

  return (
    <>
      {/*
       * ── FIX: Added responsive <style> block.
       *    Previously HowItWorks was the only section with no mobile overrides.
       *    The 120px 48px padding was eating ~96px of horizontal space on phones.
       *    Also hides the horizontal dashed connector line when cards stack
       *    vertically on mobile (it looks broken in a single-column layout). ──
       */}
      <style>{`
        #how-it-works-section {
          padding: 120px 48px;
        }
        @media (max-width: 900px) {
          #how-it-works-section {
            padding: 80px 32px !important;
          }
        }
        @media (max-width: 640px) {
          #how-it-works-section {
            padding: 72px 20px !important;
          }
          /* Hide horizontal dashed connector — looks broken in single-column layout */
          #how-it-works-connector {
            display: none !important;
          }
        }
      `}</style>

      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        style={{ background: '#FAFAFA', position: 'relative', overflow: 'hidden' }}
      >
        <div id="how-it-works-section">
          {/* Decorative glow */}
          <div style={{
            position: 'absolute', top: -200, right: -200,
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(255,107,0,0.05) 0%,transparent 70%)',
            pointerEvents: 'none',
          }} aria-hidden="true" />

          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 72 }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}>HOW IT WORKS</div>
              <h2
                id="how-it-works-heading"
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 'clamp(2.8rem,5vw,4.5rem)',
                  letterSpacing: '0.04em', lineHeight: 1, marginBottom: 20,
                }}
              >
                FOUR STEPS TO YOUR<br /><span style={{ color: '#FF6B00' }}>FIRST PAYOUT</span>
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#555', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                We've engineered the simplest path from sign-up to cash-out. No complexity, no confusion.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 32, position: 'relative' }}>
              {/*
               * ── FIX: Added id="how-it-works-connector" so the mobile CSS
               *    can hide it when cards stack to a single column. ──
               */}
              <div
                id="how-it-works-connector"
                aria-hidden="true"
                style={{
                  position: 'absolute', top: 60, left: '12.5%', right: '12.5%', height: 1,
                  background: 'repeating-linear-gradient(90deg,#FF6B00 0,#FF6B00 8px,transparent 8px,transparent 20px)',
                  pointerEvents: 'none', opacity: 0.3,
                }}
              />

              {steps.map((s, i) => (
                <div
                  key={i}
                  className="reveal"
                  style={{
                    background: '#fff', borderRadius: 24, padding: '40px 32px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                    position: 'relative', overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'default',
                    transitionDelay: `${i * 0.1}s`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 16px 48px rgba(255,107,0,0.12)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.04)'
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute', top: 20, right: 24,
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: '3.5rem', color: 'rgba(255,107,0,0.06)',
                      letterSpacing: '0.05em', lineHeight: 1,
                    }}
                  >{s.num}</div>

                  <div style={{
                    width: 52, height: 52, borderRadius: 16, background: '#FFF5EE',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, marginBottom: 20,
                  }}>{s.icon}</div>

                  <h3 style={{
                    fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.6rem',
                    letterSpacing: '0.04em', color: '#0A0A0A', marginBottom: 12,
                  }}>{s.title}</h3>

                  <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HowItWorks