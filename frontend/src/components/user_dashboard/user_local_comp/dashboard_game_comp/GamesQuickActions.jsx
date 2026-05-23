import GameComingSoonBanner from './GameComingSoonBanner';

const GamesQuickActions = () => {
  const actions = [
    { icon: "🏆", label: "Leaderboard" },
    { icon: "🎁", label: "Rewards" },
    { icon: "⚡", label: "Daily Bonus" },
    { icon: "📊", label: "Game Stats" },
  ];

  return (
    <div className="space-y-4">
      <GameComingSoonBanner
        title="Quick actions are coming soon"
        description="Leaderboard, rewards, bonuses, and stats shortcuts will appear here when the games feature goes live."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {actions.map((action, index) => (
          <button
            key={index}
            type="button"
            disabled
            className="flex cursor-not-allowed flex-col items-center gap-2 rounded-2xl border border-red-100 bg-white/70 p-4 text-center opacity-80"
          >
            <span className="text-2xl grayscale">{action.icon}</span>
            <span className="text-sm font-medium text-black/50">Coming Soon</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GamesQuickActions;
