import React from 'react';
import { useBlogData } from './Blogstore';

const ORANGE = '#FF6B00';

const TICKER_ITEMS = [
  '🎮 Mini Game Reward +500 Creds',
  '✅ Survey Completed +180 Creds',
  '🏆 Daily Streak Bonus +250 Creds',
  '🎁 Gift Card Unlocked $25',
  '⭐ Level 50 Achieved +1000 Creds',
  '🔥 Challenge Complete +750 Creds',
  '💸 Cash Out $50 Processed',
  '🥇 Top 10 Leaderboard Bonus',
  '📋 New Task Available +300 Creds',
  '🎯 Perfect Quiz Score +400 Creds',
];

export default function BlogStats() {
  const { posts, isSanity } = useBlogData();
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      {/* ── Ticker bar ── */}
      <div
        aria-hidden="true"
        style={{
          background: ORANGE, overflow: 'hidden', padding: '11px 0',
          position: 'relative', zIndex: 10,
          /* GPU layer — prevents ticker animation from repainting surrounding text */
          willChange: 'transform', transform: 'translateZ(0)',
        }}
      >
        <div style={{ display:'flex', animation:'ticker 30s linear infinite', width:'max-content', willChange:'transform' }}>
          {doubled.map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily:"'Manrope',sans-serif", fontWeight:700,
                fontSize:'clamp(0.65rem,1.2vw,0.75rem)',
                color:'#fff', letterSpacing:'0.06em',
                whiteSpace:'nowrap', padding:'0 clamp(24px,4vw,44px)',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div
        role="region"
        aria-label="Blog statistics"
        style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,0.06)', overflowX:'clip' }}
      >
        <style>{`
          .b-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); }
          @media(max-width:640px){
            .b-stats-grid { grid-template-columns:repeat(2,1fr); }
            .b-stat-item:nth-child(odd)              { border-right:1px solid rgba(0,0,0,0.06) !important; }
            .b-stat-item:nth-child(1),.b-stat-item:nth-child(2) { border-bottom:1px solid rgba(0,0,0,0.06); }
            .b-stat-item:nth-child(3),.b-stat-item:nth-child(4) { border-right:none !important; }
          }
        `}</style>

        <div className="b-stats-grid" style={{ maxWidth:1280, margin:'0 auto', padding:'0 clamp(16px,4vw,64px)' }}>
          {[
            { val:'128K+',            label:'Monthly Readers'        },
            { val:`${posts.length}+`, label:'Articles Published'     },
            { val:'40K+',             label:'Newsletter Subscribers'  },
            { val:'4.9★',             label:'Average Rating'          },
          ].map(({ val, label }, i) => (
            <div
              key={label}
              className="b-stat-item"
              style={{ padding:'clamp(16px,2.5vw,22px) 0', textAlign:'center', borderRight:i < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}
            >
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1.3rem,2.5vw,1.8rem)', color:ORANGE, letterSpacing:'0.04em', lineHeight:1 }}>{val}</div>
              <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:'clamp(9px,1.2vw,11px)', color:'#999', marginTop:4, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>

        {isSanity && (
          <div style={{ borderTop:'1px solid rgba(0,0,0,0.04)', padding:'8px clamp(16px,4vw,64px)', display:'flex', alignItems:'center', gap:8, justifyContent:'flex-end' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', display:'inline-block', animation:'pulseDot 2s infinite' }} />
            <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:11, color:'#22c55e', fontWeight:700 }}>Live from Sanity CMS</span>
          </div>
        )}
      </div>
    </>
  );
}