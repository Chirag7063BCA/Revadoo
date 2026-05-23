// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_task_comp/TaskCard.jsx
// OPTIMIZED: wrapped in React.memo — only re-renders when task or submission status changes

import { memo } from "react";
import { useTasksContext } from "./Taskscontext";

const CATEGORY_STYLE = {
  "ptc":        { gradient: "from-yellow-400 to-orange-500", icon: "💰", badge: "PTC",        badgeCls: "bg-yellow-50 text-yellow-700 border-yellow-200"   },
  "captcha":    { gradient: "from-blue-400 to-indigo-600",   icon: "🤖", badge: "Captcha",    badgeCls: "bg-blue-50 text-blue-700 border-blue-200"         },
  "lucky-draw": { gradient: "from-purple-500 to-pink-500",   icon: "🎰", badge: "Lucky Draw", badgeCls: "bg-purple-50 text-purple-700 border-purple-200"   },
  "short-link": { gradient: "from-teal-400 to-cyan-600",     icon: "🔗", badge: "Short Link", badgeCls: "bg-teal-50 text-teal-700 border-teal-200"         },
};
const DEFAULT_STYLE = { gradient: "from-gray-400 to-gray-600", icon: "📋", badge: "Task", badgeCls: "bg-gray-50 text-gray-600 border-gray-200" };

const STATUS_CONFIG = {
  pending:  { icon: "⏳", label: "Under Review",           cls: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  approved: { icon: "✅", label: "Approved — Awaiting Pay", cls: "bg-green-50 border-green-200 text-green-700"   },
  rejected: { icon: "❌", label: "Rejected",                cls: "bg-red-50 border-red-200 text-red-600"         },
  paid:     { icon: "🎉", label: "Reward Paid!",            cls: "bg-orange-50 border-orange-200 text-orange-600"},
};

const BTN_CONFIG = {
  null:     (exp) => exp
    ? { label: "Expired",        disabled: true,  cls: "bg-gray-200 text-gray-400 cursor-not-allowed" }
    : { label: "Start Task →",   disabled: false, cls: "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-100 hover:-translate-y-0.5 active:translate-y-0" },
  pending:  { label: "⏳ Under Review",           disabled: true, cls: "bg-yellow-100 text-yellow-700 cursor-not-allowed" },
  approved: { label: "✅ Approved — Awaiting Pay", disabled: true, cls: "bg-green-100 text-green-700 cursor-not-allowed"  },
  rejected: { label: "❌ Rejected",               disabled: true, cls: "bg-red-100 text-red-600 cursor-not-allowed"       },
  paid:     { label: "🔒 Reward Claimed",          disabled: true, cls: "bg-gray-100 text-gray-500 cursor-not-allowed"    },
};

// Internal card — memo'd so it only re-renders when submission status changes
const CardInner = memo(({ task, submission, onStart }) => {
  const status    = submission?.status || null;
  const catKey    = task.platform?.toLowerCase() || "";
  const style     = CATEGORY_STYLE[catKey] || DEFAULT_STYLE;
  const isExpired = task.expiresAt && Date.now() > new Date(task.expiresAt).getTime();
  const btnCfg    = typeof BTN_CONFIG[status] === "function"
    ? BTN_CONFIG[status](isExpired)
    : (BTN_CONFIG[status] || BTN_CONFIG[null](isExpired));

  const timeLabel = task.timeMinutes > 0
    ? catKey === "ptc" ? `${task.timeMinutes}s` : `${task.timeMinutes} min`
    : "No limit";

  const statusCfg = STATUS_CONFIG[status];

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 group
      ${!btnCfg.disabled ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" : ""}
      ${status === "paid" ? "border-gray-100 opacity-80" : "border-gray-100"}`}
    >
      {/* Banner */}
      <div className="relative h-40 shrink-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`}>
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {task.thumbnail ? (
          <img
            src={task.thumbnail}
            alt={task.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-6xl"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
            {style.icon}
          </span>
        )}

        {/* Reward */}
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full border border-orange-100 bg-white/90 px-3 py-1 backdrop-blur-sm shadow-sm">
          <span className="text-sm font-bold text-orange-600">🪙 {task.reward}</span>
        </div>

        {/* Category */}
        <div className={`absolute left-2 top-2 z-10 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${style.badgeCls}`}>
          {style.badge}
        </div>

        {/* Paid overlay */}
        {status === "paid" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/50">
            <span className="text-4xl">🔒</span>
            <p className="text-sm font-black text-white">Reward Claimed</p>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`mb-1 line-clamp-1 text-lg font-bold transition-colors
          ${!btnCfg.disabled ? "text-gray-900 group-hover:text-orange-600" : "text-gray-500"}`}>
          {task.title}
        </h3>

        <p className="mb-3 line-clamp-2 text-sm text-gray-400">
          {task.description || "Complete this task to earn rewards."}
        </p>

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-gray-400">
          <span>⏱ {timeLabel}</span>
          {isExpired && <span className="text-red-400">⛔ Expired</span>}
          {!isExpired && task.expiresAt && (
            <span>📅 {new Date(task.expiresAt).toLocaleDateString()}</span>
          )}
        </div>

        {/* Status badge */}
        {statusCfg && (
          <div className={`mb-3 flex items-center gap-2 rounded-xl border px-3 py-2 ${statusCfg.cls}`}>
            <span>{statusCfg.icon}</span>
            <p className="text-xs font-black">{statusCfg.label}</p>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={!btnCfg.disabled ? onStart : undefined}
          disabled={btnCfg.disabled}
          className={`mt-auto w-full rounded-xl py-3 text-sm font-bold transition-all duration-200 ${btnCfg.cls}`}
        >
          {btnCfg.label}
        </button>
      </div>
    </div>
  );
}, (prev, next) =>
  prev.task._id === next.task._id &&
  prev.submission?.status === next.submission?.status
);

// Thin wrapper reads from context and passes only what CardInner needs
const TaskCard = ({ task }) => {
  const { getSubmission, setActiveTask } = useTasksContext();
  const submission = getSubmission(task._id || task.id);
  return (
    <CardInner
      task={task}
      submission={submission}
      onStart={() => setActiveTask(task)}
    />
  );
};

export default TaskCard;