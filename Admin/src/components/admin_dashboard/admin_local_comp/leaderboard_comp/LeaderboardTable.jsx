// LOCATION: src/components/admin_dashboard/admin_local_comp/leaderboard_comp/LeaderboardTable.jsx
import { useState } from "react";
import { Award, Eye, Edit2, Crown } from "lucide-react";

const Skeleton = () => (
  <tr>
    {[...Array(5)].map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
      </td>
    ))}
  </tr>
);

const EditPointsModal = ({ user, onClose, onSave }) => {
  const [val, setVal] = useState(user?.points ?? 0);
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-black text-black mb-1">Edit Points</h2>
        <p className="text-sm text-gray-400 mb-4">
          Updating <span className="font-bold text-black">{user?.username}</span>
        </p>
        <input
          type="number"
          value={val}
          min={0}
          onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-black text-black outline-none focus:border-orange-400 transition-colors"
        />
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(user.userId, val); onClose(); }}
            className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const LeaderboardTable = ({
  players     = [],
  loading     = false,
  onEditPoints = () => {},
  onSetLeader  = () => {},
}) => {
  const [editTarget, setEditTarget] = useState(null);
  const safeList = Array.isArray(players) ? players : [];

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-black text-base">Player Rankings</h2>
          <span className="text-xs text-gray-400 font-semibold">{safeList.length} players</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Rank", "Player", "Points", "Leader", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-[11px] font-black text-gray-400 uppercase tracking-widest
                      ${i === 4 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? [...Array(6)].map((_, i) => <Skeleton key={i} />)
                : safeList.map((p) => (
                    <tr
                      key={String(p.userId)}
                      className={`transition-colors ${p.isLeader ? "bg-orange-50/60" : "hover:bg-gray-50/60"}`}
                    >
                      {/* Rank */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {p.rank <= 3 ? (
                          <span className={`w-7 h-7 rounded-lg inline-flex items-center justify-center text-sm font-black
                            ${p.rank === 1 ? "bg-orange-500 text-white" : p.rank === 2 ? "bg-black text-white" : "bg-gray-200 text-black"}`}>
                            {p.rank}
                          </span>
                        ) : (
                          <span className="text-sm font-bold text-gray-300 w-7 inline-block text-center">{p.rank}</span>
                        )}
                      </td>

                      {/* Player */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.username}
                              className="w-9 h-9 rounded-xl object-cover border border-gray-100" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 font-black text-sm border border-orange-200">
                              {(p.username || "U").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-black text-sm">{p.username}</p>
                            <p className="text-xs text-gray-400 font-mono truncate max-w-[120px]">
                              {String(p.userId).slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Points */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-base font-black text-black">{(p.points || 0).toLocaleString()}</span>
                        <span className="text-xs text-gray-400 ml-1 font-semibold">pts</span>
                      </td>

                      {/* Leader */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {p.isLeader ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-black border border-orange-200">
                            <Crown className="w-3 h-3" fill="currentColor" /> Leader
                          </span>
                        ) : (
                          <span className="text-gray-300 text-sm font-semibold">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSetLeader(p.userId)}
                            title="Set as Leader"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-400 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                          <button
                            title="View Profile"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-black transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditTarget(p)}
                            title="Edit Points"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

              {!loading && safeList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-300 text-sm font-semibold">
                    No players found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editTarget && (
        <EditPointsModal
          user={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={onEditPoints}
        />
      )}
    </>
  );
};

export default LeaderboardTable;