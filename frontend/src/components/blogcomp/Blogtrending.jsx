import React, { useState } from 'react';

const ORANGE = '#FF6B00';
const DARK   = '#0A0A0A';

const MEMBER_QUOTES = [
  { name: 'Priya S.',   role: 'Student, Delhi',            earned: '$120/mo', quote: "I cleared $120 last month just doing surveys and mini games during my commute. Genuinely the most legit platform I've tried.", avatar: '#8B5CF6' },
  { name: 'Carlos M.',  role: 'Freelancer, Miami',          earned: '$340/mo', quote: "The payout speed is insane — I requested PayPal cash at 11pm and it was in my account before I woke up.", avatar: '#3B82F6' },
  { name: 'Amara O.',   role: 'Stay-at-Home Mom',           earned: '$95/mo',  quote: "I squeeze in tasks between school runs and manage $80–$100 monthly. Consistent, real, honest income.", avatar: '#10B981' },
  { name: 'Jake T.',    role: 'College Student, Austin',    earned: '$55/mo',  quote: "The mini games are actually fun AND they pay. The leaderboard competition keeps me coming back every day.", avatar: '#F59E0B' },
  { name: 'Fatima A.',  role: 'Remote Worker, Lagos',       earned: '$200/mo', quote: "Revadoo pays out in Bitcoin which is perfect for me. Clear, honest, no nonsense. Zero surprises.", avatar: '#EF4444' },
  { name: 'Lena B.',    role: 'Graphic Designer, Berlin',   earned: '$280/mo', quote: "Creative challenges are where I shine. Finally a platform that values design skills and pays accordingly.", avatar: ORANGE },
];

const TAGS = [
  { label: 'Surveys',       size: 'lg', count: '2.1K articles' },
  { label: 'Mini Games',    size: 'md', count: '890 articles'  },
  { label: 'Gift Cards',    size: 'lg', count: '1.4K articles' },
  { label: 'Streaks',       size: 'sm', count: '340 articles'  },
  { label: 'Bitcoin',       size: 'md', count: '610 articles'  },
  { label: 'PayPal',        size: 'sm', count: '280 articles'  },
  { label: 'Leaderboard',   size: 'sm', count: '190 articles'  },
  { label: 'Daily Tasks',   size: 'lg', count: '1.8K articles' },
  { label: 'Referrals',     size: 'md', count: '760 articles'  },
  { label: 'Crypto',        size: 'sm', count: '410 articles'  },
  { label: 'Amazon',        size: 'md', count: '520 articles'  },
  { label: 'Level Up',      size: 'sm', count: '230 articles'  },
];

const SIZE_MAP = {
  lg: { fontSize: 'clamp(1rem,1.5vw,1.15rem)', padding: '10px 22px' },
  md: { fontSize: 'clamp(0.85rem,1.2vw,0.95rem)', padding: '8px 18px' },
  sm: { fontSize: 'clamp(0.75rem,1vw,0.85rem)', padding: '7px 14px'  },
};

const EARN_STATS = [
  { label: 'Avg. monthly earnings',  val: '$74',  sub: 'for active members'   },
  { label: 'Top earner this month',  val: '$910', sub: 'verified payout'       },
  { label: 'Fastest first payout',   val: '22min',sub: 'from sign-up'         },
  { label: 'Tasks completed today',  val: '47K+', sub: 'across all members'   },
];

