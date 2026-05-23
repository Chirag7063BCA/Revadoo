import GamesHeader from "../../components/user_dashboard/user_local_comp/dashboard_game_comp/GamesHeader";
import GamesStats from "../../components/user_dashboard/user_local_comp/dashboard_game_comp/GamesStats";
import GamesGrid from "../../components/user_dashboard/user_local_comp/dashboard_game_comp/GamesGrid";
import ActiveGame from "../../components/user_dashboard/user_local_comp/dashboard_game_comp/ActiveGame";
import GamesQuickActions from "../../components/user_dashboard/user_local_comp/dashboard_game_comp/GamesQuickActions";

const DashboardGames = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <GamesHeader />

      <GamesStats />

      <GamesGrid />

      <ActiveGame />

      <GamesQuickActions />
    </div>
  );
};

export default DashboardGames;
