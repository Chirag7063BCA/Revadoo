// AdminWithdrawalRequests.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const filters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  completed: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

const AdminWithdrawalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState("pending");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [actionModal, setActionModal] = useState(null);
  const [adminNote, setAdminNote] = useState("");

  const loadRequests = async (requestedPage = 1, filter = activeFilter) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/wallet/admin/withdrawals?status=${filter}&page=${requestedPage}&limit=10`
      );
      setRequests(response.data.requests || []);
      setPage(response.data.page || requestedPage);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to load withdrawal requests", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests(1, activeFilter);
  }, [activeFilter]);

  const rows = useMemo(() => requests, [requests]);

  const resolveAccountLabel = (request) => {
    if (request.method === "upi") {
      return request.upiId || request.bankDetails?.upiId || "UPI";
    }
    const bankName = request.bankDetails?.bankName || "Bank";
    const last4 = request.bankDetails?.accountNumberLast4 || "----";
    return `${bankName} ****${last4}`;
  };

  const submitAction = async () => {
    if (!actionModal) return;
    try {
      await axios.post(`http://localhost:5000/api/wallet/admin/withdrawals/${actionModal.id}/action`, {
        action: actionModal.action,
        adminNote,
      });
      setActionModal(null);
      setAdminNote("");
      loadRequests(page, activeFilter);
    } catch (error) {
      console.error("Withdrawal action failed", error);
      alert(error.response?.data?.message || "Could not process request");
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${activeFilter === filter.value ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">User Name</th>
              <th className="px-4 py-3">User Email</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Account/UPI</th>
              <th className="px-4 py-3">Reference ID</th>
              <th className="px-4 py-3">Date Requested</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-gray-400">
                  {loading ? "Loading..." : "No withdrawal requests found"}
                </td>
              </tr>
            ) : rows.map((request) => (
              <tr key={request._id}>
                <td className="px-4 py-3 font-medium text-gray-900">{request.userId?.name || "-"}</td>
                <td className="px-4 py-3 text-gray-600">{request.userId?.email || "-"}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">₹{Number(request.amount || 0).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-gray-600">{request.method === "bank_transfer" ? "Bank Transfer" : "UPI"}</td>
                <td className="px-4 py-3 text-gray-600">{resolveAccountLabel(request)}</td>
                <td className="px-4 py-3 font-mono text-xs text-orange-500">{request.referenceId}</td>
                <td className="px-4 py-3 text-gray-600">{new Date(request.createdAt).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status] || "bg-gray-100 text-gray-700"}`}>
                    {request.status === "completed" ? "Approved" : request.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {request.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActionModal({ id: request._id, action: "approve" })}
                        className="rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => setActionModal({ id: request._id, action: "reject" })}
                        className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => loadRequests(page - 1, activeFilter)}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => loadRequests(page + 1, activeFilter)}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {actionModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900">Confirm action</h3>
            <p className="mt-2 text-sm text-gray-600">
              {actionModal.action === "approve" ? "Approve" : "Reject"} this withdrawal request?
            </p>
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-medium text-gray-700">Admin note (optional)</span>
              <textarea
                value={adminNote}
                onChange={(event) => setAdminNote(event.target.value)}
                className="min-h-24 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
              />
            </label>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setActionModal(null);
                  setAdminNote("");
                }}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitAction}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white ${actionModal.action === "approve" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminWithdrawalRequests;
