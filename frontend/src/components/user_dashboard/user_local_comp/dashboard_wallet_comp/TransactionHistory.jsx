// TransactionHistory.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiArrowDownLeft, FiArrowUpRight, FiRefreshCw } from "react-icons/fi";
import { apiUrl } from "../../../../services/apiConfig";

const filters = [
  { label: "All", value: "all" },
  { label: "Credits", value: "credits" },
  { label: "Conversions", value: "conversions" },
  { label: "Withdrawals", value: "withdrawals" },
];

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || user?.id;

  const loadTransactions = async (requestedPage = 1, replace = true, filter = activeFilter) => {
    if (!userId) {
      setTransactions([]);
      return;
    }

    try {
      const response = await axios.get(
        apiUrl(`/wallet/transactions/${userId}?type=${filter}&page=${requestedPage}&limit=10`)
      );
      const items = response.data.transactions || [];
      setTransactions((current) => (replace ? items : [...current, ...items]));
      setPage(response.data.page || requestedPage);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  };

  useEffect(() => {
    loadTransactions(1, true, activeFilter);
    const handleUpdate = () => loadTransactions(1, true, activeFilter);
    window.addEventListener("walletUpdated", handleUpdate);
    return () => window.removeEventListener("walletUpdated", handleUpdate);
  }, [userId, activeFilter]);

  const total = useMemo(() => transactions.length, [transactions.length]);

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const TxRow = ({ transaction, isLast }) => {
    const isConversion = transaction.type === "conversion";
    const isCredit = transaction.type === "credit";
    const isDebit = transaction.type === "debit";
    return (
      <div className={`flex items-center justify-between py-3.5 ${isLast ? "" : "border-b border-gray-100"}`}>
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${isConversion ? "bg-orange-50" : isCredit ? "bg-green-50" : "bg-red-50"}`}>
            {isConversion ? (
              <FiRefreshCw className="text-orange-500" />
            ) : isCredit ? (
              <FiArrowUpRight className="text-green-600" />
            ) : (
              <FiArrowDownLeft className="text-red-500" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-black leading-tight">
              {transaction.description || "Transaction"}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {new Date(transaction.createdAt).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <span className={`ml-3 flex-shrink-0 text-sm font-bold ${isCredit || isConversion ? "text-green-600" : isDebit ? "text-red-500" : "text-gray-700"}`}>
          {isDebit ? "-" : "+"}{formatAmount(transaction.amount)}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-4 font-['DM_Sans',sans-serif] sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-black">Transactions</h3>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-500">
          {total} shown
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
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

      {transactions.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-300">No transactions yet</div>
      ) : (
        transactions.map((transaction, index) => (
          <TxRow key={transaction._id} transaction={transaction} isLast={index === transactions.length - 1} />
        ))
      )}

      {page < totalPages ? (
        <button
          type="button"
          onClick={() => loadTransactions(page + 1, false, activeFilter)}
          className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Load More
        </button>
      ) : null}
    </div>
  );
};

export default TransactionHistory;