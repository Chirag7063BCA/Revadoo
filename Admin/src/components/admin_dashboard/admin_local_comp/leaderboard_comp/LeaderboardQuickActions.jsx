// LOCATION: src/components/admin_dashboard/admin_local_comp/leaderboard_comp/LeaderboardQuickActions.jsx
import { useState } from "react";
import { Award, RotateCcw, Download, Clock } from "lucide-react";

const LeaderboardQuickActions = ({
  onAnnounce = () => {},
  onReset    = () => {},
  onExport   = () => {},
  activeTab  = "daily",
}) => {
  const [historyOpen, setHistoryOpen] = useState(false);

  const tabLabel = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  const actions = [
    {
      icon   : Award,
      label  : "Announce Winners",
      desc   : "Notify top 3 players",
      color  : "text-orange-500",
      border : "border-orange-200",
      bg     : "bg-orange-50 hover:bg-orange-100",
      onClick: onAnnounce,
    },
    {
      icon   : RotateCcw,
      label  : `Reset ${tabLabel}`,
      desc   : "Clear current period",
      color  : "text-black",
      border : "border-gray-200",
      bg     : "bg-gray-50 hover:bg-gray-100",
      onClick: () => onReset(activeTab),
    },
    {
      icon   : Download,
      label  : "Export CSV",
      desc   : "Download rankings",
      color  : "text-orange-500",
      border : "border-orange-200",
      bg     : "bg-orange-50 hover:bg-orange-100",
      onClick: onExport,
    },
    {
      icon   : Clock,
      label  : "View History",
      desc   : "Past reset log",
      color  : "text-black",
      border : "border-gray-200",
      bg     : "bg-gray-50 hover:bg-gray-100",
      onClick: () => setHistoryOpen(true),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map(({ icon: Icon, label, desc, color, border, bg, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`group flex items-center gap-3 px-4 py-3 rounded-xl border ${border} ${bg} transition-all duration-150 text-left`}
          >
            <div className={`w-9 h-9 rounded-lg border ${border} flex items-center justify-center flex-shrink-0 bg-white group-hover:scale-110 transition-transform`}>
              <Icon className={`w-4 h-4 ${color}`} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-black truncate">{label}</p>
              <p className="text-[11px] text-gray-400 truncate hidden sm:block">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      {historyOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
          onClick={() => setHistoryOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-black text-black mb-4">Reset History</h2>
            <p className="text-sm text-gray-400">Reset history log will appear here once integrated with your analytics system.</p>
            <button
              onClick={() => setHistoryOpen(false)}
              className="mt-5 w-full py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaderboardQuickActions;