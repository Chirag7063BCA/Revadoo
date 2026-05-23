// LOCATION: src/components/admin/referrals/ReferralsTable.jsx

import { useEffect, useState, useCallback } from "react";
import {
  Search, RefreshCw, Check, X, Eye,
  ChevronLeft, ChevronRight, Trash2, AlertTriangle,
} from "lucide-react";

const BASE = "http://localhost:5000";

const STATUS_PILL = {
  Active:   "bg-green-100 text-green-700",
  Pending:  "bg-yellow-100 text-yellow-700",
  Inactive: "bg-gray-100 text-gray-500",
};

// ── Delete confirm modal ─────────────────────────────────────────────────────
const ConfirmModal = ({ open, referral, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Delete Referral?</h3>
            <p className="text-xs text-gray-500">This cannot be undone.</p>
          </div>
        </div>
        {referral && (
          <p className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
            <span className="font-semibold">{referral.referrer?.username || "Deleted"}</span>
            {" → "}
            <span className="font-semibold">{referral.referredUser?.username || "Deleted"}</span>
          </p>
        )}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Detail drawer ────────────────────────────────────────────────────────────
const DetailDrawer = ({ referral, onClose }) => {
  if (!referral) return null;
  const rows = [
    ["Referrer",      referral.referrer?.username     || "Deleted"],
    ["Referrer Email",referral.referrer?.email        || "—"],
    ["Referred User", referral.referredUser?.username || "Deleted"],
    ["Referred Email",referral.referredUser?.email    || "—"],
    ["Status",        referral.status],
    ["Earnings",      `${referral.earnings} TKN`],
    ["Date",          new Date(referral.createdAt).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })],
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl border border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="font-bold text-gray-800">Referral Details</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="divide-y divide-gray-100 px-5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
              <span className="text-sm font-medium text-gray-700">{value}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Table ───────────────────────────────────────────────────────────────
const ReferralsTable = ({ refreshKey }) => {
  const [referrals, setReferrals] = useState([]);
  const [total,     setTotal]     = useState(0);
  const [pages,     setPages]     = useState(1);
  const [page,      setPage]      = useState(1);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [status,    setStatus]    = useState("");
  const [toast,     setToast]     = useState(null);
  const [confirm,   setConfirm]   = useState(null);
  const [detail,    setDetail]    = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    fetch(`${BASE}/api/admin/referrals?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setReferrals(d.referrals || []);
        setTotal(d.total  || 0);
        setPages(d.pages  || 1);
        setLoading(false);
      })
      .catch(() => { showToast("Failed to load data", "error"); setLoading(false); });
  }, [page, search, status]);

  useEffect(() => { load(); }, [load, refreshKey]);
  useEffect(() => { setPage(1); }, [search, status]);

  // ── Status update ──────────────────────────────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${BASE}/api/admin/referrals/${id}/status`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReferrals((prev) => prev.map((r) => r._id === id ? { ...r, status: newStatus } : r));
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      showToast(err.message || "Update failed", "error");
    }
  };

  // Quick approve (Pending → Active)
  const handleApprove = (r) => handleStatusChange(r._id, "Active");

  // Quick reject (any → Inactive)
  const handleReject = (r) => handleStatusChange(r._id, "Inactive");

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirm) return;
    try {
      const res  = await fetch(`${BASE}/api/admin/referrals/${confirm._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReferrals((prev) => prev.filter((r) => r._id !== confirm._id));
      setTotal((t) => t - 1);
      showToast("Referral deleted");
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setConfirm(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        referral={confirm}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />

      <DetailDrawer referral={detail} onClose={() => setDetail(null)} />

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* ── Toolbar ── */}
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-gray-800">All Referrals</h2>
            <p className="text-xs text-gray-400 mt-0.5">{total} records</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search username…"
                className="w-44 rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-100"
              />
            </div>

            {/* Status filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-orange-300"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Refresh */}
            <button
              onClick={load}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["#", "Referrer", "Referred User", "Date", "Amount", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 bg-white">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-3.5">
                        <div className="h-4 animate-pulse rounded bg-gray-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-gray-400 text-sm">
                    No referrals found
                  </td>
                </tr>
              ) : (
                referrals.map((ref, i) => (
                  <tr key={ref._id} className="hover:bg-gray-50 transition-colors">
                    {/* # */}
                    <td className="px-5 py-3.5 text-xs text-gray-400">
                      {(page - 1) * 20 + i + 1}
                    </td>

                    {/* Referrer */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <p className="font-semibold text-gray-800">
                        {ref.referrer?.username || <span className="italic text-gray-400">Deleted</span>}
                      </p>
                      <p className="text-xs text-gray-400">{ref.referrer?.email || ""}</p>
                    </td>

                    {/* Referred */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <p className="font-semibold text-gray-800">
                        {ref.referredUser?.username || <span className="italic text-gray-400">Deleted</span>}
                      </p>
                      <p className="text-xs text-gray-400">{ref.referredUser?.email || ""}</p>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs text-gray-500">
                      {new Date(ref.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </td>

                    {/* Amount */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className="font-bold text-orange-500">{ref.earnings}</span>
                      <span className="ml-1 text-xs text-gray-400">TKN</span>
                    </td>

                    {/* Status dropdown */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <select
                        value={ref.status}
                        onChange={(e) => handleStatusChange(ref._id, e.target.value)}
                        className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${
                          STATUS_PILL[ref.status] || STATUS_PILL.Pending
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {ref.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(ref)}
                              title="Approve"
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              onClick={() => handleReject(ref)}
                              title="Reject"
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setDetail(ref)}
                          title="View details"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => setConfirm(ref)}
                          title="Delete"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <p className="text-xs text-gray-400">
              Page {page} of {pages} — {total} records
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={13} />
              </button>

              {[...Array(Math.min(pages, 5))].map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                      page === p
                        ? "bg-orange-500 text-white"
                        : "border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(p + 1, pages))}
                disabled={page === pages}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReferralsTable;