import React, { useState } from 'react'

/* ─────────────────────────────────────────────
   Footer — Revadoo
   Layout:  4-col (xl) → 2-col (sm) → 1-col (xs)
   No separate "top strip" — newsletter lives in
   col 3 so nothing floats or breaks.
───────────────────────────────────────────── */

const NAV = [
  { label: 'Home',       href: '/'          },
  { label: 'About Us',   href: '/aboutus'   },
  { label: 'Blog',       href: '/blog'      },
  { label: 'FAQ',        href: '/faq'       },
  { label: 'Contact Us', href: '/contactus' },
]

const LEGAL = [
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Privacy Policy',     href: '/privacy-policy'       },
  { label: 'Responsible Gaming', href: '/responsible-gaming'   },
]

const PAYOUTS = ['Visa', 'Mastercard', 'PayPal', 'Bitcoin', 'Ethereum', 'Crypto']

const SOCIAL = [
  {
    label: 'Twitter',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

/* ─── Sub-components ─── */

function ColHead({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
      <span style={{ display: 'block', width: 20, height: 2, background: '#FF6B00', flexShrink: 0 }} />
      <span style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)',
      }}>
        {children}
      </span>
    </div>
  )
}

function FLink({ href, children }) {
  const [h, setH] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        textDecoration: 'none',
        color: h ? '#FF6B00' : 'rgba(255,255,255,0.5)',
        fontFamily: "'Manrope', sans-serif",
        fontSize: 13.5, fontWeight: 500,
        transition: 'color 0.18s',
      }}
    >
      <svg
        width="6" height="10" viewBox="0 0 6 10" fill="#FF6B00"
        style={{ flexShrink: 0, transition: 'transform 0.18s', transform: h ? 'translateX(2px)' : 'none' }}
      >
        <path d="M0 0 L6 5 L0 10 Z" />
      </svg>
      {children}
    </a>
  )
}

