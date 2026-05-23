import React from 'react'

const TasksSection = () => {
  const tasks = [
    { icon:'📋', label:'Surveys', creds:'50–400', time:'3–15 min', tag:'Most Popular', color:'#3B82F6' },
    { icon:'🎮', label:'Mini Games', creds:'100–600', time:'2–10 min', tag:'High Payout', color:'#10B981' },
    { icon:'🎨', label:'Creative Tasks', creds:'200–800', time:'10–30 min', tag:'Skill Based', color:'#8B5CF6' },
    { icon:'📺', label:'Watch & Earn', creds:'20–150', time:'1–5 min', tag:'Easy', color:'#F59E0B' },
    { icon:'🔍', label:'Search Tasks', creds:'30–200', time:'1–8 min', tag:'Quick', color:'#EF4444' },
    { icon:'🤝', label:'Referrals', creds:'500–2000', time:'One-time', tag:'Best Value', color:'#FF6B00' },
  ]

  return (
    <>
      {/* ── Responsive styles only — zero design changes ── */}
      <style>{`
        #tasks-section-inner {
          padding: 120px 48px;
        }

        /* Top two-column: copy left, task grid right */
        #tasks-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          margin-bottom: 80px;
        }

        /* Stats row */
        #tasks-stats {
          display: flex;
          gap: 32px;
          margin-bottom: 40px;
        }

        /* Task cards grid — always 2 cols */
        #tasks-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* ── Tablet (≤1024px): stack top grid to single column ── */
        @media (max-width: 1024px) {
          #tasks-top-grid {
            grid-template-columns: 1fr;
            gap: 48px;
            margin-bottom: 0;
          }
        }

        /* ── Mobile (≤640px): tighten padding & stats ── */
        @media (max-width: 640px) {
          #tasks-section-inner {
            padding: 72px 20px !important;
          }
          #tasks-top-grid {
            gap: 36px;
          }
          #tasks-stats {
            gap: 20px;
          }
          /* CTA button full width on mobile */
          #tasks-cta {
            width: 100%;
            justify-content: center;
          }
        }

        /* ── Very small (≤380px): task cards go single column ── */
        @media (max-width: 380px) {
          #tasks-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section id="tasks-section" style={{ background:'#fff' }}>
        <div id="tasks-section-inner">
          <div style={{ maxWidth:1200, margin:'0 auto' }}>

            <div id="tasks-top-grid">

              {/* ── Left: copy block ── */}
              <div className="reveal">
                <div className="sec-label">EARN YOUR WAY</div>
                <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.5rem,4.5vw,4rem)',
                  letterSpacing:'0.04em', lineHeight:1.05, marginBottom:24 }}>
                  50+ TASK TYPES.<br /><span style={{ color:'#FF6B00' }}>SOMETHING FOR</span><br />EVERYONE.
                </h2>
                <p style={{ fontSize:'1rem', color:'#555', lineHeight:1.75, marginBottom:32 }}>
                  Whether you have 2 minutes or 2 hours, there's always a task matching your mood, skill level, and earning goal. New tasks are added every single day.
                </p>

                {/* Stats row */}
                <div id="tasks-stats">
                  {[['$2.3M','Paid Out'],['50+','Task Types'],['2.4M','Members']].map(([num, lbl]) => (
                    <div key={lbl}>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.2rem', color:'#FF6B00', lineHeight:1 }}>{num}</div>
                      <div style={{ fontSize:'0.8rem', color:'#999', letterSpacing:'0.06em', fontFamily:"'JetBrains Mono',monospace" }}>{lbl}</div>
                    </div>
                  ))}
                </div>

                <a
                  id="tasks-cta"
                  href="#rewards-section"
                  className="btn-primary"
                  style={{ fontSize:'0.95rem', padding:'14px 32px' }}
                >
                  Browse All Tasks →
                </a>
              </div>

              {/* ── Right: task cards grid ── */}
              <div className="reveal">
                <div id="tasks-cards-grid">
                  {tasks.map((t, i) => (
                    <div
                      key={i}
                      style={{ background:'#FAFAFA', borderRadius:18, padding:'20px',
                        border:'1px solid rgba(0,0,0,0.06)', position:'relative', overflow:'hidden',
                        transition:'transform 0.25s, box-shadow 0.25s', cursor:'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 36px ${t.color}22` }}
                      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                    >
                      <div style={{ position:'absolute', top:10, right:10, background: t.color+'18',
                        borderRadius:99, padding:'2px 8px', fontSize:'0.62rem',
                        fontFamily:"'JetBrains Mono',monospace", color:t.color, letterSpacing:'0.06em' }}>{t.tag}</div>
                      <div style={{ fontSize:26, marginBottom:10 }}>{t.icon}</div>
                      <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#0A0A0A', marginBottom:4 }}>{t.label}</div>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.1rem', color:'#FF6B00' }}>{t.creds} CR</div>
                      <div style={{ fontSize:'0.72rem', color:'#999', marginTop:2 }}>⏱ {t.time}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default TasksSection