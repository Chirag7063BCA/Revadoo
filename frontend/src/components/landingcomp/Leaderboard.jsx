import React from 'react'

const Leaderboard = () => {
      const players = [
    { rank:1, name:'Jordan K.', avatar:'#FF6B00', creds:'128,540', badge:'👑', streak:62 },
    { rank:2, name:'Maya R.',   avatar:'#3B82F6', creds:'112,200', badge:'🥈', streak:45 },
    { rank:3, name:'Ethan W.',  avatar:'#10B981', creds:'98,750',  badge:'🥉', streak:38 },
    { rank:4, name:'Sofia L.',  avatar:'#8B5CF6', creds:'87,320',  badge:'⭐', streak:29 },
    { rank:5, name:'Marcus T.', avatar:'#F59E0B', creds:'75,900',  badge:'⭐', streak:21 },
  ]
  const stats = [
    { num:'$2.3M+', label:'Total Paid Out', sub:'to real users' },
    { num:'2.4M+',  label:'Active Members', sub:'globally' },
    { num:'127K+',  label:'Tasks Live',     sub:'right now' },
    { num:'4.9★',   label:'App Rating',    sub:'50K+ reviews' },
  ]
  return (
    <>
      {/* Responsive breakpoint styles — only layout, no design changes */}
      <style>{`
        #leaderboard-inner {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
          align-items: start;
        }

        /* Tablet & Mobile: stack columns vertically */
        @media (max-width: 900px) {
          #leaderboard-inner {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        /* Mobile: tighten section padding */
        @media (max-width: 600px) {
          #leaderboard-section {
            padding: 72px 20px !important;
          }
          #leaderboard-inner {
            gap: 32px;
          }
        }

        /* ── NEW: additional responsive fixes ── */

        /* Player row: prevent gap from squishing content on very small screens */
        @media (max-width: 400px) {
          .lb-player-row {
            gap: 12px !important;
            padding: 14px 16px !important;
          }
          /* Hide rank number on very small screens to save space */
          .lb-rank { display: none !important; }
        }

        /* Stats grid: stay 2-col on mobile (they're compact enough) */
        /* but tighten padding so cards don't feel cramped */
        @media (max-width: 480px) {
          .lb-stat-card { padding: 20px 14px !important; }
          .lb-stat-num  { font-size: 1.8rem !important; }
        }

        /* Task category bars panel: tighten on mobile */
        @media (max-width: 480px) {
          .lb-categories { padding: 20px 16px !important; }
        }

        /* Section heading: ensure it wraps cleanly on small screens */
        @media (max-width: 480px) {
          .lb-heading { font-size: clamp(2.2rem, 8vw, 3.5rem) !important; }
        }
      `}</style>

      <section
        id="leaderboard"
        style={{ padding:'120px 48px', background:'#fff' }}
      >
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:72 }}>
            <div className="sec-label" style={{ justifyContent:'center' }}>COMMUNITY & STATS</div>
            {/* className added so mobile CSS can shrink font if needed */}
            <h2 className="lb-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.8rem,5vw,4.5rem)',
              letterSpacing:'0.04em', lineHeight:1, marginBottom:20 }}>
              WHO'S ON TOP THIS<br /><span style={{ color:'#FF6B00' }}>WEEK?</span>
            </h2>
          </div>

          {/* Two-column grid — collapses to 1 col on tablet/mobile via CSS above */}
          <div id="leaderboard-inner">

            {/* ── Left: Leaderboard list ── */}
            <div className="reveal">
              {players.map((p, i) => (
                // className added so very-small-screen CSS can target padding/gap
                <div key={i} className="lb-player-row" style={{
                  display:'flex', alignItems:'center', gap:20,
                  padding:'18px 24px', borderRadius:18, marginBottom:12,
                  background: i===0 ? 'linear-gradient(135deg,#FFF5EE,#FFE8CC)' : '#FAFAFA',
                  border: i===0 ? '1.5px solid rgba(255,107,0,0.25)' : '1px solid rgba(0,0,0,0.06)',
                  transition:'transform 0.2s', cursor:'default' }}
                  onMouseEnter={e => e.currentTarget.style.transform='translateX(6px)'}
                  onMouseLeave={e => e.currentTarget.style.transform='translateX(0)'}>
                  {/* className added so rank can be hidden on tiny screens */}
                  <div className="lb-rank" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem',
                    color: i===0?'#FF6B00':'rgba(0,0,0,0.2)', width:36, textAlign:'center', flexShrink:0 }}>{p.rank}</div>
                  <div style={{ width:42, height:42, borderRadius:'50%', background:p.avatar, flexShrink:0,
                    color:'#fff', fontWeight:700, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {p.name[0]}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:'0.95rem', color:'#0A0A0A', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize:'0.75rem', color:'#999' }}>🔥 {p.streak} day streak</div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.15rem', color:'#FF6B00' }}>{p.creds}</div>
                    <div style={{ fontSize:'0.7rem', color:'#999', fontFamily:"'JetBrains Mono',monospace" }}>CREDS</div>
                  </div>
                  <div style={{ fontSize:20, flexShrink:0 }}>{p.badge}</div>
                </div>
              ))}
            </div>

            {/* ── Right: Stats grid ── */}
            <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              {stats.map((s,i) => (
                // className added so mobile CSS can tighten padding
                <div key={i} className="lb-stat-card" style={{ background:'#FAFAFA', borderRadius:22, padding:'32px 24px',
                  border:'1px solid rgba(0,0,0,0.06)', textAlign:'center',
                  transition:'transform 0.3s, box-shadow 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 12px 36px rgba(255,107,0,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
                  {/* className added so mobile CSS can shrink the big number */}
                  <div className="lb-stat-num" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.4rem', color:'#FF6B00', lineHeight:1, marginBottom:8 }}>{s.num}</div>
                  <div style={{ fontWeight:700, fontSize:'0.85rem', color:'#0A0A0A', marginBottom:4 }}>{s.label}</div>
                  <div style={{ fontSize:'0.75rem', color:'#999' }}>{s.sub}</div>
                </div>
              ))}

              {/* className added so mobile CSS can tighten padding */}
              <div className="lb-categories" style={{ gridColumn:'span 2', background:'#FAFAFA', borderRadius:22, padding:'28px 24px',
                border:'1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontWeight:700, fontSize:'0.85rem', color:'#0A0A0A', marginBottom:20 }}>Top Task Categories</div>
                {[['Surveys',72,'#FF6B00'],['Mini Games',58,'#3B82F6'],['Creative',41,'#10B981'],['Watch & Earn',88,'#F59E0B']].map(([lbl,pct,clr]) => (
                  <div key={lbl} style={{ marginBottom:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:'0.8rem', color:'#555' }}>{lbl}</span>
                      <span style={{ fontSize:'0.8rem', fontWeight:700, color:clr }}>{pct}%</span>
                    </div>
                    <div style={{ background:'#e8e8e8', borderRadius:99, height:5, overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:99, background:clr, width:`${pct}%`,
                        transition:'width 1.4s cubic-bezier(0.16,1,0.3,1)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default Leaderboard