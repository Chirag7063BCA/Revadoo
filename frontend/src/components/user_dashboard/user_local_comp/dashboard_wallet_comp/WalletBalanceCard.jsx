// WalletBalanceCard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../../services/apiConfig";

const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const minimumCreds = 500;

const WalletBalanceCard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [wallet, setWallet] = useState({ balance: 0, creds: Number(user?.creds || 0) });
  const [credsToConvert, setCredsToConvert] = useState("");
  const [converting, setConverting] = useState(false);
  const [conversionError, setConversionError] = useState("");
  const [conversionSuccess, setConversionSuccess] = useState("");

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

  const handleConvertCreds = async () => {
    const value = Number(credsToConvert);

    if (!value || value < minimumCreds) {
      setConversionError(`Minimum ${minimumCreds} Creds required to convert`);
      return;
    }

    if (value > Number(wallet.creds || 0)) {
      setConversionError("Entered Creds exceed your available Creds");
      return;
    }

    try {
      setConverting(true);
      setConversionError("");
      setConversionSuccess("");

      const response = await axios.post(apiUrl("/wallet/convert-creds"), {
        userId,
        credsToConvert: value,
      });

      setWallet((current) => ({
        ...current,
        balance: Number(response.data.newWalletBalance ?? current.balance),
        creds: Number(response.data.newCredsBalance ?? current.creds),
      }));
      setCredsToConvert("");
      setConversionSuccess("Creds converted successfully");
      window.dispatchEvent(new Event("walletUpdated"));
      setTimeout(() => setConversionSuccess(""), 2500);
    } catch (error) {
      setConversionError(error.response?.data?.message || "Conversion failed");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 p-6 font-['DM_Sans',sans-serif] shadow-[0_20px_60px_rgba(255,107,53,0.24)] sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        <div className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Creds</p>
          <h2 className="mt-2 text-4xl font-bold leading-none tracking-tight sm:text-5xl">
            {Number(wallet.creds || 0).toLocaleString("en-IN")}
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Convert your Creds into wallet cash when you are ready.
          </p>

          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Creds to convert</span>
            <input
              type="number"
              min="1"
              max={Number(wallet.creds || 0)}
              value={credsToConvert}
              onChange={(event) => setCredsToConvert(event.target.value)}
              placeholder="Enter Creds"
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/15 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-white/50 focus:border-white/50"
            />
          </label>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="hidden h-24 w-px bg-white/35 lg:block" />
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/15 text-2xl font-bold text-white shadow-lg backdrop-blur">
              ⇄
            </div>
            <div className="mt-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Convert
            </div>
            <div className="hidden h-24 w-px bg-white/35 lg:block" />
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Wallet Balance</p>
          <h2 className="mt-2 text-4xl font-bold leading-none tracking-tight sm:text-5xl">
            ₹{formatAmount(wallet.balance)}
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Real money balance available for withdrawal.
          </p>

          <button
            type="button"
            onClick={handleConvertCreds}
            disabled={converting}
            className="mt-4 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {converting ? "Converting..." : "Convert Creds"}
          </button>
        </div>
      </div>

      <div className="relative mt-4 space-y-2">
        <p className="text-sm text-white/70">
          Wallet funds stay synced with Stripe payments and withdrawals.
        </p>
        {conversionError ? (
          <div className="rounded-xl border border-red-200/40 bg-red-500/15 px-4 py-3 text-sm text-white">
            {conversionError}
          </div>
        ) : null}
        {conversionSuccess ? (
          <div className="rounded-xl border border-emerald-200/40 bg-emerald-500/15 px-4 py-3 text-sm text-white">
            {conversionSuccess}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WalletBalanceCard;