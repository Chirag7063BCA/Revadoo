// WalletBalanceCard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../../services/apiConfig";

const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const WalletBalanceCard = () => {
  const [wallet, setWallet] = useState({ balance: 0 });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalComponent, setPaymentModalComponent] = useState(null);
  const [loadingPaymentModal, setLoadingPaymentModal] = useState(false);
  const [paymentUnavailable, setPaymentUnavailable] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || user?.id;

  const fetchBalance = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(apiUrl(`/wallet/balance/${userId}`));
      setWallet(response.data.wallet || response.data);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    fetchBalance();
    const handleUpdate = () => fetchBalance();
    window.addEventListener("walletUpdated", handleUpdate);
    return () => window.removeEventListener("walletUpdated", handleUpdate);
  }, [userId]);

  const openPaymentModal = async () => {
    if (typeof window === "undefined" || window.location.protocol !== "https:") {
      setPaymentUnavailable(true);
      return;
    }

    setPaymentUnavailable(false);
    if (!paymentModalComponent) {
      setLoadingPaymentModal(true);
      const module = await import("./PaymentModal");
      setPaymentModalComponent(() => module.default);
      setLoadingPaymentModal(false);
    }

    setShowPaymentModal(true);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-orange-500 p-6 font-['DM_Sans',sans-serif] sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/5" />

      <p className="mb-2 text-sm font-medium text-white/75">Available Balance</p>

      <h2 className="mb-1 text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl">
        ₹{formatAmount(wallet.balance)}
      </h2>

      <p className="mb-7 text-sm text-white/60">
        Wallet funds stay synced with Stripe payments and withdrawals.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={openPaymentModal}
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors duration-150 hover:bg-orange-50"
        >
          {loadingPaymentModal ? "Loading..." : "+ Add Money"}
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("openWithdraw"))}
          className="rounded-lg border border-white/40 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/25"
        >
          Withdraw
        </button>
      </div>

      {paymentUnavailable ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Card payments are only available over HTTPS. Open the deployed site to add money.
        </div>
      ) : null}

      {showPaymentModal && paymentModalComponent ? (
        <PaymentModal
          userId={userId}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={(newBalance) => {
            setWallet((current) => ({ ...current, balance: newBalance }));
            window.dispatchEvent(new Event("walletUpdated"));
          }}
        />
      ) : null}
    </div>
  );
};

export default WalletBalanceCard;