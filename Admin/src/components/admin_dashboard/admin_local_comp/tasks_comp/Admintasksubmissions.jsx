// LOCATION: src/components/admin/tasks/AdminTaskSubmissions.jsx
// PERF: screenshot loaded on demand (single fetch) — not in list payload

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Check, X, DollarSign, Eye, ChevronLeft, ChevronRight, Clock } from "lucide-react";

const BASE = "http://localhost:5000";

const STATUS_CONFIG = {
  pending:  { label: "Pending",  cls: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approved", cls: "bg-green-100 text-green-700"   },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-600"       },
  paid:     { label: "Paid",     cls: "bg-blue-100 text-blue-700"     },
};

// ── Screenshot preview modal (fetches full submission on open) ────────────────
const ScreenshotModal = ({ subId, onClose }) => {
  const [sub,     setSub]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subId) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${BASE}/api/admin/tasks/submissions/${subId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => { setSub(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [subId]);

  if (!subId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h3 className="font-bold text-gray-800">{sub?.taskId?.title || "Task"}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {sub?.userId?.username} · {sub?.userId?.email}
            </p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
          ) : sub?.screenshotData ? (
            <img src={sub.screenshotData} alt="Screenshot" className="w-full rounded-xl border border-gray-200 max-h-96 object-contain bg-gray-50" />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <span className="text-3xl mb-2">📷</span>
              <p className="text-sm text-gray-400">No screenshot uploaded</p>
            </div>
          )}

          {sub && (
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              {[
                ["Platform",  sub.taskId?.platform || "—"],
                ["Reward",    `${sub.earnedPoints || 0} TKN`],
                ["Submitted", new Date(sub.submittedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })],
                ["Review by", new Date(sub.reviewDeadline).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })],
              ].map(([label, val]) => (
                <div key={label} className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-400 uppercase tracking-wider font-bold text-[10px]">{label}</p>
                  <p className="text-gray-800 font-semibold mt-0.5 capitalize">{val}</p>
                </div>
              ))}
            </div>
          )}

          {sub?.reviewNote && (
            <div className="mt-3 rounded-lg bg-orange-50 border border-orange-100 p-3">
              <p className="text-xs font-bold text-orange-600 mb-1">Review Note</p>
              <p className="text-sm text-gray-600">{sub.reviewNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main table ────────────────────────────────────────────────────────────────
const AdminTaskSubmissions = ({ refreshKey }) => {
  const [submissions, setSubmissions] = useState([]);
  const [total,       setTotal]       = useState(0);
  const [pages,       setPages]       = useState(1);
  const [page,        setPage]        = useState(1);
  const [status,      setStatus]      = useState("pending");
  const [loading,     setLoading]     = useState(true);
  const [toast,       setToast]       = useState(null);
  const [previewId,   setPreviewId]   = useState(null);
  const [reviewNote,  setReviewNote]  = useState("");
  const [activeNote,  setActiveNote]  = useState(null);

  const getAuthHeaders = (json = false) => {
    const token = localStorage.getItem("token");
    return {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 15, ...(status && { status }) });
    fetch(`${BASE}/api/admin/tasks/submissions?${params}`, { headers: getAuthHeaders() })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.message || "Failed to load submissions");
        return d;
      })
      .then((d) => {
        setSubmissions(d.submissions || []);
        setTotal(d.total  || 0);
        setPages(d.pages  || 1);
        setLoading(false);
      })
      .catch((err) => { showToast(err.message || "Failed to load", "error"); setLoading(false); });
  }, [page, status]);

  useEffect(() => { load(); }, [load, refreshKey]);
  useEffect(() => { setPage(1); }, [status]);

  const action = async (id, endpoint, body = {}) => {
    try {
      const res  = await fetch(`${BASE}/api/admin/tasks/submissions/${id}/${endpoint}`, {
        method: "PUT", headers: getAuthHeaders(true), body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(data.message);
      load();
    } catch (err) { showToast(err.message || "Action failed", "error"); }
  };

  const handlePayAll = async () => {
    try {
      const res  = await fetch(`${BASE}/api/admin/tasks/submissions/pay-all/approved`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(data.message);
      load();
    } catch (err) { showToast(err.message || "Failed", "error"); }
  };

  const timeLeft = (deadline) => {
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return "⛔ Overdue";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m left`;
  };

  return (
    <>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.msg}
        </div>
      )}

      <ScreenshotModal subId={previewId} onClose={() => setPreviewId(null)} />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-gray-800">Task Submissions</h2>
            <p className="text-xs text-gray-400 mt-0.5">{total} records</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["", "pending", "approved", "rejected", "paid"].map((s) => (
              <button key={s} onClick={() => setStatus(s)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${status === s ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {s || "All"}
              </button>
            ))}
            {status === "approved" && (
              <button onClick={handlePayAll} className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition-colors">
                <DollarSign size={12} /> Pay All
              </button>
            )}
            <button onClick={load} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors">
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {["User", "Task", "Platform", "Reward", "Review Window", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>{[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 animate-pulse rounded bg-gray-100"/></td>)}</tr>
                ))
              ) : submissions.length === 0 ? (
                <tr><td colSpan={7} className="py-14 text-center text-gray-400">No submissions found</td></tr>
              ) : submissions.map((sub) => {
                const sc = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
                return (
                  <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{sub.userId?.username || "—"}</p>
                      <p className="text-xs text-gray-400">{sub.userId?.email || ""}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[140px]">
                      <p className="font-medium text-gray-700 truncate">{sub.taskId?.title || "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600 capitalize">{sub.taskId?.platform || "—"}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-orange-500">{sub.earnedPoints} TKN</td>
                    <td className="px-4 py-3 text-xs">
                      {sub.status === "pending" ? (
                        <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                          <Clock size={11} /> {timeLeft(sub.reviewDeadline)}
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          {sub.reviewedAt ? new Date(sub.reviewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${sc.cls}`}>{sc.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setPreviewId(sub._id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-500 hover:text-white transition-colors" title="View screenshot">
                          <Eye size={13} />
                        </button>
                        {sub.status === "pending" && (
                          <>
                            <button onClick={() => action(sub._id, "approve")} className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors" title="Approve">
                              <Check size={13} />
                            </button>
                            <button onClick={() => { setActiveNote(sub._id); setReviewNote(""); }} className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors" title="Reject">
                              <X size={13} />
                            </button>
                          </>
                        )}
                        {sub.status === "approved" && (
                          <button onClick={() => action(sub._id, "pay")} className="flex h-7 items-center gap-1 px-2.5 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-colors">
                            <DollarSign size={11} /> Pay
                          </button>
                        )}
                      </div>
                      {activeNote === sub._id && (
                        <div className="mt-2 flex gap-1">
                          <input value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} placeholder="Rejection reason…" className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-xs outline-none focus:border-red-300" />
                          <button onClick={() => { action(sub._id, "reject", { reviewNote }); setActiveNote(null); }} className="rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white hover:bg-red-600">Send</button>
                          <button onClick={() => setActiveNote(null)} className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-400 hover:bg-gray-100">Cancel</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <p className="text-xs text-gray-400">Page {page} of {pages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 transition-colors">
                <ChevronLeft size={13} />
              </button>
              {[...Array(Math.min(pages, 5))].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${page === i + 1 ? "bg-orange-500 text-white" : "border border-gray-200 text-gray-500 hover:border-orange-300"}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(p + 1, pages))} disabled={page === pages} className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 transition-colors">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminTaskSubmissions;