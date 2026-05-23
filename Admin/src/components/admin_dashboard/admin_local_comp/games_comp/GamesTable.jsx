import { useState } from "react";
import { FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from "react-icons/fi";

const sampleGames = [
  { id: 1, title: "Space Invaders", category: "action", reward: 5.0, plays: 1234, active: true },
  { id: 2, title: "Math Quiz", category: "puzzle", reward: 2.5, plays: 567, active: true },
  { id: 3, title: "Chess Challenge", category: "strategy", reward: 10.0, plays: 89, active: false },
];

const GamesTable = () => {
  const [games, setGames] = useState(sampleGames);

  const toggleActive = (id) => {
    setGames(games.map(g => g.id === id ? { ...g, active: !g.active } : g));
  };

  const deleteGame = (id) => {
    if (window.confirm("Delete this game?")) {
      setGames(games.filter(g => g.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reward</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plays</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {games.map((game) => (
            <tr key={game.id}>
              <td className="px-6 py-4 whitespace-nowrap font-medium">{game.title}</td>
              <td className="px-6 py-4 whitespace-nowrap capitalize">{game.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">${game.reward.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{game.plays.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  game.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {game.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => toggleActive(game.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                  {game.active ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                </button>
                <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button onClick={() => deleteGame(game.id)} className="text-red-600 hover:text-red-900">
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GamesTable;