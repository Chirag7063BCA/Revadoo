// WalletStats.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../../services/apiConfig";

const StatCard = ({ label, value, accent = false }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-4 font-['DM_Sans',sans-serif] sm:p-5">
    <p className="mb-1 text-xs font-medium text-gray-400 truncate">{label}</p>
    <p className={`text-xl font-bold tracking-tight sm:text-2xl ${accent ? "text-orange-500" : "text-black"}`}>
      ₹{Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </p>
  </div>
);

const WalletStats = () => {
  const [wallet, setWallet] = useState({ totalEarned: 0, totalWithdrawn: 0, pendingWithdrawals: 0 });
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || user?.id;

  const fetchStats = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(apiUrl(`/wallet/balance/${userId}`));
      setWallet(response.data.wallet || response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
    const updateHandler = () => fetchStats();
    window.addEventListener("walletUpdated", updateHandler);
    return () => window.removeEventListener("walletUpdated", updateHandler);
  }, [userId]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard label="Total Earned" value={wallet.totalEarned} accent={false} />
      <StatCard label="Total Withdrawn" value={wallet.totalWithdrawn} accent />
      <StatCard label="Pending Withdrawals" value={wallet.pendingWithdrawals} accent={false} />
    </div>
  );
};

export default WalletStats;