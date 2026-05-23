import { lazy, Suspense, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  TasksProvider,
  useTasksContext,
} from "../../components/user_dashboard/user_local_comp/dashboard_task_comp/dashboard_task_ptc_comp/Taskscontext";
import TasksHeaderptc from "../../components/user_dashboard/user_local_comp/dashboard_task_comp/dashboard_task_ptc_comp/TasksHeaderptc";
import PtcTasksSection from "../../components/user_dashboard/user_local_comp/dashboard_task_comp/dashboard_task_ptc_comp/PtcTasksSection";
import LuckyDrawTasksSection from "../../components/user_dashboard/user_local_comp/dashboard_task_comp/dashboard_task_luckydraw_comp/LuckyDrawTasksSection";
import ShortLinkTasksSection from "../../components/user_dashboard/user_local_comp/dashboard_task_comp/dashboard_task_shortlink_comp/ShortLinkTasksSection";
import {
  ALL_TASK_FILTER,
  TASK_CATEGORY_MAP,
  normalizeTaskFilter,
} from "../../components/user_dashboard/user_local_comp/dashboard_task_comp/taskSections";

const ActiveTaskptc = lazy(() =>
  import("../../components/user_dashboard/user_local_comp/dashboard_task_comp/dashboard_task_ptc_comp/ActiveTaskptc")
);

const QuickStat = ({ label, value, note, tone = "gray" }) => (
  <div
    className={`rounded-2xl border p-4 shadow-sm ${
      tone === "orange"
        ? "border-orange-200 bg-orange-50/80"
        : "border-gray-100 bg-white"
    }`}
  >
    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400">
      {label}
    </p>
    <p
      className={`mt-2 text-2xl font-black ${
        tone === "orange" ? "text-orange-600" : "text-gray-900"
      }`}
    >
      {value}
    </p>
    {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
  </div>
);

const TaskOverview = () => {
  const { tasks, submissions, totalCredits, loading } = useTasksContext();

  const stats = useMemo(() => {
    const now = Date.now();
    const visible = tasks.filter(
      (task) =>
        task.isActive &&
        !(task.expiresAt && now > new Date(task.expiresAt).getTime())
    );
    const completed = Object.keys(submissions).length;
    return {
      completed,
      pending: Object.values(submissions).filter(
        (submission) => submission.status === "pending"
      ).length,
      available: Math.max(visible.length - completed, 0),
    };
  }, [tasks, submissions]);

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">
          Overview
        </h2>
        <div className="h-1.5 w-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <QuickStat
          label="Available"
          value={loading ? "--" : stats.available}
          note="Visible right now"
        />
        <QuickStat
          label="Completed"
          value={loading ? "--" : stats.completed}
          note="Submitted by you"
          tone="orange"
        />
        <QuickStat
          label="Pending"
          value={loading ? "--" : stats.pending}
          note="Waiting review"
        />
        <QuickStat
          label="Credits"
          value={loading ? "--" : totalCredits}
          note="Approved earnings"
          tone="orange"
        />
      </div>
    </section>
  );
};

const ActiveTaskHeading = ({ activeFilter }) => {
  const category = TASK_CATEGORY_MAP[activeFilter];

  return (
    <h2 className="text-2xl font-black text-gray-900">
      {category ? category.label : "All Tasks"}
    </h2>
  );
};

const TaskSection = ({ activeFilter }) => {
  if (activeFilter === "ptc") return <PtcTasksSection />;
  if (activeFilter === "lucky-draw") return <LuckyDrawTasksSection />;
  if (activeFilter === "short-link") return <ShortLinkTasksSection />;

  return <PtcTasksSection activeFilter={ALL_TASK_FILTER} />;
};

const ActiveTaskModal = () => {
  const { activeTask } = useTasksContext();

  if (!activeTask) return null;

  return (
    <Suspense fallback={null}>
      <ActiveTaskptc />
    </Suspense>
  );
};

const DashboardTasks = () => {
  const params = useParams();
  const activeFilter = normalizeTaskFilter(params.category);

  return (
    <TasksProvider>
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {activeFilter !== "lucky-draw" && <TasksHeaderptc />}

        {activeFilter !== "lucky-draw" && <TaskOverview />}

        <ActiveTaskHeading activeFilter={activeFilter} />

        <main className="space-y-6">
          <TaskSection activeFilter={activeFilter} />
        </main>

        <ActiveTaskModal />
      </div>
    </TasksProvider>
  );
};

export default DashboardTasks;