import { FiTrendingUp } from "react-icons/fi";

const ContentReports = ({ leaderboard = [] }) => {
  const topGames = leaderboard.slice(0, 3).map((entry) => ({
    name: entry.username || entry.name || "User",
    plays: entry.attemptCount || 0,
    revenue: entry.wallet || entry.creds || 0,
  }));
  const topSurveys = leaderboard.slice(0, 3).map((entry) => ({
    name: entry.username || entry.name || "User",
    responses: entry.transactionCount || 0,
    reward: entry.creds || 0,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Top Performing Content</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <FiTrendingUp className="text-green-500" />
            <h3 className="font-medium">Top Games</h3>
          </div>
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="pb-2">Game</th>
                <th className="pb-2">Plays</th>
                <th className="pb-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topGames.map((game) => (
                <tr key={game.name} className="border-t">
                  <td className="py-2 text-sm">{game.name}</td>
                  <td className="py-2 text-sm">{game.plays}</td>
                  <td className="py-2 text-sm">${game.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <FiTrendingUp className="text-blue-500" />
            <h3 className="font-medium">Top Surveys</h3>
          </div>
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="pb-2">Survey</th>
                <th className="pb-2">Responses</th>
                <th className="pb-2">Reward</th>
              </tr>
            </thead>
            <tbody>
              {topSurveys.map((survey) => (
                <tr key={survey.name} className="border-t">
                  <td className="py-2 text-sm">{survey.name}</td>
                  <td className="py-2 text-sm">{survey.responses}</td>
                  <td className="py-2 text-sm">${survey.reward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentReports;
