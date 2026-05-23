import GameComingSoonBanner from './GameComingSoonBanner';

const GamesStats = () => {
  const stats = [
    { title: "Games Played", value: 42 },
    { title: "Tokens Earned", value: 1240 },
    { title: "High Score", value: 890 },
  ];

  return (
    <div className="space-y-4">
      <GameComingSoonBanner
        title="Game stats are coming soon"
        description="Your gameplay stats, token earnings, and scores will appear here once the games are live."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-2xl border border-red-100 bg-white/80 p-5 shadow-[0_12px_28px_-24px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-600/70">{stat.title}</p>
            <h3 className="mt-2 text-2xl font-black text-black/35">Coming Soon</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesStats;
