import GameComingSoonBanner from './GameComingSoonBanner';

const ActiveGame = () => {
  return (
    <div className="space-y-4 rounded-2xl border border-red-100 bg-white p-4 shadow-[0_12px_28px_-24px_rgba(0,0,0,0.35)] sm:p-5">
      <GameComingSoonBanner
        title="Active game feed is coming soon"
        description="The live game panel will load here once the feature is ready. Until then, this section stays in a posted coming-soon state."
      />

      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/70">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Game will load here soon</p>
      </div>
    </div>
  );
};

export default ActiveGame;
