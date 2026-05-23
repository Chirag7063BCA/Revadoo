import React, { useState, useEffect } from "react";
import {
  FaGamepad,
  FaClipboardList,
  FaTasks,
  FaUserFriends,
  FaExchangeAlt,
  FaWallet,
  FaArrowDown,
  FaEye,
} from "react-icons/fa";
import { apiUrl } from "../../../../services/apiConfig";

const StatsCards = () => {
  const [stats, setStats] = useState({
    games: 0,
    surveys: 0,
    tasks: 0,
    referrals: 0,
    transactions: 0,
    deposit: 0,
    withdraw: 0,
    viewedAds: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
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

        // Fetch dashboard stats
        const res = await fetch(
          apiUrl("/user/dashboard-stats"),
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();

        if (data.success && data.stats) {
          // Fetch transactions for transaction count and totals
          const txnRes = await fetch(
            apiUrl(`/wallet/transactions/${userId}`),
            { headers: { Authorization: `Bearer ${token}` } },
          );
          const txnData = await txnRes.json();

          let totalDeposit = 0;
          let totalWithdraw = 0;

          if (txnData.transactions) {
            txnData.transactions.forEach((t) => {
              if (t.type === "credit") totalDeposit += t.amount;
              else totalWithdraw += t.amount;
            });
          }

          setStats({
            games: 0, // Could be from attempts if needed
            surveys: data.stats.completedSurveys || 0,
            tasks: data.stats.completedTasks || 0,
            referrals: data.stats.totalReferrals || 0,
            transactions: txnData.transactions?.length || 0,
            deposit: totalDeposit,
            withdraw: totalWithdraw,
            viewedAds: 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsList = [
    { title: "Games", value: stats.games, icon: <FaGamepad /> },
    { title: "Surveys", value: stats.surveys, icon: <FaClipboardList /> },
    { title: "Tasks", value: stats.tasks, icon: <FaTasks /> },
    { title: "Referrals", value: stats.referrals, icon: <FaUserFriends /> },
    {
      title: "Transactions",
      value: stats.transactions,
      icon: <FaExchangeAlt />,
    },
    {
      title: "Deposit",
      value: `$${stats.deposit.toFixed(2)}`,
      icon: <FaWallet />,
    },
    {
      title: "Withdraw",
      value: `$${stats.withdraw.toFixed(2)}`,
      icon: <FaArrowDown />,
    },
    { title: "Viewed Ads", value: stats.viewedAds, icon: <FaEye /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {loading
        ? // Loading skeleton
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-8 bg-gray-100 animate-pulse border-2 border-gray-200"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="h-4 w-20 bg-gray-300 rounded" />
                <div className="w-16 h-16 bg-gray-300 rounded-2xl" />
              </div>
              <div className="h-10 w-16 bg-gray-300 rounded mb-2" />
              <div className="h-1 w-16 bg-gray-300 rounded" />
            </div>
          ))
        : statsList.map((stat, index) => (
            <div
              key={index}
              className="group relative rounded-2xl p-8 bg-white border-2 border-gray-200 
                       shadow-[0_8px_30px_rgb(0,0,0,0.06)] 
                       transition-all duration-300 
                       hover:shadow-[0_25px_50px_-15px_rgba(249,115,22,0.4)]
                       hover:border-orange-500
                       hover:-translate-y-2
                       before:absolute before:inset-0 before:rounded-2xl 
                       before:bg-gradient-to-b before:from-transparent before:to-black/[0.02]
                       before:pointer-events-none"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between relative mb-8">
                <h3
                  className="text-base font-semibold text-gray-700 
                             tracking-wide uppercase"
                >
                  {stat.title}
                </h3>

                {/* Icon with enhanced styling */}
                <div
                  className="w-16 h-16 flex items-center justify-center rounded-2xl 
                           bg-gradient-to-br from-orange-50 to-amber-50
                           text-orange-500 shadow-md
                           transition-all duration-300
                           group-hover:from-orange-500 group-hover:to-orange-600 
                           group-hover:text-white group-hover:shadow-xl 
                           group-hover:shadow-orange-500/30 group-hover:scale-110
                           group-hover:rotate-3"
                >
                  <span className="text-3xl filter drop-shadow-md">
                    {stat.icon}
                  </span>
                </div>
              </div>

              {/* Value with enhanced styling */}
              <div className="relative">
                <p
                  className="text-4xl font-bold text-gray-900 
                           tracking-tight mb-2"
                >
                  {stat.value}
                </p>

                {/* Decorative line */}
                <div
                  className="w-16 h-1 bg-gradient-to-r from-orange-500 to-amber-500 
                            rounded-full opacity-30 group-hover:opacity-100 
                            transition-opacity duration-300"
                />

                {/* Mini metric indicator */}
                <div
                  className="absolute top-0 right-0 text-xs font-medium 
                            text-gray-400 group-hover:text-orange-400
                            transition-colors duration-300"
                >
                  • active
                </div>
              </div>

              {/* Enhanced background pattern */}
              <div
                className="absolute inset-0 rounded-2xl 
                          bg-[radial-gradient(ellipse_at_top_right,_rgba(249,115,22,0.08),_transparent_70%)]
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-500
                          pointer-events-none"
              />

              {/* Floating particles effect */}
              <div
                className="absolute top-4 right-4 w-2 h-2 bg-orange-500/20 
                          rounded-full blur-sm group-hover:bg-orange-500/40
                          transition-all duration-300"
              />
              <div
                className="absolute bottom-4 left-4 w-3 h-3 bg-orange-500/10 
                          rounded-full blur-sm group-hover:bg-orange-500/30
                          transition-all duration-300 delay-100"
              />
            </div>
          ))}
    </div>
  );
};

export default StatsCards;
