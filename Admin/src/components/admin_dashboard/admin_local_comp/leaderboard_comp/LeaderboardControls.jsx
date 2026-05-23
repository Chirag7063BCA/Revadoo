// LOCATION: src/components/admin_dashboard/admin_local_comp/leaderboard_comp/LeaderboardControls.jsx
import { useState } from "react";
import { Calendar, RefreshCw } from "lucide-react";

const LeaderboardControls = ({ onRefresh = () => {}, loading = false }) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [mode, setMode] = useState("auto");

  return (
    <div className="flex flex-wrap items-center gap-3 ml-auto">
      {/* Date picker */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white">
        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-sm text-black bg-transparent outline-none"
        />
      </div>

      {/* Mode toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setMode("auto")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
            ${mode === "auto" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
        >
          Auto
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
            ${mode === "manual" ? "bg-orange-500 text-white" : "text-gray-500 hover:text-black"}`}
        >
          Manual
        </button>
      </div>

      {/* Refresh */}
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-900 disabled:opacity-50 transition-all"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        Refresh
      </button>
    </div>
  );
};

export default LeaderboardControls;