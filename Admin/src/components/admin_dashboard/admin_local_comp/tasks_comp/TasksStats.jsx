// LOCATION: src/components/admin/tasks/AdminTasksStats.jsx

import { CheckSquare, Clock, Coins, Activity } from "lucide-react";

const CARDS = [
  { key: "activeTasks",      label: "Active Tasks",       icon: Activity,    style: { bg: "bg-orange-50", icon: "text-orange-600", val: "text-orange-600", border: "border-orange-100" } },
  { key: "pendingReview",    label: "Pending Review",     icon: Clock,       style: { bg: "bg-yellow-50", icon: "text-yellow-600", val: "text-yellow-700", border: "border-yellow-100" } },
  { key: "totalSubmissions", label: "Total Submissions",  icon: CheckSquare, style: { bg: "bg-blue-50",   icon: "text-blue-600",   val: "text-blue-700",   border: "border-blue-100"   } },
  { key: "totalPaidTKN",    label: "Total TKN Paid Out", icon: Coins,       style: { bg: "bg-green-50",  icon: "text-green-600",  val: "text-green-700",  border: "border-green-100"  }, suffix: " TKN" },
];

const TasksStats = ({ stats, loading }) => {

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon, style, suffix }) => (
        <div key={key} className={`rounded-xl border ${style.border} bg-white p-5 shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${style.bg}`}>
              <Icon size={15} className={style.icon} />
            </div>
          </div>
          {loading
            ? <div className="h-7 w-20 animate-pulse rounded bg-gray-100" />
            : <p className={`text-2xl font-black ${style.val}`}>
                {stats?.[key] !== undefined ? stats[key].toLocaleString() + (suffix || "") : "—"}
              </p>
          }
        </div>
      ))}
    </div>
  );
};

export default TasksStats;