import React, { useState, useEffect } from "react";
import { FaClipboardList, FaGamepad, FaGift, FaUserPlus } from "react-icons/fa";
import axios from "axios";
import { apiUrl } from "../../../../services/apiConfig";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeklyEarnings, setWeeklyEarnings] = useState(0);

  const iconMap = {
    survey: FaClipboardList,
    game: FaGamepad,
    bonus: FaGift,
    referral: FaUserPlus,
    credit: FaGift,
    debit: FaGamepad,
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (!userStr) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user?._id || user?.id;
        if (!userId || !token) {
          setLoading(false);
          return;
        }

        // Fetch transactions from API
        const response = await axios.get(
          apiUrl(`/wallet/transactions/${userId}`),
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data && response.data.transactions) {
          const txns = response.data.transactions.map((t) => ({
            id: t._id,
            description:
              t.description ||
              `${t.type === "credit" ? "Earned" : "Spent"} $${t.amount}`,
            date: t.createdAt,
            amount: `${t.type === "credit" ? "+" : "-"}$${t.amount.toFixed(2)}`,
            type: t.type === "credit" ? "bonus" : "game",
          }));

          setTransactions(txns);

          // Calculate weekly earnings
          const today = new Date();
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

          const weekly = txns
            .filter((t) => {
              const txnDate = new Date(t.date);
              return txnDate >= weekAgo && t.amount.includes("+");
            })
            .reduce(
              (sum, t) => sum + parseFloat(t.amount.replace("+$", "")),
              0,
            );

          setWeeklyEarnings(weekly);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        // Fallback to empty transactions
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div
      className="rounded-2xl p-5 sm:p-6 w-full"
      style={{
        background: "#ffffff",
        border: "1.5px solid rgba(0,0,0,0.07)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="rounded-full hidden sm:block flex-shrink-0"
            style={{ width: 3, height: 24, background: "#FF6B00" }}
          />
          <div>
            <h2
              className="text-base sm:text-lg font-bold"
              style={{ color: "#030712" }}
            >
              Recent Transactions
            </h2>
            <p
              className="text-[10px] sm:text-[11px] font-medium mt-0.5"
              style={{ color: "#9ca3af" }}
            >
              Your latest earnings activity
            </p>
          </div>
        </div>

        {/* Week badge — consistent with StatsRight summary pill */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
          style={{
            background: "rgba(255,107,0,0.08)",
            border: "1px solid rgba(255,107,0,0.2)",
            color: "#FF6B00",
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          This Week
        </div>
      </div>

      {/* ── Transaction Rows ── */}
      <div className="space-y-2">
        {loading ? (
          // Loading skeleton
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl animate-pulse"
                style={{ background: "rgba(0,0,0,0.05)" }}
              >
                <div
                  className="rounded-xl flex-shrink-0"
                  style={{
                    width: 38,
                    height: 38,
                    background: "rgba(0,0,0,0.08)",
                  }}
                />
                <div className="flex-1">
                  <div
                    className="h-3 w-40 rounded mb-2"
                    style={{ background: "rgba(0,0,0,0.08)" }}
                  />
                  <div
                    className="h-2 w-20 rounded"
                    style={{ background: "rgba(0,0,0,0.06)" }}
                  />
                </div>
                <div
                  className="h-4 w-16 rounded"
                  style={{ background: "rgba(0,0,0,0.08)" }}
                />
              </div>
            ))}
          </>
        ) : transactions.length > 0 ? (
          transactions.slice(0, 4).map((t) => {
            const Icon = iconMap[t.type];
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.05)",
                  background: "#ffffff",
                }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{
                    width: 38,
                    height: 38,
                    background: "rgba(255,107,0,0.08)",
                    border: "1.5px solid rgba(255,107,0,0.15)",
                  }}
                >
                  {Icon && <Icon style={{ color: "#FF6B00", fontSize: 15 }} />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm truncate"
                    style={{ color: "#030712" }}
                  >
                    {t.description}
                  </p>
                  <p
                    className="text-[10px] sm:text-[11px] font-medium mt-0.5"
                    style={{ color: "#9ca3af" }}
                  >
                    {new Date(t.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Amount */}
                <span
                  className="text-sm font-bold flex-shrink-0 px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(255,107,0,0.08)",
                    color: "#FF6B00",
                  }}
                >
                  {t.amount}
                </span>
              </div>
            );
          })
        ) : (
          // No transactions
          <div
            className="text-center py-8 rounded-xl"
            style={{ background: "rgba(0,0,0,0.02)" }}
          >
            <p style={{ color: "#9ca3af" }}>No transactions yet</p>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div
        className="flex items-center justify-between mt-5 pt-4"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        {/* Weekly total — grouped pill like StatsRight summary */}
        <div
          className="rounded-xl px-4 py-2.5"
          style={{
            background: "rgba(0,0,0,0.02)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "#9ca3af" }}
          >
            Weekly Earnings
          </p>
          <p className="text-xl font-black mt-0.5" style={{ color: "#030712" }}>
            ${weeklyEarnings.toFixed(2)}
          </p>
        </div>

        {/* View All — pill button, matches StatsLeft "View Graph" */}
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-semibold transition-all duration-200"
          style={{
            background: "rgba(255,107,0,0.08)",
            border: "1px solid rgba(255,107,0,0.2)",
            color: "#FF6B00",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FF6B00";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,107,0,0.08)";
            e.currentTarget.style.color = "#FF6B00";
          }}
        >
          View All
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RecentTransactions;
