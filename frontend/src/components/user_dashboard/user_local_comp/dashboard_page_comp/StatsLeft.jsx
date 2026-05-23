import React, { useState, useEffect } from "react";
import { apiUrl } from "../../../../services/apiConfig";

const StatCard = ({
  label,
  value,
  icon,
  color,
  bg,
  border,
  statKey,
  selectedStat,
  onSelectStat,
}) => {
  const isSelected = selectedStat === statKey;

  return (
    <div
      onClick={() => onSelectStat(statKey)}
      className="flex flex-col justify-between rounded-2xl p-3 sm:p-4 transition-all duration-200 cursor-pointer"
      style={{
        background: isSelected ? "#fff8f4" : "#ffffff",
        border: isSelected
          ? `1.5px solid ${color}`
          : "1.5px solid rgba(0,0,0,0.07)",
        boxShadow: isSelected
          ? `0 4px 24px rgba(255,107,0,0.10)`
          : "0 1px 4px rgba(0,0,0,0.04)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Top row — label + icon */}
      <div className="flex items-center justify-between gap-1">
        <p
          className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest truncate"
          style={{ color: isSelected ? color : "#9ca3af" }}
        >
          {label}
        </p>
        <div
          className="flex items-center justify-center rounded-xl shrink-0 transition-all duration-200"
          style={{
            width: 30,
            height: 30,
            background: isSelected ? color : "rgba(0,0,0,0.05)",
            color: isSelected ? "#ffffff" : "#6b7280",
          }}
        >
          {React.cloneElement(icon, { width: 14, height: 14 })}
        </div>
      </div>

      {/* Value */}
      <div className="mt-3">
        <h3
          className="text-2xl sm:text-3xl font-black leading-none"
          style={{ color: "#030712" }}
        >
          {value}
        </h3>
      </div>

      {/* Colored underline indicator */}
      <div
        className="mt-3 rounded-full transition-all duration-300"
        style={{
          height: 2,
          width: isSelected ? 36 : 16,
          background: isSelected ? color : "rgba(0,0,0,0.1)",
        }}
      />

      {/* View Graph button */}
      <button
        className="sm:flex hidden items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 w-fit"
        style={{
          background: isSelected ? color : "rgba(0,0,0,0.04)",
          color: isSelected ? "#ffffff" : "#9ca3af",
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.02em",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelectStat(statKey);
        }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        {isSelected ? "Viewing" : "View Graph"}
      </button>
    </div>
  );
};

const StatsLeft = ({ selectedStat, onSelectStat }) => {
  const [stats, setStats] = useState({
    completedTasks: 0,
    totalEarnings: 0,
    completedSurveys: 0,
    totalReferrals: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(
        apiUrl("/user/dashboard-stats"),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();

      if (data.success && data.stats) {
        setStats({
          completedTasks: data.stats.completedTasks || 0,
          totalEarnings: data.stats.totalEarnings || 0,
          completedSurveys: data.stats.completedSurveys || 0,
          totalReferrals: data.stats.totalReferrals || 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const handleBalanceUpdate = () => fetchStats();
    window.addEventListener("balanceUpdated", handleBalanceUpdate);
    return () =>
      window.removeEventListener("balanceUpdated", handleBalanceUpdate);
  }, []);

  const cards = [
    {
      statKey: "tasks",
      label: "Tasks",
      value: stats.completedTasks,
      color: "#FF6B00",
      bg: "rgba(255,107,0,0.08)",
      border: "rgba(255,107,0,0.2)",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      statKey: "earnings",
      label: "Points Earned",
      value: stats.totalEarnings,
      color: "#FF6B00",
      bg: "rgba(255,107,0,0.08)",
      border: "rgba(255,107,0,0.2)",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      statKey: "surveys",
      label: "Surveys",
      value: stats.completedSurveys,
      color: "#FF6B00",
      bg: "rgba(255,107,0,0.08)",
      border: "rgba(255,107,0,0.2)",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      statKey: "referrals",
      label: "Referrals",
      value: stats.totalReferrals,
      color: "#FF6B00",
      bg: "rgba(255,107,0,0.08)",
      border: "rgba(255,107,0,0.2)",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-3 h-full">
      {loading
        ? // Loading skeleton
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-3 sm:p-4 animate-pulse"
              style={{
                background: "#f0f0f0",
                border: "1.5px solid rgba(0,0,0,0.07)",
              }}
            >
              <div className="h-4 w-16 rounded mb-4 bg-gray-300" />
              <div className="h-8 w-12 rounded bg-gray-300" />
            </div>
          ))
        : cards.map((card, i) => (
            <StatCard
              key={i}
              {...card}
              selectedStat={selectedStat}
              onSelectStat={onSelectStat}
            />
          ))}
    </div>
  );
};

export default StatsLeft;
