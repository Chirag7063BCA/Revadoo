// LOCATION: src/components/admin/referrals/ReferralsQuickActions.jsx

import { useState } from "react";
import { DollarSign, Download, BarChart2, RefreshCw, CheckCircle, XCircle } from "lucide-react";

const BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

const ReferralsQuickActions = ({ onRefresh }) => {
  const [toast,          setToast]          = useState(null);
  const [payingAll,      setPayingAll]       = useState(false);
  const [confirmPayAll,  setConfirmPayAll]   = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Export CSV ──────────────────────────────────────────────────────────────
  const handleExport = () => {
    const link = document.createElement("a");
    link.href = `${BASE}/api/admin/referrals/export`;
    link.download = `referrals_${Date.now()}.csv`;
    link.click();
    showToast("CSV export started");
  };

  // ── Pay All Pending — sets every Pending referral to Active ────────────────
  const handlePayAll = async () => {
    setPayingAll(true);
    setConfirmPayAll(false);
    try {
      // Fetch all pending referrals
      const res  = await fetch(`${BASE}/api/admin/referrals?status=Pending&limit=100`);
      const data = await res.json();
      const pending = data.referrals || [];

      if (pending.length === 0) {
        showToast("No pending referrals found", "info");
        setPayingAll(false);
        return;
      }

      // Update each one to Active
      await Promise.all(
        pending.map((r) =>
          fetch(`${BASE}/api/admin/referrals/${r._id}/status`, {
            method:  "PUT",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ status: "Active" }),
          })
        )
      );

      showToast(`${pending.length} referral(s) marked as Active`);
      onRefresh?.();
    } catch {
      showToast("Failed to process payouts", "error");
    } finally {
      setPayingAll(false);
    }
  };

  const ACTIONS = [
    {
      label:   "Pay All Pending",
      icon:    DollarSign,
      color:   "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
      onClick: () => setConfirmPayAll(true),
      loading: payingAll,
    },
    {
      label:   "Export CSV",
      icon:    Download,
      color:   "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      onClick: handleExport,
    },
    {
      label:   "Refresh Data",
      icon:    RefreshCw,
      color:   "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
      onClick: () => { onRefresh?.(); showToast("Data refreshed"); },
    },
    {
      label:   "View Analytics",
      icon:    BarChart2,
      color:   "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
      onClick: () => showToast("Analytics panel coming soon", "info"),
    },
  ];

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${
            toast.type === "error" ? "bg-red-500" :
            toast.type === "info"  ? "bg-blue-500" : "bg-green-500"
          }`}
        >
          {toast.type === "error" ? <XCircle size={15} /> : <CheckCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Pay-all confirm */}
      {confirmPayAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2">Pay All Pending?</h3>
            <p className="text-sm text-gray-500 mb-5">
              This will mark all <strong>Pending</strong> referrals as <strong>Active</strong>.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmPayAll(false)}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayAll}
                className="flex-1 rounded-lg bg-green-500 py-2 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {ACTIONS.map(({ label, icon: Icon, color, onClick, loading }) => (
          <button
            key={label}
            onClick={onClick}
            disabled={loading}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${color}`}
          >
            <Icon size={15} className={loading ? "animate-spin" : ""} />
            {label}
          </button>
        ))}
      </div>
    </>
  );
};

export default ReferralsQuickActions;