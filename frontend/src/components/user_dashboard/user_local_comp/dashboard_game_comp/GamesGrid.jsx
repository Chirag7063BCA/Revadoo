import GameComingSoonBanner from './GameComingSoonBanner';

const GamesGrid = () => {
  return (
    <div className="space-y-4">
      <GameComingSoonBanner
        title="Available games are coming soon"
        description="The playable game cards will replace this preview feed once the game module is released."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {['Snake Game', 'Memory Game', 'Quiz Battle', 'Puzzle Challenge'].map((gameName) => (
          <div key={gameName} className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-[0_12px_28px_-24px_rgba(0,0,0,0.35)]">
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-red-100 to-red-50 text-sm font-black uppercase tracking-[0.22em] text-red-700">
              Coming Soon
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-black/80">{gameName}</h3>
              <p className="mt-1 text-sm text-black/45">This game card will be unlocked soon.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesGrid;
