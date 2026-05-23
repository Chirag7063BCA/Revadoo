// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_task_comp/TasksStats.jsx
// OPTIMIZED: reads directly from context values already computed — no extra work

import { useMemo } from "react";
import { useTasksContext } from "./Taskscontext";

const StatCard = ({ icon, label, value, highlight, loading }) => (
  <div className={`rounded-2xl border bg-white p-5 shadow-sm ${highlight ? "border-orange-200" : "border-gray-100"}`}>
    <div className="mb-3 flex items-center justify-between">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <span className="text-xl">{icon}</span>
    </div>
    {loading
      ? <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-100" />
      : <p className={`text-3xl font-black ${highlight ? "text-orange-500" : "text-gray-900"}`}>{value}</p>
    }
  </div>
);

const TasksStatsptc = () => {
  const { tasks, submissions, totalCredits, loading } = useTasksContext();

  const stats = useMemo(() => {
    const now          = Date.now();
    const visible      = tasks.filter((t) => t.isActive && !(t.expiresAt && now > new Date(t.expiresAt).getTime()));
    const completed    = Object.keys(submissions).length;
    const pendingCount = Object.values(submissions).filter((s) => s.status === "pending").length;
    return { total: visible.length, completed, pendingCount, available: Math.max(visible.length - completed, 0) };
  }, [tasks, submissions]);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard icon="✅" label="Completed"     value={`${stats.completed}/${stats.total}`} loading={loading} />
      <StatCard icon="🪙" label="Credits Earned" value={totalCredits} highlight={totalCredits > 0} loading={loading} />
      <StatCard icon="⏳" label="Under Review"  value={stats.pendingCount} loading={loading} />
      <StatCard icon="🔥" label="Available"     value={stats.available} loading={loading} />
    </div>
  );
};

export default TasksStatsptc;