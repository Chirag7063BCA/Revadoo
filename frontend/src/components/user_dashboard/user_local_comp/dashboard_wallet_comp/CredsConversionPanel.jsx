// CredsConversionPanel.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../../services/apiConfig";

const minimumCreds = 500;

const ConversionConfirmModal = ({ credsToConvert, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
      <h3 className="text-xl font-bold text-gray-900">Confirm Conversion</h3>
      <p className="mt-2 text-sm text-gray-600">{credsToConvert} Creds → Wallet Cash</p>
      <div className="mt-5 flex gap-3">
        <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
        <button onClick={onConfirm} className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600">Confirm</button>
      </div>
    </div>
  </div>
);

const CredsConversionPanel = () => {
  const [wallet, setWallet] = useState({ creds: 0 });
  const [credsToConvert, setCredsToConvert] = useState(500);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || user?.id;

  const fetchWallet = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(apiUrl(`/wallet/balance/${userId}`));
      setWallet(response.data.wallet || response.data);
    } catch (requestError) {
      console.error("Wallet fetch failed", requestError);
    }
  };

  useEffect(() => {
    fetchWallet();
    const handleUpdate = () => fetchWallet();
    window.addEventListener("walletUpdated", handleUpdate);
    return () => window.removeEventListener("walletUpdated", handleUpdate);
  }, []);

  useEffect(() => {
    if (wallet.creds && credsToConvert > wallet.creds) {
      setCredsToConvert(wallet.creds);
    }
  }, [wallet.creds, credsToConvert]);

  const submitConversion = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post(apiUrl("/wallet/convert-creds"), {
        userId,
        credsToConvert,
      });
      setSuccess(true);
      window.dispatchEvent(new Event("walletUpdated"));
      setTimeout(() => {
        setSuccess(false);
        setCredsToConvert(minimumCreds);
      }, 3000);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Conversion failed");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const canConvert = wallet.creds >= minimumCreds;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Creds</p>
          <h3 className="text-2xl font-bold text-gray-900">{wallet.creds || 0} Creds Available</h3>
        </div>
        {!canConvert ? (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Earn {minimumCreds - (wallet.creds || 0)} more Creds to convert
          </span>
        ) : null}
      </div>

      {success ? (
        <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Creds converted successfully.
        </div>
      ) : null}

      <div className="mt-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {[500, 1000, 2000, "All"].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setCredsToConvert(preset === "All" ? wallet.creds || minimumCreds : preset)}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {preset}
            </button>
          ))}
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-700">How many Creds to convert?</span>
          <input
            type="number"
            min={minimumCreds}
            max={wallet.creds || minimumCreds}
            step={100}
            value={credsToConvert}
            onChange={(event) => setCredsToConvert(Number(event.target.value))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="button"
          disabled={!canConvert}
          onClick={() => setShowConfirm(true)}
          className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Convert Creds
        </button>
      </div>

      {showConfirm ? (
        <ConversionConfirmModal
          credsToConvert={credsToConvert}
          onClose={() => setShowConfirm(false)}
          onConfirm={submitConversion}
        />
      ) : null}
    </div>
  );
};

export default CredsConversionPanel;