export default function Footer() {
  const [email, setEmail]         = useState('')
  const [subscribed, setSub]      = useState(false)
  const [err, setErr]             = useState(false)

  const handleSub = (e) => {
    e.preventDefault()
    if (!email.includes('@')) { setErr(true); return }
    setSub(true); setErr(false)
  }

  /* shared text style */
  const muted = { fontFamily: "'Manrope', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.7 }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Manrope:wght@400;500;600;700&display=swap');

        @keyframes ghostDrift {
          0%,100% { transform: translateX(-50%) translateY(0px); }
          50%      { transform: translateX(-50%) translateY(-12px); }
        }
        @keyframes liveBlink {
          0%,100% { opacity:1; } 50% { opacity:0.35; }
        }

        /* hover helpers — avoids inline ternaries for every hover */
        .reva-social { transition: background .18s, color .18s, border-color .18s, transform .18s; }
        .reva-social:hover { background:#FF6B00!important; color:#fff!important; border-color:#FF6B00!important; transform:translateY(-3px); }

        .reva-pill { transition: background .18s, color .18s, border-color .18s, transform .18s; }
        .reva-pill:hover { background:#FF6B00!important; border-color:#FF6B00!important; color:#fff!important; transform:translateY(-2px); }

        .reva-cta { transition: background .18s, color .18s, border-color .18s; }
        .reva-cta:hover { background:#FF6B00!important; color:#fff!important; border-color:#FF6B00!important; }

        .reva-sub { transition: background .18s; }
        .reva-sub:hover { background:#e05500!important; }

        .reva-nl:focus { outline:none; border-color:rgba(255,107,0,.5)!important; }

        .reva-contact-a { transition: color .18s; }
        .reva-contact-a:hover { color:#FF6B00!important; }

        .reva-bot-a { transition: color .18s; }
        .reva-bot-a:hover { color:#FF6B00!important; }

        /* responsive grid */
        .footer-grid {
          display: grid;
          gap: 40px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px 32px;
          }
          /* brand col spans full width on sm */
          .footer-brand-col {
            grid-column: 1 / -1;
          }
        }
        @media (min-width: 1280px) {
          .footer-grid {
            grid-template-columns: 1.15fr 1fr 1fr 1.1fr;
            gap: 40px 36px;
          }
          .footer-brand-col {
            grid-column: auto;
          }
        }
      `}</style>

      <footer style={{ background: '#080808', position: 'relative', overflow: 'hidden' }}>

        {/* ─── bg: dot grid ─── */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(255,107,0,0.025) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(255,107,0,0.025) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
        }} />

        {/* ─── bg: radial glow ─── */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 500, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse at bottom,rgba(255,107,0,0.09) 0%,transparent 65%)',
        }} />

        {/* ─── ghost wordmark (hidden on mobile) ─── */}
        <div aria-hidden="true" style={{
          display: 'none',
          position: 'absolute', zIndex: 0,
          bottom: 44, left: '50%',
          fontFamily: "'Barlow Condensed',sans-serif",
          fontWeight: 900, fontSize: 'clamp(5rem,13vw,12rem)',
          letterSpacing: '-0.02em', textTransform: 'uppercase',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.03)',
          whiteSpace: 'nowrap',
          animation: 'ghostDrift 10s ease-in-out infinite',
          pointerEvents: 'none', userSelect: 'none',
          // visible on md+
        }}
          className="md:block"
        >
          REVADOO
        </div>

        {/* ══════════════════ MAIN CONTENT ══════════════════ */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1360, margin: '0 auto', padding: 'clamp(40px,6vw,60px) clamp(20px,4vw,56px)' }}>

          {/* orange accent line */}
          <div style={{
            height: 1, marginBottom: 'clamp(36px,5vw,52px)',
            background: 'linear-gradient(90deg,#FF6B00 0%,rgba(255,107,0,0.1) 55%,transparent 100%)',
          }} />

          <div className="footer-grid">

            {/* ══ COL 1 — Brand ══ */}
            <div className="footer-brand-col">

              {/* Logotype */}
              <div style={{ marginBottom: 18, lineHeight: 1, fontFamily: "'Barlow Condensed',sans-serif" }}>
                <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', textTransform: 'uppercase' }}>REVA</span>
                <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.02em', color: '#FF6B00', textTransform: 'uppercase' }}>DOO</span>
              </div>

              {/* Tagline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ width: 18, height: 2, background: '#FF6B00', flexShrink: 0 }} />
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#FF6B00' }}>
                  EARN. REDEEM. REPEAT.
                </span>
              </div>

              <p style={{ ...muted, maxWidth: 220, marginBottom: 20 }}>
                Turning spare time into real cash, gift cards &amp; crypto for millions of earners every day.
              </p>

              {/* Social */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                {SOCIAL.map(s => (
                  <a key={s.label} href="#" aria-label={s.label} className="reva-social"
                    style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Live */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0, animation: 'liveBlink 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
                  47K+ tasks completed today
                </span>
              </div>
            </div>

            {/* ══ COL 2 — Nav + Legal ══ */}
            <div>
              <ColHead>Quick Links</ColHead>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {NAV.map(l => <li key={l.label}><FLink href={l.href}>{l.label}</FLink></li>)}
              </ul>

              <div style={{ marginTop: 32 }}>
                <ColHead>Legal</ColHead>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {LEGAL.map(l => <li key={l.label}><FLink href={l.href}>{l.label}</FLink></li>)}
                </ul>
              </div>
            </div>

            {/* ══ COL 3 — Contact + Newsletter ══ */}
            <div>
              <ColHead>Contact</ColHead>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                {[
                  {
                    href: 'mailto:support@revadoo.com', text: 'support@revadoo.com',
                    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>,
                  },
                  {
                    href: 'tel:+111256562548', text: '+1 112 565 62548',
                    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                  },
                ].map(({ href, text, icon }) => (
                  <a key={href} href={href} className="reva-contact-a"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.18)' }}>
                      {icon}
                    </span>
                    <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 500 }}>{text}</span>
                  </a>
                ))}
              </div>

              {/* Newsletter */}
              <ColHead>Newsletter</ColHead>
              <p style={{ ...muted, marginBottom: 12 }}>Weekly tips. Free forever. No spam.</p>

              {subscribed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 700, color: '#22c55e' }}>You're subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleSub} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(false) }}
                    placeholder="your@email.com" aria-label="Newsletter email"
                    className="reva-nl"
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 8,
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${err ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      color: '#fff', fontFamily: "'Manrope',sans-serif", fontSize: 13,
                      boxSizing: 'border-box',
                    }}
                  />
                  <button type="submit" className="reva-sub"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#FF6B00', color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Subscribe →
                  </button>
                  {err && <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: '#ef4444', margin: 0 }}>Enter a valid email.</p>}
                </form>
              )}
            </div>

            {/* ══ COL 4 — Payouts ══ */}
            <div>
              <ColHead>Payout Methods</ColHead>
              <p style={{ ...muted, marginBottom: 14 }}>
                Fast, secure payouts via all major providers. No minimum required.
              </p>

              {/* Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
                {PAYOUTS.map(p => (
                  <span key={p} className="reva-pill" style={{
                    fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
                    fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '6px 13px', borderRadius: 99,
                    color: 'rgba(255,255,255,0.65)',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,107,0,0.2)',
                    cursor: 'default',
                  }}>
                    {p}
                  </span>
                ))}
              </div>

              {/* Stats 2×2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 22 }}>
                {[
                  { v: '$74',  l: 'Avg. Monthly'   },
                  { v: '22min',l: 'First Payout'   },
                  { v: '2.4M', l: 'Active Earners' },
                  { v: '100+', l: 'Reward Options' },
                ].map(({ v, l }) => (
                  <div key={l} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: '1.5rem', color: '#FF6B00', lineHeight: 1, marginBottom: 4 }}>{v}</div>
                    <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a href="#rewards-section" className="reva-cta"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '11px 22px', borderRadius: 8, color: '#FF6B00', border: '1.5px solid rgba(255,107,0,0.35)' }}>
                View All Rewards
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>

          </div>{/* /footer-grid */}
        </div>

        {/* ══════════ BOTTOM BAR ══════════ */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1360, margin: '0 auto', padding: '16px clamp(20px,4vw,56px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

            <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.22)', margin: 0, fontWeight: 500 }}>
              © 2026{' '}<span style={{ color: '#FF6B00', fontWeight: 700 }}>Revadoo</span>. All Rights Reserved.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {['Privacy', 'Terms', 'Cookies'].map((item, i, arr) => (
                <React.Fragment key={item}>
                  <a href={`/${item.toLowerCase()}`} className="reva-bot-a"
                    style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', textDecoration: 'none' }}>
                    {item}
                  </a>
                  {i < arr.length - 1 && <span aria-hidden="true" style={{ display: 'block', width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

      </footer>
    </>
  )
}