import { useEffect, useMemo, useState } from "react";
import { BookOpen, BarChart3, TrendingUp, Users } from "lucide-react";
import QuizStatCard from "./QuizStatCard";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

const AdminQuizStats = ({ totalQuizzes = 0 }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/attempts/admin-stats`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Failed to fetch admin stats");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching admin stats:", err);
        setError(err.message);
        setStats({
          totalAttempts: 0,
          totalEarned: 0,
          totalUsers: 0,
        });
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchStats();
    return () => controller.abort();
  }, []);

  const cards = useMemo(
    () => [
      { icon: BookOpen, label: "Total Quizzes", value: totalQuizzes },
      { icon: BarChart3, label: "Total Attempts", value: stats?.totalAttempts ?? 0 },
      { icon: TrendingUp, label: "Total Earned", value: stats?.totalEarned ?? 0 },
      { icon: Users, label: "Active Users", value: stats?.totalUsers ?? 0 },
    ],
    [stats, totalQuizzes],
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-xl h-20 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (!stats && totalQuizzes === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {cards.map((card) => (
        <QuizStatCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
        />
      ))}
    </div>
  );
};

export default AdminQuizStats;
