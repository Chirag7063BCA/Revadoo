// LOCATION: src/components/admin/tasks/AdminTasksTable.jsx

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { RefreshCw, Trash2, Power, Edit3, AlertTriangle, ChevronDown, ChevronRight, Search } from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const BASE = `${API_BASE}/api`;
const CACHE_KEY = "admin_tasks_list_v2";
const CACHE_TTL = 45_000;

const readJson = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.ts || Date.now() - parsed.ts > CACHE_TTL) return null;
    return Array.isArray(parsed.tasks) ? parsed.tasks : null;
  } catch {
    return null;
  }
};

const writeCache = (tasks) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ tasks, ts: Date.now() }));
  } catch (error) {
    console.warn("TasksTable cache write failed", error);
  }
};

const _clearCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn("TasksTable cache clear failed", error);
  }
};

const ConfirmModal = ({ open, title, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Delete Task?</h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel}  className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
};

// ── Single task row ───────────────────────────────────────────────────────────
const TaskRow = ({ task, onToggle, onEdit, onDelete, isExpiredSection }) => (
  <tr className={`hover:bg-gray-50 transition-colors ${isExpiredSection ? "opacity-60" : ""}`}>
    <td className="px-4 py-3">
      {task.thumbnail ? (
        <img src={task.thumbnail} alt="" loading="lazy" decoding="async" className="h-10 w-14 rounded-lg object-cover border border-gray-200" />
      ) : (
        <div className="h-10 w-14 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
          <span className="text-xs font-black text-orange-300 uppercase">{(task.platform || "?").charAt(0)}</span>
        </div>
      )}
    </td>
    <td className="px-4 py-3">
      <p className="font-semibold text-gray-800 max-w-[160px] truncate">{task.title}</p>
      <p className="text-xs text-gray-400 truncate max-w-[160px]">{task.description}</p>
    </td>
    <td className="px-4 py-3">
      <span className="rounded-full bg-orange-50 border border-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-600 capitalize">
        {task.platform}
      </span>
    </td>
    <td className="px-4 py-3 font-bold text-orange-500">{task.reward} TKN</td>
    <td className="px-4 py-3 text-xs text-gray-500">
      {task.timeMinutes > 0 ? `${task.timeMinutes} min` : <span className="text-gray-300">No limit</span>}
    </td>
    <td className="px-4 py-3 text-xs">
      {task.expiresAt ? (
        <span className={task.expired ? "text-red-500 font-semibold" : "text-gray-500"}>
          {task.expired
            ? `⛔ ${new Date(task.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
            : new Date(task.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ) : (
        <span className="text-gray-300">Never</span>
      )}
    </td>
    <td className="px-4 py-3 text-xs">
      <span className="text-yellow-600 font-semibold">{task.stats?.pending || 0} pending</span>
      {" · "}
      <span className="text-green-600">{task.stats?.paid || 0} paid</span>
    </td>
    <td className="px-4 py-3">
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
        task.expired ? "bg-red-100 text-red-600" :
        task.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      }`}>
        {task.expired ? "Expired" : task.isActive ? "Active" : "Inactive"}
      </span>
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-1.5">
        <button onClick={() => onEdit(task)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors" title="Edit">
          <Edit3 size={13} />
        </button>
        {!isExpiredSection && (
          <button onClick={() => onToggle(task._id)} className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${task.isActive ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white" : "bg-green-50 text-green-600 hover:bg-green-500 hover:text-white"}`} title={task.isActive ? "Deactivate" : "Activate"}>
            <Power size={13} />
          </button>
        )}
        <button onClick={() => onDelete(task)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors" title="Delete">
          <Trash2 size={13} />
        </button>
      </div>
    </td>
  </tr>
);

// ── Main component ────────────────────────────────────────────────────────────
const TasksTable = ({ refreshKey, onEdit }) => {
  const [tasks,            setTasks]            = useState(() => readCache() || []);
  const [loading,          setLoading]          = useState(() => !readCache());
  const [refreshing,       setRefreshing]       = useState(false);
  const [confirm,          setConfirm]          = useState(null);
  const [toast,            setToast]            = useState(null);
  const [expiredCollapsed, setExpiredCollapsed] = useState(false);
  const didMountRef = useRef(false);
  const hasCachedTasksRef = useRef(Boolean(readCache()));

  // ── Filter state ──
  const [search,         setSearch]         = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getAuthHeaders = (json = false) => {
    const token = localStorage.getItem("token");
    return {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const load = useCallback(async ({ silent = false } = {}) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);

      const res = await fetch(`${BASE}/admin/tasks`, {
        headers: getAuthHeaders(),
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data.message || "Failed to load tasks");
      setTasks(Array.isArray(data) ? data : []);
      writeCache(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.message || "Failed to load tasks", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load({ silent: hasCachedTasksRef.current }); }, [load]);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    load({ silent: true });
  }, [refreshKey, load]);

  const handleToggle = async (id) => {
    try {
      const res  = await fetch(`${BASE}/admin/tasks/${id}/toggle`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      const data = await readJson(res);
      if (!res.ok) throw new Error(data.message);
      setTasks((prev) => {
        const next = prev.map((t) => t._id === id ? { ...t, isActive: !t.isActive } : t);
        writeCache(next);
        return next;
      });
      showToast(data.message);
    } catch (err) { showToast(err.message || "Failed", "error"); }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    try {
      const res  = await fetch(`${BASE}/admin/tasks/${confirm._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data.message);
      setTasks((prev) => {
        const next = prev.filter((t) => t._id !== confirm._id);
        writeCache(next);
        return next;
      });
      showToast("Task deleted");
    } catch (err) { showToast(err.message || "Failed", "error"); }
    finally { setConfirm(null); }
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const allActiveTasks  = useMemo(() => tasks.filter((t) => !t.expired), [tasks]);
  const allExpiredTasks = useMemo(() => tasks.filter((t) =>  t.expired), [tasks]);

  // Unique categories from ALL tasks (active + expired)
  const categories = useMemo(() => {
    const set = new Set(tasks.map((t) => (t.platform || "other").toLowerCase()));
    return [...set].sort();
  }, [tasks]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    allActiveTasks.forEach((t) => {
      const key = (t.platform || "other").toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [allActiveTasks]);

  // Apply search + category filter
  const applyFilters = (list) => {
    let out = list;
    if (categoryFilter !== "all") {
      out = out.filter((t) => (t.platform || "other").toLowerCase() === categoryFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      out = out.filter((t) => t.title?.toLowerCase().includes(q) || t.platform?.toLowerCase().includes(q));
    }
    return out;
  };

  const activeTasks  = applyFilters(allActiveTasks);
  const expiredTasks = applyFilters(allExpiredTasks);

  const TABLE_HEADERS = ["Image", "Title", "Category", "Reward", "Time Limit", "Expires", "Submissions", "Status", "Actions"];

  const renderHead = () => (
    <thead className="bg-gray-50">
      <tr>
        {TABLE_HEADERS.map((h) => (
          <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
        ))}
      </tr>
    </thead>
  );

  return (
    <>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.msg}
        </div>
      )}
      <ConfirmModal open={!!confirm} title={confirm?.title} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />

      <div className="space-y-4">

        {/* ── Filter toolbar ── */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm px-5 py-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative shrink-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="w-52 rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-100"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0 mr-1">Category:</span>

            <button
              onClick={() => setCategoryFilter("all")}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-colors border ${
                categoryFilter === "all"
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500"
              }`}
            >
              All ({allActiveTasks.length})
            </button>

            {categories.map((cat) => {
              const catCount = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-bold capitalize transition-colors border ${
                    categoryFilter === cat
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500"
                  }`}
                >
                  {cat} ({catCount})
                </button>
              );
            })}

            <button
              onClick={() => load({ silent: true })}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors ml-1"
            >
              <RefreshCw size={11} /> Refresh
            </button>
          </div>
        </div>

        {refreshing && !loading && (
          <div className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-600">
            Refreshing task list...
          </div>
        )}

        {/* ── Active Tasks table ── */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-bold text-gray-800">All Tasks</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {activeTasks.length} task{activeTasks.length !== 1 ? "s" : ""}
                {categoryFilter !== "all" && ` in "${categoryFilter}"`}
                {search.trim() && ` matching "${search}"`}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-100">
              {renderHead()}
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>{[...Array(9)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 animate-pulse rounded bg-gray-100"/></td>)}</tr>
                  ))
                ) : activeTasks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">🔍</span>
                        <p className="text-sm text-gray-400">
                          {categoryFilter !== "all" || search.trim()
                            ? "No tasks match your filters"
                            : "No active tasks — create one above"}
                        </p>
                        {(categoryFilter !== "all" || search.trim()) && (
                          <button onClick={() => { setCategoryFilter("all"); setSearch(""); }} className="mt-1 text-xs text-orange-500 font-semibold hover:underline">
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : activeTasks.map((task) => (
                  <TaskRow key={task._id} task={task} onToggle={handleToggle} onEdit={onEdit} onDelete={setConfirm} isExpiredSection={false} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Expired Tasks (collapsible) ── */}
        {!loading && allExpiredTasks.length > 0 && (
          <div className="rounded-xl border border-red-100 bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => setExpiredCollapsed((v) => !v)}
              className="w-full flex items-center justify-between border-b border-red-100 bg-red-50 px-5 py-4 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">⛔</span>
                <div className="text-left">
                  <h2 className="font-bold text-red-700">Expired Tasks</h2>
                  <p className="text-xs text-red-400 mt-0.5">
                    {expiredTasks.length} of {allExpiredTasks.length} shown · hidden from user dashboard automatically
                  </p>
                </div>
              </div>
              {expiredCollapsed
                ? <ChevronRight size={18} className="text-red-400" />
                : <ChevronDown  size={18} className="text-red-400" />
              }
            </button>

            {!expiredCollapsed && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-100">
                  {renderHead()}
                  <tbody className="divide-y divide-gray-50">
                    {expiredTasks.length === 0 ? (
                      <tr><td colSpan={9} className="py-8 text-center text-sm text-gray-400">No expired tasks match your filters</td></tr>
                    ) : expiredTasks.map((task) => (
                      <TaskRow key={task._id} task={task} onToggle={handleToggle} onEdit={onEdit} onDelete={setConfirm} isExpiredSection={true} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
};

export default TasksTable;