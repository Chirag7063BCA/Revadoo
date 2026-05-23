// WithdrawalPinModal.jsx
import { useState } from "react";
import axios from "axios";
import PinInput from "./PinInput";
import { apiUrl } from "../../../../services/apiConfig";

const WithdrawalPinModal = ({ userId, onClose, onSuccess }) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const submitPin = async () => {
    if (pin.length !== 4 || confirmPin.length !== 4) {
      setError("Enter a 4-digit PIN");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await axios.post(apiUrl("/wallet/set-withdrawal-pin"), {
        userId,
        pin,
      });
      setDone(true);
      onSuccess?.();
      setTimeout(() => onClose?.(), 900);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save PIN");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Security</p>
            <h3 className="text-xl font-bold text-gray-900">Set Withdrawal PIN</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {done ? (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            PIN saved successfully.
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Enter PIN</p>
              <PinInput value={pin} onChange={setPin} error={!!error} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Confirm PIN</p>
              <PinInput value={confirmPin} onChange={setConfirmPin} error={!!error} />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitPin}
                disabled={saving}
                className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save PIN"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalPinModal;