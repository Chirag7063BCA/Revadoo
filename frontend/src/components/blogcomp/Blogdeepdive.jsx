import React from 'react';
import { openPost, useBlogData } from './Blogstore';

const ORANGE = '#FF6B00';
const DARK   = '#0A0A0A';

const BENEFITS = [
  { icon:'🧠', title:'INSIDER STRATEGY', desc:"We don't just repeat generic tips. Every piece is based on actual testing, streak data, and real redemption records from our top earners. If it works, we write it. If it doesn't, we bury it.", stat:'9 min', statLabel:'Avg. reading time' },
  { icon:'⚡', title:'ALWAYS CURRENT',   desc:"Task payouts, bonus windows, and reward rates change weekly. Our team monitors every update and pushes fresh guides so you're never working off stale info.", stat:'3×/week', statLabel:'Publishing frequency' },
  { icon:'🏆', title:'COMMUNITY PROVEN', desc:"Every strategy we publish has been validated by at least 100 community members before it goes live. You're reading what actually works for real people — not theory.", stat:'128K+', statLabel:'Readers trust us' },
];

const CONTENT_CALENDAR = [
  { week:'This Week', tag:'Strategy',  title:'The New Multiplier Stack: How to Combine Streaks + Surveys + Referrals', status:'live' },
  { week:'Next Week', tag:'Redeem',    title:'Spring Bonus Window: Which Rewards Are Worth 2× Until April 15',         status:'soon' },
  { week:'Coming Up', tag:'Deep Dive', title:"We Interviewed 50 Top Earners — Here Are Their Exact Daily Routines",    status:'soon' },
  { week:'Coming Up', tag:'Mobile',    title:"App Version 4.2 Preview: Everything That's Changing for Earners",        status:'soon' },
];

export default function BlogDeepDive() {
  const { posts } = useBlogData();

  /* Skip featured (first flagged or first) to mirror BlogGrid logic */
  const featured  = posts.find(p => p.featured) || posts[0];
  const rest       = posts.filter(p => p.id !== featured?.id);
  const editorPicks = rest.slice(0, 4);

  return (
    <>
      {/* ══ Section 1 — Why We Write ══ */}
      <section
        aria-labelledby="why-heading"
        style={{ background:'#fff', padding:'clamp(60px,7vw,100px) clamp(16px,4vw,64px)', overflowX:'clip' }}
      >
        <style>{`
          .benefit-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
          .why-header   { display:grid; grid-template-columns:1fr 1fr; gap:clamp(24px,4vw,80px); align-items:end; margin-bottom:56px; }
          .ep-grid      { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:40px; }
          .ep-card      { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:clamp(18px,2.5vw,28px); cursor:pointer; display:flex; gap:clamp(12px,2vw,20px); align-items:flex-start; transition:background 0.2s,border-color 0.2s,transform 0.2s; }
          .cal-grid     { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; margin-top:32px; }
          .eds-header   { display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:24px; margin-bottom:48px; }
          .cal-header   { display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:24px; margin-bottom:8px; }
          @media(max-width:1024px){ .benefit-grid{ grid-template-columns:repeat(2,1fr); } }
          @media(max-width:900px){
            .benefit-grid{ grid-template-columns:1fr; gap:20px; }
            .why-header  { grid-template-columns:1fr; gap:16px; margin-bottom:36px; }
            .ep-grid     { grid-template-columns:1fr; }
          }
          @media(max-width:640px){
            .benefit-grid{ gap:16px; }
            .cal-grid    { grid-template-columns:1fr; }
          }
        `}</style>

        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div className="why-header">
            <div>
              <div className="sec-label">Why Read With Us</div>
              <h2 id="why-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.2rem,5vw,4.2rem)', lineHeight:0.95, letterSpacing:'0.04em', color:DARK, textTransform:'uppercase', wordBreak:'break-word' }}>
                WRITTEN FOR<br /><span style={{ color:ORANGE }}>EARNERS,</span><br />BY EARNERS.
              </h2>
            </div>
            <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:'clamp(14px,1.1vw,16px)', lineHeight:1.8, color:'#666', wordBreak:'break-word' }}>
              This isn't a generic content blog. Every article on the Revadoo Blog is authored by active members who have tested the strategies themselves — then verified by our editorial team before publishing. No fluff. No filler.
            </p>
          </div>

          <div className="benefit-grid">
            {BENEFITS.map((b, i) => (
              <div
                key={i} className="reveal"
                style={{ background:'#F9F7F5', borderRadius:20, padding:'clamp(20px,3vw,36px)', border:'1px solid rgba(0,0,0,0.06)', position:'relative', overflow:'hidden', transition:'transform 0.3s, box-shadow 0.3s', minWidth:0 }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(255,107,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
              >
                <div aria-hidden="true" style={{ position:'absolute', top:16, right:20, fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.5rem,4vw,4rem)', color:'rgba(255,107,0,0.05)', lineHeight:1, userSelect:'none' }}>0{i+1}</div>
                <div style={{ width:56, height:56, borderRadius:16, background:'#FFF5EE', border:'1px solid rgba(255,107,0,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, marginBottom:20 }}>{b.icon}</div>
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1.2rem,2vw,1.5rem)', letterSpacing:'0.04em', color:DARK, marginBottom:12, textTransform:'uppercase', wordBreak:'break-word' }}>{b.title}</h3>
                <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:14, lineHeight:1.75, color:'#666', marginBottom:24, wordBreak:'break-word' }}>{b.desc}</p>
                <div style={{ display:'flex', alignItems:'baseline', gap:8, paddingTop:20, borderTop:'1px solid rgba(0,0,0,0.06)' }}>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1.4rem,2vw,1.8rem)', color:ORANGE, lineHeight:1 }}>{b.stat}</span>
                  <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:12, color:'#999', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>{b.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Section 2 — Editor's Picks ══ */}
      <section
        aria-labelledby="editors-heading"
        style={{ background:DARK, padding:'clamp(60px,7vw,100px) clamp(16px,4vw,64px)', position:'relative', overflow:'hidden' }}
      >
        <div aria-hidden="true" style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(255,107,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,0,0.04) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
        <div aria-hidden="true" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'70%', height:'60%', background:'radial-gradient(ellipse,rgba(255,107,0,0.1) 0%,transparent 65%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div className="eds-header">
            <div>
              <div className="sec-label" style={{ color:ORANGE }}>Editor&apos;s Picks</div>
              <h2 id="editors-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.2rem,5vw,4.2rem)', lineHeight:0.95, letterSpacing:'0.04em', color:'#fff', textTransform:'uppercase', wordBreak:'break-word' }}>
                THE ARTICLES<br />WORTH <span style={{ color:ORANGE }}>BOOKMARKING</span>
              </h2>
            </div>
            <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:14, lineHeight:1.8, color:'rgba(255,255,255,0.45)', maxWidth:320, wordBreak:'break-word' }}>
              Our editorial team hand-picks the highest-impact guides each month.
            </p>
          </div>

          <div className="ep-grid">
            {editorPicks.map((post, i) => (
              <div
                key={post.id} className="reveal ep-card"
                onClick={() => openPost(post)}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,107,0,0.08)'; e.currentTarget.style.borderColor='rgba(255,107,0,0.3)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.transform='translateY(0)'; }}
              >
                <div aria-hidden="true" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2rem,3.5vw,3.5rem)', color:ORANGE, lineHeight:1, flexShrink:0, opacity:0.6, letterSpacing:'-0.02em' }}>
                  {String(i+1).padStart(2,'0')}
                </div>
                <div style={{ minWidth:0, flex:1 }}>
                  <span style={{ fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:10, color:ORANGE, letterSpacing:'0.14em', textTransform:'uppercase', display:'block', marginBottom:7, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{post.category}</span>
                  <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1rem,1.5vw,1.15rem)', letterSpacing:'0.03em', color:'#fff', marginBottom:8, lineHeight:1.1, textTransform:'uppercase', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', wordBreak:'break-word' }}>{post.title}</h3>
                  <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:13, lineHeight:1.65, color:'rgba(255,255,255,0.4)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', wordBreak:'break-word' }}>{post.excerpt}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:14, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>{post.author}</span>
                    <span style={{ width:3, height:3, borderRadius:'50%', background:'rgba(255,255,255,0.2)', flexShrink:0 }} />
                    <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:12, color:'rgba(255,255,255,0.3)' }}>{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Section 3 — Content Calendar ══ */}
      <section
        aria-labelledby="calendar-heading"
        style={{ background:'#F9F7F5', padding:'clamp(60px,7vw,100px) clamp(16px,4vw,64px)', overflowX:'clip' }}
      >
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div className="cal-header">
            <div>
              <div className="sec-label">What&apos;s Next</div>
              <h2 id="calendar-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2rem,4vw,3.5rem)', lineHeight:0.95, letterSpacing:'0.04em', color:DARK, textTransform:'uppercase', wordBreak:'break-word' }}>
                UPCOMING<br /><span style={{ color:ORANGE }}>CONTENT</span>
              </h2>
            </div>
            <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:14, color:'#888', maxWidth:320, lineHeight:1.7 }}>Subscribe to the newsletter so you never miss a drop.</p>
          </div>

          <div className="cal-grid">
            {CONTENT_CALENDAR.map((item, i) => (
              <div key={i} className="reveal" style={{ background:'#fff', borderRadius:14, padding:'clamp(16px,2.5vw,22px) clamp(16px,2.5vw,24px)', border:'1px solid rgba(0,0,0,0.07)', display:'flex', alignItems:'flex-start', gap:18, minWidth:0 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:item.status==='live' ? '#22c55e' : 'rgba(255,107,0,0.4)', marginTop:5, flexShrink:0, animation:item.status==='live' ? 'pulseDot 2s infinite' : 'none' }} />
                <div style={{ minWidth:0, flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:10, color:item.status==='live' ? '#22c55e' : '#aaa', letterSpacing:'0.12em', textTransform:'uppercase' }}>{item.week}</span>
                    <span style={{ width:1, height:10, background:'rgba(0,0,0,0.1)', flexShrink:0 }} />
                    <span style={{ fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:10, color:ORANGE, letterSpacing:'0.1em', textTransform:'uppercase' }}>{item.tag}</span>
                  </div>
                  <p style={{ fontFamily:"'Manrope',sans-serif", fontWeight:600, fontSize:14, lineHeight:1.5, color:DARK, wordBreak:'break-word', margin:0 }}>{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}