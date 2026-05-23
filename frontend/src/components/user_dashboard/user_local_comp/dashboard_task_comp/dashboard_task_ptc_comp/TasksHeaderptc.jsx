// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_task_comp/TasksHeader.jsx

import { useTasksContext } from "./Taskscontext";

const TasksHeaderptc = () => {
  const { tasks, loadData, refreshing } = useTasksContext();

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
          Task <span className="text-orange-500">Center</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-gray-500 leading-relaxed">
          Complete tasks, upload proof and earn{" "}
          <span className="font-bold text-orange-500">credits</span> after admin approval.
        </p>
        <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
      </div>

      <button
        onClick={loadData}
        disabled={refreshing}
        className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-500 shadow-sm hover:border-orange-300 hover:text-orange-500 disabled:opacity-50 transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={refreshing ? "animate-spin" : ""}>
          <path d="M23 4v6h-6M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
        </svg>
        {refreshing ? "Refreshing…" : "Refresh"}
      </button>
    </div>
  );
};

export default TasksHeaderptc;