// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_task_comp/TasksBoard.jsx
// OPTIMIZED: useMemo everywhere, filter never re-derives unless tasks change,
//            TaskCard wrapped in React.memo to skip renders when props unchanged

import { useMemo } from "react";
import { useTasksContext } from "./Taskscontext";
import TaskCard from "./TaskCardptc";
import { ALL_TASK_FILTER, TASK_CATEGORY_MAP, normalizeTaskFilter } from "../taskSections";

// ── Static skeletons (defined outside — never re-created) ─────────────────
const SKELETONS = Array.from({ length: 6 }, (_, i) => (
  <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
    <div className="h-40 bg-gray-100" />
    <div className="space-y-3 p-5">
      <div className="h-4 w-3/4 rounded-lg bg-gray-100" />
      <div className="h-3 w-full rounded-lg bg-gray-100" />
      <div className="h-3 w-2/3 rounded-lg bg-gray-100" />
      <div className="mt-4 h-10 w-full rounded-xl bg-gray-100" />
    </div>
  </div>
));

// ── Main board ────────────────────────────────────────────────────────────
const TasksBoardptc = ({ activeFilter: controlledFilter }) => {
  const { tasks, loading } = useTasksContext();
  const activeFilter = normalizeTaskFilter(controlledFilter || ALL_TASK_FILTER);

  // Visible tasks — memoized, only recalculates when tasks array changes
  const visibleTasks = useMemo(() => {
    const now = Date.now();
    return tasks.filter(
      (t) => t.isActive && !(t.expiresAt && now > new Date(t.expiresAt).getTime())
    );
  }, [tasks]);

  // Filtered tasks
  const filtered = useMemo(
    () => activeFilter === ALL_TASK_FILTER
      ? visibleTasks
      : visibleTasks.filter((t) => t.platform?.toLowerCase() === activeFilter),
    [visibleTasks, activeFilter]
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {[80, 100, 90, 115, 95].map((w, i) => (
            <div key={i} className="h-9 animate-pulse rounded-full bg-gray-100" style={{ width: w }} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {SKELETONS}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Cards ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20">
          <span className="mb-4 text-5xl">
            {TASK_CATEGORY_MAP[activeFilter]?.icon || "🔍"}
          </span>
          <p className="text-xl font-bold text-gray-900">
            {TASK_CATEGORY_MAP[activeFilter] ? `No ${TASK_CATEGORY_MAP[activeFilter]?.label} tasks` : "No tasks available"}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {TASK_CATEGORY_MAP[activeFilter] ? "Try another category." : "Check back soon!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((task) => (
            <TaskCard key={task._id || task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksBoardptc;