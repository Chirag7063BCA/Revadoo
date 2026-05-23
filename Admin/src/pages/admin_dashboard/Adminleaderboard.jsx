// LOCATION: src/pages/admin/AdminLeaderboardPage.jsx

import { useEffect, useState, useCallback } from "react";
import { apiFetch, apiGet, BASE, getToken } from "../../components/user_dashboard/Leaderboardapi";

import LeaderboardHeader       from "../../components/admin_dashboard/admin_local_comp/leaderboard_comp/LeaderboardHeader";
import LeaderboardControls     from "../../components/admin_dashboard/admin_local_comp/leaderboard_comp/LeaderboardControls";
import LeaderboardTabs         from "../../components/admin_dashboard/admin_local_comp/leaderboard_comp/LeaderboardTabs";
import LeaderboardTable        from "../../components/admin_dashboard/admin_local_comp/leaderboard_comp/LeaderboardTable";
import LeaderboardSettings     from "../../components/admin_dashboard/admin_local_comp/leaderboard_comp/LeaderboardSettings";
import LeaderboardQuickActions from "../../components/admin_dashboard/admin_local_comp/leaderboard_comp/LeaderboardQuickActions";

const Adminleaderboard = () => {
  const [players,   setPlayers]   = useState([]);
  const [settings,  setSettings]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("daily");

  // ── Fetch players ────────────────────────────────────────────────────────────
  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet("/api/admin/leaderboard?limit=100");
      if (!data) { setPlayers([]); return; }

      // backend returns { players: [], total: N }
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.players)
        ? data.players
        : [];

      setPlayers(list);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch settings ───────────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    const data = await apiGet("/api/admin/leaderboard/settings");
    if (data) setSettings(data);
  }, []);

  useEffect(() => {
    fetchPlayers();
    fetchSettings();
  }, [fetchPlayers, fetchSettings]);

  // ── Save settings ────────────────────────────────────────────────────────────
  const handleSaveSettings = async (form) => {
    const data = await apiFetch("/api/admin/leaderboard/settings", {
      method: "POST",
      body:   JSON.stringify(form),
    });
    if (data) fetchSettings();
  };

  // ── Edit points ──────────────────────────────────────────────────────────────
  const handleEditPoints = async (userId, points) => {
    const data = await apiFetch(`/api/admin/leaderboard/points/${userId}`, {
      method: "PUT",
      body:   JSON.stringify({ points }),
    });
    if (data) fetchPlayers();
  };

  // ── Set manual leader ────────────────────────────────────────────────────────
  const handleSetLeader = async (userId) => {
    const data = await apiFetch(`/api/admin/leaderboard/leader/${userId}`, {
      method: "PUT",
    });
    if (data) fetchPlayers();
  };

  // ── Reset leaderboard ────────────────────────────────────────────────────────
  const handleReset = async (type) => {
    if (!window.confirm(`Reset ${type} leaderboard? This cannot be undone.`)) return;
    const data = await apiFetch("/api/admin/leaderboard/reset", {
      method: "POST",
      body:   JSON.stringify({ type }),
    });
    if (data) fetchPlayers();
  };

  // ── Announce winners ─────────────────────────────────────────────────────────
  const handleAnnounce = async () => {
    const data = await apiFetch("/api/admin/leaderboard/announce", { method: "POST" });
    if (!data) return;
    const msg = data.winners
      ?.map((w) => `#${w.rank} ${w.username} — ${w.points} pts`)
      .join("\n");
    alert(`Winners announced!\n\n${msg || "No winners yet."}`);
  };

  // ── Export CSV ───────────────────────────────────────────────────────────────
  const handleExport = async () => {
    const res = await fetch(`${BASE}/api/admin/leaderboard/export`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `leaderboard_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <LeaderboardHeader totalPlayers={players.length} />
        </div>
        <LeaderboardControls onRefresh={fetchPlayers} loading={loading} />
      </div>

      <LeaderboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <LeaderboardTable
        players={players}
        loading={loading}
        onEditPoints={handleEditPoints}
        onSetLeader={handleSetLeader}
      />

      <LeaderboardSettings settings={settings} onSave={handleSaveSettings} />

      <LeaderboardQuickActions
        activeTab={activeTab}
        onAnnounce={handleAnnounce}
        onReset={handleReset}
        onExport={handleExport}
      />

    </div>
  );
};

export default Adminleaderboard;