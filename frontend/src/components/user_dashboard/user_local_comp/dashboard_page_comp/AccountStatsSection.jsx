import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Zap,
  Award,
  BarChart3,
  CheckSquare,
} from "lucide-react";
import axios from "axios";
import QuizStatCard from "../dashboard_Quizzes_comp/QuizStatCard";
import { apiUrl } from "../../../../services/apiConfig";

// ─── Progress Bar Row ─────────────────────────────────────────────────────────
const GoalRow = ({ label, current, target }) => {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold" style={{ color: "#030712" }}>
          {label}
        </span>
        <span className="text-sm font-bold" style={{ color: "#FF6B00" }}>
          {current}/{target}
        </span>
      </div>
      <div
        className="w-full rounded-full h-2"
        style={{ background: "rgba(0,0,0,0.08)" }}
      >
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{
            background: "#FF6B00",
            width: `${pct}%`,
          }}
        />
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AccountStatsSection = () => {
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalSpent: 0,
    currentWallet: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalReferrals: 0,
    quizAttempts: 0,
    surveyCompleted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user?._id || user?.id;
        if (!userId || !token) {
          setLoading(false);
          return;
        }
        try {
          const res = await axios.get(
            apiUrl(`/user/stats/${userId}`),
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (res.data.success) setStats(res.data.stats);
        } catch {
          setStats((s) => ({ ...s, currentWallet: user.wallet || 0 }));
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Loading skeleton matches QuizStatCard dimensions
  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((section) => (
          <div key={section}>
            <div className="h-4 w-40 bg-gray-100 rounded animate-pulse mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl h-24 animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 font-['DM_Sans',sans-serif]">
      {/* ── Financial Overview ── */}
      <section>
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "#9ca3af" }}
        >
          Financial Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <QuizStatCard
            icon={DollarSign}
            label="Total Earned"
            value={`$${stats.totalEarned}`}
          />
          <QuizStatCard
            icon={TrendingUp}
            label="Total Spent"
            value={`$${stats.totalSpent}`}
          />
          <QuizStatCard
            icon={Zap}
            label="Balance"
            value={`$${stats.currentWallet}`}
          />
          <QuizStatCard
            icon={Target}
            label="Tasks Done"
            value={stats.completedTasks}
          />
          <QuizStatCard
            icon={Award}
            label="Quiz Attempts"
            value={stats.quizAttempts}
          />
          <QuizStatCard
            icon={Users}
            label="Referrals"
            value={stats.totalReferrals}
          />
        </div>
      </section>

      {/* ── Activity Summary ── */}
      <section>
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "#9ca3af" }}
        >
          Activity Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuizStatCard
            icon={CheckSquare}
            label="Tasks Completed"
            value={stats.completedTasks}
          />
          <QuizStatCard
            icon={BarChart3}
            label="Surveys Done"
            value={stats.surveyCompleted}
          />
          <QuizStatCard
            icon={Award}
            label="Quiz Attempts"
            value={stats.quizAttempts}
          />
          <QuizStatCard
            icon={Users}
            label="Active Referrals"
            value={stats.totalReferrals}
          />
        </div>
      </section>

      {/* ── Progress & Goals ── */}
      <section>
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "#9ca3af" }}
        >
          Progress & Goals
        </h3>
        <div
          className="bg-white rounded-xl border p-5 shadow-md space-y-6"
          style={{ borderColor: "rgba(0,0,0,0.05)" }}
        >
          <GoalRow
            label="Revenue Goal (Monthly)"
            current={stats.totalEarned}
            target={500}
          />
          <GoalRow
            label="Task Completion"
            current={stats.completedTasks}
            target={50}
          />
          <GoalRow
            label="Referral Growth"
            current={stats.totalReferrals}
            target={10}
          />
        </div>
      </section>
    </div>
  );
};

export default AccountStatsSection;