export default function BlogTrending({ posts, allCats, onRead }) {
  const [hovTag, setHovTag] = useState(null);
  const topPosts = posts.slice(0, 4);

  return (
    <>
      {/* ══════════════════════════════════════════
          SECTION 1 — Topics & Trending Posts
      ══════════════════════════════════════════ */}
      <section
        aria-labelledby="trending-heading"
        style={{ background: '#fff', padding: 'clamp(60px,7vw,100px) clamp(16px,4vw,64px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      >
        <style>{`
          .trending-grid { display:grid; grid-template-columns:1.1fr 0.9fr; gap:80px; align-items:start; }
          .tag-cloud      { display:flex; flex-wrap:wrap; gap:10px; }
          .trending-list  { display:flex; flex-direction:column; gap:16px; }
          @media(max-width:1024px){ .trending-grid{ grid-template-columns:1fr; gap:48px; } }
          @media(max-width:640px) { .trending-grid{ gap:36px; } }
        `}</style>

        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="trending-grid">

            {/* ── Left: Tag cloud ── */}
            <div>
              <div className="sec-label">Explore Topics</div>
              <h2 id="trending-heading" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.4rem,4.5vw,3.8rem)', lineHeight: 0.95, letterSpacing: '0.04em', color: DARK, textTransform: 'uppercase', marginBottom: 32 }}>
                FIND YOUR<br /><span style={{ color: ORANGE }}>NEXT READ</span>
              </h2>

              <div className="tag-cloud" role="list" aria-label="Browse topics">
                {TAGS.map((tag, i) => {
                  const isHov = hovTag === i;
                  const s = SIZE_MAP[tag.size];
                  return (
                    <button
                      key={i}
                      role="listitem"
                      onMouseEnter={() => setHovTag(i)}
                      onMouseLeave={() => setHovTag(null)}
                      title={tag.count}
                      style={{
                        ...s,
                        fontFamily: "'Manrope',sans-serif", fontWeight: 700,
                        border: '1.5px solid',
                        borderColor: isHov ? ORANGE : 'rgba(0,0,0,0.12)',
                        background:  isHov ? '#FFF5EE' : '#fff',
                        color:       isHov ? ORANGE : '#555',
                        borderRadius: 100, cursor: 'pointer',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>

              {/* Earn stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 44 }}>
                {EARN_STATS.map(({ label, val, sub }) => (
                  <div
                    key={label}
                    className="reveal"
                    style={{ background: '#F9F7F5', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', color: ORANGE, lineHeight: 1, marginBottom: 4 }}>{val}</div>
                    <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 12, color: DARK, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: '#aaa' }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Top posts list ── */}
            <div>
              <div className="sec-label" style={{ marginBottom: 28 }}>Trending Now</div>
              <div className="trending-list" role="list">
                {topPosts.map((post, i) => (
                  <div
                    key={post.id}
                    role="listitem"
                    className="reveal"
                    onClick={() => onRead(post)}
                    style={{
                      display: 'flex', gap: 16, alignItems: 'flex-start',
                      padding: '16px 18px', borderRadius: 14, cursor: 'pointer',
                      border: '1px solid rgba(0,0,0,0.07)', background: '#F9F7F5',
                      transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)'; e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Rank */}
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.2rem', color: i === 0 ? ORANGE : 'rgba(0,0,0,0.15)', lineHeight: 1, flexShrink: 0, width: 40, textAlign: 'center', letterSpacing: '-0.02em' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 10, color: ORANGE, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
                        {post.category}
                      </span>
                      <h4 style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 13, lineHeight: 1.45, color: DARK, marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {post.title}
                      </h4>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: '#aaa', fontWeight: 600 }}>{post.author}</span>
                        <span style={{ fontSize: 11, color: '#ccc' }}>·</span>
                        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: '#aaa' }}>{post.readTime}</span>
                      </div>
                    </div>
                    {/* Thumbnail */}
                    <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={post.img} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — Member Spotlights
      ══════════════════════════════════════════ */}
      <section
        aria-labelledby="spotlights-heading"
        style={{ background: '#F9F7F5', padding: 'clamp(60px,7vw,100px) clamp(16px,4vw,64px)' }}
      >
        <style>{`
          .spotlight-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-top:48px; }
          @media(max-width:900px)  { .spotlight-grid{ grid-template-columns:repeat(2,1fr); } }
          @media(max-width:640px)  { .spotlight-grid{ grid-template-columns:1fr; } }
        `}</style>

        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
            <div className="sec-label" style={{ justifyContent: 'center' }}>Real Earners, Real Results</div>
            <h2 id="spotlights-heading" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.4rem,4.5vw,3.8rem)', lineHeight: 0.95, letterSpacing: '0.04em', color: DARK, textTransform: 'uppercase', marginBottom: 16 }}>
              DON&apos;T TAKE OUR<br /><span style={{ color: ORANGE }}>WORD FOR IT</span>
            </h2>
            <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 15, color: '#888', lineHeight: 1.75 }}>
              These are real members who followed the strategies in our articles. Their words, their results.
            </p>
          </div>

          <div className="spotlight-grid">
            {MEMBER_QUOTES.map((m, i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  background: '#fff', borderRadius: 18, padding: 'clamp(20px,2.5vw,28px)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  position: 'relative', overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
              >
                {/* Decorative quote mark */}
                <div aria-hidden="true" style={{ position: 'absolute', top: 16, right: 20, fontFamily: 'Georgia,serif', fontSize: '6rem', color: 'rgba(255,107,0,0.06)', lineHeight: 1 }}>"</div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 2, marginBottom: 14 }} aria-label="5 star rating">
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: ORANGE, fontSize: 13 }}>★</span>)}
                </div>

                <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: 1.75, color: '#555', marginBottom: 22, fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
                  &ldquo;{m.quote}&rdquo;
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: m.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: '#fff', flexShrink: 0 }}>
                      {m.name[0]}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 13, color: DARK }}>{m.name}</div>
                      <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: '#aaa' }}>{m.role}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.2rem', color: ORANGE, lineHeight: 1 }}>{m.earned}</div>
                    <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 9, color: '#ccc', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>EARNED</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}