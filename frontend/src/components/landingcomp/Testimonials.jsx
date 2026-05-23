import React from 'react'

const Testimonials = () => {
  const testimonials = [
    { name:'Priya S.', role:'Student, Delhi', avatar:'#8B5CF6', text:"I cleared $120 last month just doing surveys and mini games during my commute. Revadoo is genuinely the most legit platform I've tried.", stars:5, earned:'$120/mo' },
    { name:'Carlos M.', role:'Freelancer, Miami', avatar:'#3B82F6', text:"The payout speed is insane — I requested PayPal cash at 11pm and it was in my account before I woke up. No cap.", stars:5, earned:'$340/mo' },
    { name:'Amara O.', role:'Stay-at-Home Mom', avatar:'#10B981', text:"I squeeze in tasks between school runs and manage $80–$100 monthly. It's not life-changing money but it's real, consistent income.", stars:5, earned:'$95/mo' },
    { name:'Jake T.', role:'College Student, Austin', avatar:'#F59E0B', text:"The mini games are actually fun AND they pay well. The leaderboard competition keeps me coming back every day for that streak bonus.", stars:5, earned:'$55/mo' },
    { name:'Fatima A.', role:'Remote Worker, Lagos', avatar:'#EF4444', text:"Revadoo pays out in Bitcoin which is perfect for me. Clear, honest, no nonsense. Referred 8 friends and earned 4,000 bonus Creds.", stars:5, earned:'$200/mo' },
    { name:'Lena B.', role:'Graphic Designer, Berlin', avatar:'#FF6B00', text:"Creative challenges are where I shine — I earn the most doing logo quick-tasks. Finally a platform that values design skills.", stars:5, earned:'$280/mo' },
  ]

  return (
    <>
      {/* ── Responsive styles only — zero design changes ── */}
      <style>{`
        /* Desktop: original padding */
        #testimonials-section {
          padding: 120px 48px;
        }

        /* Cards grid: auto-fit keeps original behaviour on desktop */
        #testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        /* Tablet (≤900px): 2 columns, minmax floor drops so cards don't overflow */
        @media (max-width: 900px) {
          #testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Mobile (≤640px): single column, tighter section padding */
        @media (max-width: 640px) {
          #testimonials-section {
            padding: 72px 20px !important;
          }
          #testimonials-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section
        id="testimonials-section"
        style={{ background:'#FAFAFA', position:'relative', overflow:'hidden' }}
      >
        {/* Decorative glow — unchanged */}
        <div style={{ position:'absolute', bottom:-100, left:-100, width:400, height:400, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(255,107,0,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>

          {/* Section heading — unchanged */}
          <div style={{ textAlign:'center', marginBottom:72 }}>
            <div className="sec-label" style={{ justifyContent:'center' }}>REAL EARNERS, REAL RESULTS</div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.8rem,5vw,4.5rem)',
              letterSpacing:'0.04em', lineHeight:1, marginBottom:20 }}>
              DON'T TAKE OUR<br /><span style={{ color:'#FF6B00' }}>WORD FOR IT</span>
            </h2>
          </div>

          {/* Cards grid */}
          <div id="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="reveal" style={{
                background:'#fff', borderRadius:24, padding:'32px 28px',
                border:'1px solid rgba(0,0,0,0.06)',
                boxShadow:'0 4px 20px rgba(0,0,0,0.04)',
                position:'relative', overflow:'hidden',
                transition:'transform 0.3s, box-shadow 0.3s',
                transitionDelay:`${i*0.07}s` }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,0.09)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.04)' }}>
                <div style={{ position:'absolute', top:20, right:24, fontFamily:'Georgia,serif',
                  fontSize:'5rem', color:'rgba(255,107,0,0.07)', lineHeight:1 }}>"</div>
                <div style={{ display:'flex', gap:3, marginBottom:16 }}>
                  {Array(t.stars).fill('★').map((s,j) => <span key={j} style={{ color:'#FF6B00', fontSize:14 }}>{s}</span>)}
                </div>
                <p style={{ fontSize:'0.92rem', color:'#444', lineHeight:1.75, marginBottom:24, position:'relative', zIndex:1 }}>
                  "{t.text}"
                </p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:t.avatar,
                      color:'#fff', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'0.88rem', color:'#0A0A0A' }}>{t.name}</div>
                      <div style={{ fontSize:'0.75rem', color:'#999' }}>{t.role}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.1rem', color:'#FF6B00' }}>{t.earned}</div>
                    <div style={{ fontSize:'0.65rem', color:'#bbb', fontFamily:"'JetBrains Mono',monospace" }}>EARNED</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}

export default Testimonials;
