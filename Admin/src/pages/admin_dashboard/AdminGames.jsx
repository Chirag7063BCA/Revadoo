import GamesHeader from "../../components/admin_dashboard/admin_local_comp/games_comp/GamesHeader";
import GamesStats from "../../components/admin_dashboard/admin_local_comp/games_comp/GamesStats";
import AddGameForm from "../../components/admin_dashboard/admin_local_comp/games_comp/AddGameForm";
import GamesTable from "../../components/admin_dashboard/admin_local_comp/games_comp/GamesTable";
import GamesQuickActions from "../../components/admin_dashboard/admin_local_comp/games_comp/GamesQuickActions";

const AdminGames = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <GamesHeader />
      <GamesStats />
      <AddGameForm />
      <GamesTable />
      <GamesQuickActions />
    </div>
  );
};

export default AdminGames;