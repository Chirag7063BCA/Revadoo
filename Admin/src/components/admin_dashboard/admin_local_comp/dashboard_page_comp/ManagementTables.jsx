import { Link } from "react-router-dom";
import { FiArrowRight, FiEye, FiTrendingUp, FiDollarSign, FiCalendar, FiUser } from "react-icons/fi";

const ManagementTables = ({ topGames = [], recentUsers = [], loading = false }) => {
  const totalRevenue = topGames.reduce((sum, game) => sum + Number(game.revenue || 0), 0);
  const activeUsers = recentUsers.filter((user) => (user.status || "active") === "active").length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <FiEye className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Top Performing Games</h2>
              <p className="text-xs text-gray-500">Based on live backend activity</p>
            </div>
          </div>
          <Link to="/admin/games" className="group flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-all duration-300">
            <span>View All</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Game</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plays</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody>
              {loading && !topGames.length ? (
                <tr><td className="py-4 text-sm text-gray-500" colSpan="5">Loading live backend data...</td></tr>
              ) : topGames.map((game, index) => (
                <tr key={game.id || `${game.name}-${index}`} className="group border-b border-gray-50 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-transparent transition-all duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                  <td className="py-4 text-sm font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {game.name}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{game.category}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <FiTrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-sm text-gray-600">{Number(game.plays || 0).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      <FiDollarSign className="w-3 h-3 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-800">${Number(game.revenue || 0).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{game.trend}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
          <span>Showing live backend games</span>
          <span>Total revenue: ${totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <FiUser className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Recent Users</h2>
              <p className="text-xs text-gray-500">Newest registrations from backend</p>
            </div>
          </div>
          <Link to="/admin/users" className="group flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-300">
            <span>View All</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && !recentUsers.length ? (
                <tr><td className="py-4 text-sm text-gray-500" colSpan="4">Loading live backend data...</td></tr>
              ) : recentUsers.map((user, index) => (
                <tr key={user._id || user.id || `${user.email}-${index}`} className="group border-b border-gray-50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                  <td className="py-4 text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {user.username || user.name}
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{new Date(user.createdAt || user.joined || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${(user.status || "active") === "active" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                      {(user.status || "active") === "active" ? "Active" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
          <span>Showing {recentUsers.length || 0} most recent users</span>
          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{activeUsers} active</span>
        </div>
      </div>
    </div>
  );
};

export default ManagementTables;
