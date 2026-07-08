// AdminWalletStats.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

const StatCard = ({ label, value, accent = false }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
    <p className="mb-1 text-xs font-medium text-gray-400">{label}</p>
    <p className={`text-xl font-bold tracking-tight ${accent ? "text-orange-500" : "text-black"}`}>
      {value}
    </p>
  </div>
);

const formatAmount = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const AdminWalletStats = () => {
  const [stats, setStats] = useState({
    pendingCount: 0,
    pendingAmount: 0,
    completedToday: 0,
    failed: 0,
    totalProcessed: 0,
  });

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/wallet/admin/withdrawals?status=all&page=1&limit=1000`);
      const requests = response.data.requests || [];
      const todayKey = new Date().toDateString();

      const pending = requests.filter((request) => request.status === "pending");
      const completed = requests.filter((request) => request.status === "completed");
      const failed = requests.filter((request) => request.status === "failed");

      const completedToday = completed.filter((request) => {
        const date = new Date(request.processedAt || request.createdAt);
        return date.toDateString() === todayKey;
      }).length;

      const totalProcessed = completed.reduce((sum, request) => sum + Number(request.amount || 0), 0);

      setStats({
        pendingCount: pending.length,
        pendingAmount: pending.reduce((sum, request) => sum + Number(request.amount || 0), 0),
        completedToday,
        failed: failed.length,
        totalProcessed,
      });
    } catch (error) {
      console.error("Admin stats fetch failed", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatCard label="Total Pending Withdrawals" value={`${stats.pendingCount} | ${formatAmount(stats.pendingAmount)}`} accent />
      <StatCard label="Total Completed Today" value={stats.completedToday} />
      <StatCard label="Total Failed" value={stats.failed} />
      <StatCard label="Total Amount Processed" value={formatAmount(stats.totalProcessed)} accent />
    </div>
  );
};

export default AdminWalletStats;
