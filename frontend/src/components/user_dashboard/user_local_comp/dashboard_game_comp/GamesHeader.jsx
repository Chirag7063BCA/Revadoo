import GameComingSoonBanner from './GameComingSoonBanner';

const GamesHeader = () => {
  return (
    <div className="space-y-4">
      <GameComingSoonBanner
        title="Games section is coming soon"
        description="We are building the game post feed and playable experiences. For now, this area is marked as coming soon and will go live in a future update."
      />
    </div>
  );
};

export default GamesHeader;
