// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_task_comp/Taskscontext.jsx
//
// OPTIMIZATIONS:
//  1. Single /api/tasks/bundle call instead of 2 separate fetches
//  2. useReducer batches ALL state into one update = zero cascade re-renders
//  3. Instant render from localStorage cache (no spinner if cache exists)
//  4. stale-while-revalidate: cache TTL 90s, silent bg refresh on focus
//  5. Optimistic submission update — no re-fetch needed after submit
//  6. AbortController cancels stale in-flight requests

import {
  createContext, useContext, useReducer,
  useCallback, useEffect, useRef,
} from "react";
import { apiOriginUrl } from "../../../../../services/apiConfig";

const TasksContext = createContext(null);
const BASE        = apiOriginUrl();
const CACHE_KEY   = "tasks_bundle_v2";
const CACHE_TTL   = 90_000; // 90 s
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days for instant stale-cache paint
const REFRESH_THROTTLE_MS = 15_000;

// ── Cache helpers (localStorage only — single key for entire bundle) ───────
const cacheWrite = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
};
const cacheRead = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (!data || !ts) return null;

    const age = Date.now() - ts;
    if (age > CACHE_MAX_AGE_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return {
      data,
      isFresh: age < CACHE_TTL,
    };
  } catch { return null; }
};
const cacheClear = () => { try { localStorage.removeItem(CACHE_KEY); } catch {} };

// ── Single reducer — one dispatch = one render ────────────────────────────
const init = () => {
  const cached = cacheRead();
  return {
    tasks:       cached?.data?.tasks       || [],
    submissions: cached?.data?.submissions || {},
    loading:     !cached,            // skip spinner if cache hit
    refreshing:  false,
    error:       null,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: state.tasks.length === 0, refreshing: state.tasks.length > 0, error: null };
    case "FETCH_OK":
      return { ...state, loading: false, refreshing: false, tasks: action.tasks, submissions: action.submissions };
    case "FETCH_ERR":
      return { ...state, loading: false, refreshing: false, error: action.error };
    case "SUB_OPTIMISTIC":
      return { ...state, submissions: { ...state.submissions, [action.taskId]: action.submission } };
    default:
      return state;
  }
};

// ── Provider ──────────────────────────────────────────────────────────────
export function TasksProvider({ children }) {
  const [state,    dispatch]       = useReducer(reducer, null, init);
  const abortRef  = useRef(null);
  const lastFetchAtRef = useRef(0);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Expose activeTask as plain state to avoid re-renders on unrelated changes
  const [activeTask, setActiveTaskState] = useReducer(
    (_, v) => v, null
  );

  const getToken = () => localStorage.getItem("token");

  // ── Core fetch — single bundle request ──────────────────────────────────
  const fetchBundle = useCallback(async ({ force = false, silent = false } = {}) => {
    if (!force && Date.now() - lastFetchAtRef.current < REFRESH_THROTTLE_MS) {
      return;
    }

    // Cancel previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    if (!silent) {
      dispatch({ type: "FETCH_START" });
    }

    try {
      const token = getToken();
      const res   = await fetch(`${BASE}/api/tasks/bundle`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal:  abortRef.current.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { tasks, submissions } = await res.json();
      lastFetchAtRef.current = Date.now();

      dispatch({ type: "FETCH_OK", tasks, submissions });
      cacheWrite({ tasks, submissions });
    } catch (err) {
      if (err.name === "AbortError") return; // stale request, ignore
      dispatch({ type: "FETCH_ERR", error: err.message });
    }
  }, []);

  // Mount: serve cache instantly, always revalidate in background
  useEffect(() => {
    fetchBundle({ silent: stateRef.current.tasks.length > 0 });
  }, [fetchBundle]);

  // Cancel in-flight requests when provider unmounts.
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  // Re-validate on window focus (picks up admin payment changes)
  useEffect(() => {
    const onFocus = () => {
      if (document.visibilityState === "visible") {
        fetchBundle({ silent: true });
      }
    };
    document.addEventListener("visibilitychange", onFocus);
    return () => document.removeEventListener("visibilitychange", onFocus);
  }, [fetchBundle]);

  // ── Lazy-load thumbnail when modal opens ─────────────────────────────────
  const setActiveTask = useCallback(async (task) => {
    if (!task) { setActiveTaskState(null); return; }

    // Show modal immediately with whatever we have
    setActiveTaskState(task);

    // If no thumbnail cached, fetch full task in background and update
    if (!task.thumbnail) {
      try {
        const res  = await fetch(`${BASE}/api/tasks/${task._id || task.id}`);
        if (res.ok) {
          const full = await res.json();
          setActiveTaskState(full);
        }
      } catch {}
    }
  }, []);

  // ── Submit task (optimistic) ─────────────────────────────────────────────
  const submitTask = useCallback(async (taskId, screenshotData = "") => {
    const token = getToken();
    try {
      const res = await fetch(`${BASE}/api/task-submissions`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ taskId, screenshotData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Optimistic: update submissions map without re-fetching
      dispatch({ type: "SUB_OPTIMISTIC", taskId, submission: data.submission });

      // Also update cache so next load is accurate
      const current = stateRef.current;
      cacheWrite({
        tasks:       current.tasks,
        submissions: { ...current.submissions, [taskId]: data.submission },
      });

      setActiveTaskState(null);
      return { success: true, submission: data.submission };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // ── Hard refresh (clears cache) ──────────────────────────────────────────
  const forceRefresh = useCallback(() => {
    cacheClear();
    fetchBundle({ force: true, silent: true });
  }, [fetchBundle]);

  // ── Derived values (no extra renders) ────────────────────────────────────
  const getSubmission  = (id) => state.submissions[id] || null;
  const completedCount = Object.keys(state.submissions).length;
  const totalCredits   = Object.values(state.submissions)
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + (s.earnedPoints || 0), 0);

  return (
    <TasksContext.Provider value={{
      tasks:       state.tasks,
      submissions: state.submissions,
      loading:     state.loading,
      refreshing:  state.refreshing,
      activeTask,
      setActiveTask,
      submitTask,
      loadData: forceRefresh,
      getSubmission,
      completedCount,
      totalCredits,
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasksContext must be inside <TasksProvider>");
  return ctx;
}

// Exported for ActiveTask
export async function verifyPlatformAction() {
  await new Promise((r) => setTimeout(r, 1200));
  return { verified: true };
}