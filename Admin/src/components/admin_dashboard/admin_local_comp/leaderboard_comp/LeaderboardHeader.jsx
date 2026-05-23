// LOCATION: src/components/admin_dashboard/admin_local_comp/leaderboard_comp/LeaderboardHeader.jsx
import { Trophy } from "lucide-react";

const LeaderboardHeader = ({ totalPlayers = 0 }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-200">
          <Trophy className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Leaderboard Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Control rankings, rewards &amp; player standings</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="px-4 py-2 rounded-xl border border-orange-200 bg-orange-50 text-center">
          <p className="text-xs text-orange-400 font-semibold uppercase tracking-widest">Total Players</p>
          <p className="text-xl font-black text-orange-500">{totalPlayers.toLocaleString()}</p>
        </div>
        <div className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-center">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Season</p>
          <p className="text-xl font-black text-black">04 · W12</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHeader;