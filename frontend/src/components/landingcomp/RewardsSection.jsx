import React, { useState, useCallback, memo } from 'react';
import {
  ArrowRight, Flame, Sparkles, TrendingUp, Shield, Zap,
  Banknote, Bitcoin, CreditCard, Gift, Gamepad2, Smartphone,
  Tv, Music, Dices, Headphones, Coffee, PlayCircle,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   DATA  (module-level — never recreated)
───────────────────────────────────────────────────────────── */
const ALL_REWARDS = [
  { icon: Banknote,   name: 'PayPal Cash',      val: '$5 – $500',     creds: '500',   tag: 'MOST POPULAR' },
  { icon: Bitcoin,    name: 'Bitcoin',           val: '$10+',          creds: '1,200', tag: 'TRENDING'     },
  { icon: CreditCard, name: 'Visa Prepaid',      val: '$25 – $250',    creds: '2,500', tag: 'HOT'          },
  { icon: Gift,       name: 'Amazon Gift Card',  val: '$10 – $200',    creds: '1,000', tag: null           },
  { icon: Gamepad2,   name: 'Steam Wallet',      val: '$5 – $100',     creds: '600',   tag: null           },
  { icon: Smartphone, name: 'Apple Gift Card',   val: '$10 – $100',    creds: '1,100', tag: null           },
  { icon: Tv,         name: 'Netflix Credit',    val: '$15 / month',   creds: '1,500', tag: null           },
  { icon: Music,      name: 'Spotify Premium',   val: '1 – 12 months', creds: '800',   tag: null           },
  { icon: Dices,      name: 'Roblox Credits',    val: '800 – 4500',    creds: '900',   tag: null           },
  { icon: Headphones, name: 'Discord Nitro',     val: '1 Month',       creds: '1,000', tag: null           },
  { icon: Coffee,     name: 'Starbucks Card',    val: '$10 – $50',     creds: '550',   tag: null           },
  { icon: PlayCircle, name: 'Google Play',       val: '$5 – $100',     creds: '650',   tag: null           },
];

const ROW_ONE = [...ALL_REWARDS.slice(0, 6), ...ALL_REWARDS.slice(0, 6)];
const ROW_TWO = [...ALL_REWARDS.slice(6),    ...ALL_REWARDS.slice(6)];

const STATS = [
  { val: '$2.3M+', label: 'Total Paid Out',   icon: TrendingUp },
  { val: '100+',   label: 'Reward Options',   icon: Sparkles   },
  { val: '0',      label: 'Minimum Payout',   icon: Zap        },
  { val: '100%',   label: 'Secure & Verified',icon: Shield     },
];

const TRUST_CHIPS = [
  { icon: Shield, label: 'Instant Delivery'   },
  { icon: Zap,    label: 'Zero Minimum'       },
  { icon: Flame,  label: 'Creds Never Expire' },
];

/* ─────────────────────────────────────────────────────────────
   STATIC STYLE OBJECTS  (module-level — zero allocation per render)
───────────────────────────────────────────────────────────── */
const S = {
  cardBase: {
    flexShrink: 0, width: 210, borderRadius: 20,
    padding: '22px 20px 20px', cursor: 'pointer',
    position: 'relative', overflow: 'hidden',
    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.2s ease, background 0.2s ease',
    userSelect: 'none',
    willChange: 'transform',           // GPU-composited layer
    contain: 'layout style paint',     // limit repaint scope
  },
  cardRest: {
    background: '#F9F7F5',
    border: '1.5px solid rgba(0,0,0,0.08)',
    transform: 'translateY(0) scale(1)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  cardHov: {
    background: '#FFFFFF',
    border: '1.5px solid rgba(255,107,0,0.45)',
    transform: 'translateY(-6px) scale(1.02)',
    boxShadow: '0 20px 48px rgba(255,107,0,0.13), 0 4px 16px rgba(0,0,0,0.07)',
  },
  glow: {
    position: 'absolute', top: 0, right: 0,
    width: 130, height: 130, borderRadius: '50%',
    background: 'radial-gradient(circle,rgba(255,107,0,0.09) 0%,transparent 70%)',
    transform: 'translate(30%,-30%)', pointerEvents: 'none',
    transition: 'opacity 0.2s ease',
  },
  iconBoxBase: {
    width: 48, height: 48, borderRadius: 14, marginBottom: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.2s, border-color 0.2s',
  },
  iconBoxRest: {
    background: 'rgba(0,0,0,0.04)',
    border: '1px solid rgba(0,0,0,0.07)',
    transform: 'scale(1) rotate(0deg)',
  },
  iconBoxHov: {
    background: 'rgba(255,107,0,0.07)',
    border: '1px solid rgba(255,107,0,0.18)',
    transform: 'scale(1.1) rotate(-4deg)',
  },
  cardName: {
    fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.15rem',
    letterSpacing: '0.04em', color: '#0A0A0A', marginBottom: 4, lineHeight: 1.1,
  },
  cardVal: {
    fontFamily: "'Manrope',sans-serif", fontSize: '0.75rem',
    color: 'rgba(0,0,0,0.38)', marginBottom: 16, fontWeight: 500,
  },
  dividerRest: {
    height: 1, marginBottom: 14,
    background: 'linear-gradient(90deg,rgba(0,0,0,0.08),transparent)',
    transition: 'background 0.2s',
  },
  dividerHov: {
    height: 1, marginBottom: 14,
    background: 'linear-gradient(90deg,rgba(255,107,0,0.35),transparent)',
    transition: 'background 0.2s',
  },
  credRow: { display: 'flex', alignItems: 'baseline', gap: 3 },
  credNum: {
    fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.6rem',
    color: '#FF6B00', letterSpacing: '0.02em', lineHeight: 1,
  },
  credLabel: {
    fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: '0.6rem',
    color: 'rgba(255,107,0,0.65)', letterSpacing: '0.12em',
  },
  marqueeOuter: { overflow: 'hidden', width: '100%' },
  marqueeInner: { display: 'flex', gap: 18, width: 'max-content', padding: '8px 0', willChange: 'transform' },
};

/* ─────────────────────────────────────────────────────────────
   BADGE  (pure, no state)
───────────────────────────────────────────────────────────── */
const Badge = memo(({ tag }) => {
  const isTrending = tag === 'TRENDING';
  return (
    <div style={{
      position: 'absolute', top: 14, right: 14,
      background: isTrending ? '#FFF4EC' : '#FF6B00',
      border: isTrending ? '1px solid rgba(255,107,0,0.35)' : 'none',
      borderRadius: 99, padding: '3px 9px',
      display: 'flex', alignItems: 'center', gap: 4,
    }}>
      <Flame size={8} color={isTrending ? '#FF6B00' : '#fff'} strokeWidth={3} />
      <span style={{
        fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: '0.55rem',
        letterSpacing: '0.14em', color: isTrending ? '#FF6B00' : '#fff',
        textTransform: 'uppercase',
      }}>{tag}</span>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────
   REWARD CARD  (memoised — only re-renders on prop change)
───────────────────────────────────────────────────────────── */
const RewardCard = memo(({ reward }) => {
  const [hov, setHov] = useState(false);
  const { icon: Icon, name, val, creds, tag } = reward;

  const onEnter = useCallback(() => setHov(true),  []);
  const onLeave = useCallback(() => setHov(false), []);

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ ...S.cardBase, ...(hov ? S.cardHov : S.cardRest) }}
    >
      {/* Glow blob — always in DOM, toggled via opacity (no DOM churn) */}
      <div style={{ ...S.glow, opacity: hov ? 1 : 0 }} />

      {tag && <Badge tag={tag} />}

      <div style={{ ...S.iconBoxBase, ...(hov ? S.iconBoxHov : S.iconBoxRest) }}>
        <Icon size={22} color="#FF6B00" strokeWidth={1.8} />
      </div>

      <div style={S.cardName}>{name}</div>
      <div style={S.cardVal}>{val}</div>
      <div style={hov ? S.dividerHov : S.dividerRest} />

      <div style={S.credRow}>
        <span style={S.credNum}>{creds}</span>
        <span style={S.credLabel}>CR</span>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────
   MARQUEE ROW  (memoised)
───────────────────────────────────────────────────────────── */
const MarqueeRow = memo(({ rewards, direction = 'left', speed = 35 }) => {
  const [paused, setPaused] = useState(false);

  const onEnter = useCallback(() => setPaused(true),  []);
  const onLeave = useCallback(() => setPaused(false), []);

  const animName   = direction === 'left' ? 'marqueeLeft' : 'marqueeRight';
  const innerStyle = {
    ...S.marqueeInner,
    animation: `${animName} ${speed}s linear infinite`,
    animationPlayState: paused ? 'paused' : 'running',
  };

  return (
    <div onMouseEnter={onEnter} onMouseLeave={onLeave} style={S.marqueeOuter} aria-hidden="true">
      <div style={innerStyle}>
        {rewards.map((r, i) => (
          <RewardCard key={`${r.name}-${i}`} reward={r} />
        ))}
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────
   STYLES STRING  (module-level constant — injected once)
───────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap&display=swap');

  @keyframes marqueeLeft  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
  @keyframes marqueeRight { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
  @keyframes pulseDot {
    0%,100% { box-shadow: 0 0 0 0 rgba(255,107,0,0.45); }
    50%      { box-shadow: 0 0 0 8px rgba(255,107,0,0);  }
  }
  @keyframes floatBadge {
    0%,100% { transform: translateY(0px)  rotate(-1deg); }
    50%      { transform: translateY(-10px) rotate(1deg); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0);    }
  }

  .rw-fade-in    { animation: fadeUp 0.6s ease forwards; }
  .rw-fade-in-d1 { animation: fadeUp 0.6s 0.1s ease both; opacity:0; }
  .rw-fade-in-d2 { animation: fadeUp 0.6s 0.2s ease both; opacity:0; }
  .rw-fade-in-d3 { animation: fadeUp 0.6s 0.3s ease both; opacity:0; }
  .rw-fade-in-d4 { animation: fadeUp 0.6s 0.4s ease both; opacity:0; }

  .rw-stat-card { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
  .rw-stat-card:hover {
    transform: translateY(-4px) !important;
    border-color: rgba(255,107,0,0.38) !important;
    box-shadow: 0 8px 28px rgba(255,107,0,0.09) !important;
  }

  .rw-cta-btn {
    display: inline-flex; align-items: center; gap: 10;
    background: #0A0A0A; color: #fff; border-radius: 12;
    padding: 15px 36px;
    font-family: 'Manrope',sans-serif; font-weight: 800; font-size: 0.95rem;
    text-decoration: none; letter-spacing: 0.02em;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .rw-cta-btn:hover {
    background: #FF6B00 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 32px rgba(255,107,0,0.32) !important;
  }

  .rw-section { padding: 100px 0 80px; }
  .rw-inner   { max-width: 1280px; margin: 0 auto; padding: 0 64px; }
  .rw-header  { display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; margin-bottom: 64px; }
  .rw-stats   { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-top: 56px; padding: 0 64px; max-width: 1280px; margin-left: auto; margin-right: auto; }
  .rw-cta-row { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 52px; flex-wrap: wrap; }
  .rw-hint    { font-family: 'Manrope',sans-serif; font-size: 12px; color: rgba(0,0,0,0.3); display: flex; align-items: center; gap: 6px; letter-spacing: 0.08em; }
  .rw-chip    { display: inline-flex; align-items: center; gap: 7; padding: 7px 14px; border-radius: 100px; background: #F5F3F0; border: 1px solid rgba(0,0,0,0.09); }

  @media (max-width: 1024px) {
    .rw-inner  { padding: 0 32px; }
    .rw-stats  { padding: 0 32px; grid-template-columns: repeat(2,1fr); }
    .rw-header { flex-direction: column; align-items: flex-start; gap: 24px; }
  }
  @media (max-width: 640px) {
    .rw-section { padding: 72px 0 64px; }
    .rw-inner   { padding: 0 20px; }
    .rw-stats   { padding: 0 20px; grid-template-columns: repeat(2,1fr); gap: 12px; }
    .rw-hint    { display: none; }
    .rw-cta-row { gap: 12px; }
  }
`;

/* ─────────────────────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────────────────────── */
const RewardsSection = () => (
  <>
    <style>{STYLES}</style>

    <section
      id="rewards-section"
      aria-labelledby="rewards-heading"
      className="rw-section"
      style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle dot grid */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Warm orange radial tint */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '80%', height: 500, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(255,107,0,0.055) 0%, transparent 65%)',
      }} />

      {/* ─────── HEADER ─────── */}
      <div className="rw-inner">
        <div className="rw-header">

          <div style={{ flex: '0 0 auto' }}>
            <div className="rw-fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6B00', animation: 'pulseDot 2s ease infinite' }} />
              <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: '0.68rem', letterSpacing: '0.22em', color: '#FF6B00', textTransform: 'uppercase' }}>
                Rewards Catalog
              </span>
            </div>

            <h2
              id="rewards-heading"
              className="rw-fade-in-d1"
              style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(3rem,6vw,5.5rem)', lineHeight: 0.93, letterSpacing: '0.03em', color: '#0A0A0A', textTransform: 'uppercase', maxWidth: 640 }}
            >
              REDEEM FOR<br />
              <span style={{ color: '#FF6B00' }}>WHAT YOU</span><br />
              ACTUALLY WANT
            </h2>
          </div>

          <div className="rw-fade-in-d2" style={{ flex: '0 0 auto', maxWidth: 340, position: 'relative' }}>
            <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 15, lineHeight: 1.8, color: 'rgba(0,0,0,0.48)', marginBottom: 28 }}>
              Over <strong style={{ color: '#0A0A0A' }}>100 reward options</strong> across cash,
              crypto, gaming and streaming. No minimum payout. Your Creds never expire.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TRUST_CHIPS.map(({ icon: Icon, label }) => (
                <div key={label} className="rw-chip">
                  <Icon size={12} color="#FF6B00" strokeWidth={2.5} />
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 11, color: 'rgba(0,0,0,0.52)', letterSpacing: '0.04em' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Floating badge */}
            <div aria-hidden="true" style={{
              position: 'absolute', bottom: -20, right: -20,
              background: '#FF6B00', borderRadius: 14, padding: '12px 18px',
              boxShadow: '0 12px 40px rgba(255,107,0,0.32)',
              animation: 'floatBadge 3.5s ease-in-out infinite',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Banknote size={20} color="#fff" strokeWidth={1.8} />
              <div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.2rem', color: '#fff', lineHeight: 1 }}>$128.50</div>
                <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: '0.6rem', color: 'rgba(255,255,255,0.82)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Cashed Out</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─────── MARQUEE ROWS ─────── */}
      <div className="rw-fade-in-d3" style={{ position: 'relative' }}>
        <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, zIndex: 2, background: 'linear-gradient(90deg,#FFFFFF 0%,transparent 100%)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, zIndex: 2, background: 'linear-gradient(-90deg,#FFFFFF 0%,transparent 100%)', pointerEvents: 'none' }} />

        <div style={{ marginBottom: 16, paddingLeft: 32 }}>
          <MarqueeRow rewards={ROW_ONE} direction="left"  speed={38} />
        </div>
        <div style={{ paddingLeft: 32 }}>
          <MarqueeRow rewards={ROW_TWO} direction="right" speed={44} />
        </div>
      </div>

      {/* ─────── STATS ROW ─────── */}
      <div className="rw-stats rw-fade-in-d4">
        {STATS.map(({ val, label, icon: Icon }) => (
          <div key={label} className="rw-stat-card" style={{ background: '#F9F7F5', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '22px 20px', textAlign: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Icon size={16} color="#FF6B00" strokeWidth={2.5} />
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.9rem', color: '#FF6B00', lineHeight: 1, letterSpacing: '0.02em' }}>{val}</div>
            <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 11, color: 'rgba(0,0,0,0.38)', marginTop: 5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ─────── CTA ───────
      <div className="rw-cta-row rw-fade-in-d4">
        <a href="#tasks-section" className="rw-cta-btn" aria-label="Start earning Creds now">
          Start Earning Free
          <ArrowRight size={17} strokeWidth={2.5} />
        </a>

        <div className="rw-hint">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulseDot 2s infinite' }} />
          Hover any card to pause · 100+ more rewards inside
        </div>
      </div> */}

    </section>
  </>
);

export default RewardsSection;