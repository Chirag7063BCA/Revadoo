import { useState, useEffect } from "react";
import { BarChart3, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import QuizStatCard from "./QuizStatCard";
import { apiUrl } from "../../../../services/apiConfig";

const UserQuizStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get user ID from localStorage
        const stored = localStorage.getItem("user");
        if (!stored) {
          setStats({
            totalAttempts: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            totalEarned: 0,
          });
          setLoading(false);
          return;
        }

        const user = JSON.parse(stored);
        const userId = user._id || user.id;
        const token = localStorage.getItem("token");

        if (!userId) {
          setStats({
            totalAttempts: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            totalEarned: 0,
          });
          setLoading(false);
          return;
        }

        const response = await fetch(
          apiUrl(`/attempts/user-stats/${userId}`),
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching user stats:", err);
        setError(err.message);
        setStats({
          totalAttempts: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          totalEarned: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      <QuizStatCard
        icon={BarChart3}
        label="Total Attempts"
        value={stats.totalAttempts}
      />
      <QuizStatCard
        icon={CheckCircle}
        label="Correct Answers"
        value={stats.correctAnswers}
      />
      <QuizStatCard
        icon={AlertCircle}
        label="Wrong Answers"
        value={stats.wrongAnswers}
      />
      <QuizStatCard
        icon={TrendingUp}
        label="Total Earned"
        value={stats.totalEarned}
      />
    </div>
  );
};

export default UserQuizStats;
