import { useState } from 'react'
import { useReveal } from './useReveal'

const FAQS = [
  { q: 'Is REVADOO really free to join?', a: "Yes, completely free. There are no subscription fees, no premium tiers that gate earnings, and no hidden charges. You sign up, complete tasks, and earn. That's it." },
  { q: 'How quickly will I receive my rewards?', a: "Most payouts are processed within 24 hours. PayPal and crypto transfers are often instant once approved. Gift cards are delivered directly to your email. We've never missed a payout." },
  { q: 'What is a Cred and how much is it worth?', a: "A Cred is REVADOO's in-platform currency. On average, 1,000 Creds = $1 USD, though exchange rates vary slightly by reward type. Steam gift cards, for example, have a better rate than some others." },
  { q: 'Are there really no earning limits?', a: 'There is no hard cap on daily earnings. High-value tasks like creative briefs and referrals can earn significantly more. Your earning potential scales with your level, streak multiplier, and task volume.' },
  { q: 'Do Creds expire?', a: 'No. Your Creds never expire as long as your account is active. We define "active" as logging in at least once every 12 months. Dormant accounts receive warning emails before any balance is affected.' },
  { q: 'Can I use REVADOO on my phone?', a: 'Yes. REVADOO is fully responsive and works great in any mobile browser. Dedicated iOS and Android apps are currently in beta — join our waitlist to get early access.' },
  { q: 'How does the referral program work?', a: 'Share your unique referral link. When someone signs up through it and completes their first task, you earn 500 Creds immediately. You also earn 5% of everything they earn for the first 90 days.' },
  { q: 'Is my personal data safe?', a: 'We are GDPR and CCPA compliant. We never sell your personal data to third parties. Survey responses are anonymized before being sent to clients. You can request full data deletion at any time from your account settings.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)
  const [hRef, hVis] = useReveal()

  return (
    /*
     * ── FIX: Changed section id from "faq" to "faq-section" and added
     *    id="faq-outer" to the inner max-width wrapper.
     *    The mobile CSS was targeting #faq-outer and #faq-section but those
     *    IDs didn't exist — padding was never overriding on mobile. ──
     */
    <section
      id="faq-section"
      aria-labelledby="faq-title"
      style={{ background: '#F9F9F9', padding: '120px 0' }}
    >
      <div id="faq-outer" style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 48px' }}>

        <style>{`
          #faq-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            align-items: start;
          }
          #faq-left { position: sticky; top: 100px; }

          @media (max-width: 1024px) {
            #faq-grid  { grid-template-columns: 1fr; gap: 48px; }
            #faq-left  { position: static; }
          }

          @media (max-width: 640px) {
            /* ── FIX: These now target the correct IDs ── */
            #faq-outer   { padding: 0 20px !important; }
            #faq-section { padding: 72px 0 !important; }
            #faq-grid    { gap: 36px; }
          }
        `}</style>

        <div id="faq-grid">

          {/* ── Left: heading block ── */}
          <div
            id="faq-left"
            ref={hRef}
            style={{
              opacity: hVis ? 1 : 0,
              transform: hVis ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div className="sec-label">
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#FF6B00', display: 'inline-block',
                animation: 'pulse-dot 2s ease infinite',
              }} />
              FAQ
            </div>

            <h2
              id="faq-title"
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 'clamp(2.8rem,5.5vw,5rem)',
                letterSpacing: '0.04em', color: '#0A0A0A',
                lineHeight: 0.95, marginBottom: '24px',
              }}
            >
              QUESTIONS?<br /><span style={{ color: '#FF6B00' }}>ANSWERED.</span>
            </h2>

            <p style={{ fontSize: '1rem', color: '#666', lineHeight: 1.75, marginBottom: '32px' }}>
              Can't find what you're looking for? Our support team responds within 2 hours, 7 days a week.
            </p>

            <a
              href="mailto:support@revadoo.com"
              className="btn-outline"
              style={{ fontSize: '0.9rem', padding: '12px 28px' }}
            >
              Contact Support
            </a>
          </div>

          {/* ── Right: accordion list ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQS.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

function FAQItem({ faq, index, isOpen, onToggle }) {
  const [ref, vis] = useReveal(0.05)
  return (
    <div
      ref={ref}
      style={{
        background: '#fff',
        borderRadius: '14px',
        border: `1.5px solid ${isOpen ? '#FF6B00' : 'rgba(0,0,0,0.07)'}`,
        overflow: 'hidden',
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ${index * 0.06}s, transform 0.6s ${index * 0.06}s cubic-bezier(0.16,1,0.3,1), border-color 0.2s`,
        boxShadow: isOpen ? '0 4px 24px rgba(255,107,0,0.1)' : 'none',
      }}
    >
      <button
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '20px 24px',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: '16px',
        }}
      >
        <span style={{
          fontFamily: "'Manrope',sans-serif", fontWeight: 600,
          fontSize: '0.97rem', color: '#0A0A0A', lineHeight: 1.5,
        }}>
          {faq.q}
        </span>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: isOpen ? '#FF6B00' : 'rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'background 0.2s, transform 0.3s',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v10M1 6h10" stroke={isOpen ? '#fff' : '#555'} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      </button>

      <div
        id={`faq-answer-${index}`}
        role="region"
        style={{
          maxHeight: isOpen ? '400px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <p style={{ padding: '0 24px 20px', fontSize: '0.93rem', color: '#666', lineHeight: 1.75 }}>
          {faq.a}
        </p>
      </div>
    </div>
  )
}