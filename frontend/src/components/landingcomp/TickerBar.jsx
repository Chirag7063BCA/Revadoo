import React from 'react'

const TickerBar = () => {
  const items = ['🎮 Mini Game Reward +500 Creds','✅ Survey Completed +180 Creds','🏆 Daily Streak Bonus +250 Creds','🎁 Gift Card Unlocked $25','⭐ Level 50 Achieved +1000 Creds','🔥 Challenge Complete +750 Creds','💸 Cash Out $50 Processed','🥇 Top 10 Leaderboard Bonus']
  const doubled = [...items, ...items]
  return (
    <div
      aria-hidden="true"
      style={{ background:'#FF6B00', overflow:'hidden', padding:'12px 0', position:'relative', zIndex:10 }}
    >
      <div style={{ display:'flex', animation:'ticker 28s linear infinite', width:'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.78rem', color:'#fff',
            letterSpacing:'0.06em', whiteSpace:'nowrap', padding:'0 48px' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default TickerBar