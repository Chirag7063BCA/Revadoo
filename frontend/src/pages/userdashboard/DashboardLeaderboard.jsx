// LOCATION: src/pages/user/DashboardLeaderboard.jsx

import { useEffect, useState } from "react";
import { apiGet } from "../../components/user_dashboard/user_local_comp/dashboard_leaderboard_comp/Leaderboardapi";

import LeaderboardHeader       from "../../components/user_dashboard/user_local_comp/dashboard_leaderboard_comp/LeaderboardHeader";
import LeaderboardStats        from "../../components/user_dashboard/user_local_comp/dashboard_leaderboard_comp/LeaderboardStats";
import LeaderboardGrid         from "../../components/user_dashboard/user_local_comp/dashboard_leaderboard_comp/LeaderboardGrid";
import TopUserHighlight        from "../../components/user_dashboard/user_local_comp/dashboard_leaderboard_comp/TopUserHighlight";
import LeaderboardQuickActions from "../../components/user_dashboard/user_local_comp/dashboard_leaderboard_comp/LeaderboardQuickActions";

// ─── Map backend shape → Grid shape ──────────────────────────────────────────
// Backend: { rank, userId, username, creds, avatar, initial, joinedAt }
// Grid:    { rank, username, points, tasks, surveys, avatar }
const mapPlayer = (u) => ({
  rank    : u.rank,
  username: u.username,
  points  : u.creds   ?? u.points ?? 0,   // backend uses `creds`
  tasks   : u.tasks   || 0,
  surveys : u.surveys || 0,
  avatar  : u.avatar  ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&background=f97316&color=fff`,
});

// ─── Map rank-1 player → TopUserHighlight shape ───────────────────────────────
const buildTopUser = (p) => ({
  username      : p.username,
  fullName      : p.username,
  avatar        : p.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(p.username)}&background=f97316&color=fff&size=200`,
  bio           : "Competitive player & survey expert. Always chasing the top spot 🏆",
  location      : "—",
  joinedDate    : p.joinedAt
    ? new Date(p.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—",
  badge         : "Grand Champion",
  points        : p.points          || 0,
  tasks         : p.tasks           || 0,
  surveys       : p.surveys         || 0,
  winStreak     : 0,
  level         : 1,
  rank          : "Member",
  totalEarned   : "—",
  completionRate: 0,
  weeklyGrowth  : "—",
});

// ─── Page ─────────────────────────────────────────────────────────────────────
const DashboardLeaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await apiGet("/api/leaderboard");
        if (!raw) { setLoading(false); return; }

        // /api/leaderboard returns a plain array
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw.players)
          ? raw.players
          : [];

        setPlayers(list.map(mapPlayer));
      } catch (err) {
        console.error("DashboardLeaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const topPlayer = players.find((p) => p.rank === 1) || players[0] || null;
  const topUser   = topPlayer ? buildTopUser(topPlayer) : null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      <LeaderboardHeader />

      {/* LeaderboardStats fetches /api/leaderboard/stats on its own */}
      <LeaderboardStats />

      <LeaderboardGrid players={loading ? undefined : players} />

      {!loading && topUser && <TopUserHighlight topUser={topUser} />}

      <LeaderboardQuickActions onAction={() => {}} />

    </div>
  );
};

export default DashboardLeaderboard;