// AddBankAccountModal.jsx
import { useMemo, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../../services/apiConfig";

const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const AddBankAccountModal = ({ userId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    upiId: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const last4 = useMemo(() => String(form.accountNumber || "").slice(-4), [form.accountNumber]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async () => {
    if (!form.accountHolderName || !form.accountNumber || !form.confirmAccountNumber || !form.ifscCode || !form.bankName) {
      setError("Please complete all required fields");
      return;
    }
    if (form.accountNumber !== form.confirmAccountNumber) {
      setError("Account numbers do not match");
      return;
    }
    if (!ifscRegex.test(form.ifscCode.toUpperCase())) {
      setError("Invalid IFSC format");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await axios.post(apiUrl("/wallet/save-bank-account"), {
        userId,
        accountHolderName: form.accountHolderName,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode.toUpperCase(),
        bankName: form.bankName,
        upiId: form.upiId || null,
      });
      onSuccess?.(response.data);
      onClose?.();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save bank account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Bank Details</p>
            <h3 className="text-xl font-bold text-gray-900">Add Bank Account</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl bg-orange-50 px-4 py-3 text-xs text-orange-700">We only save last 4 digits.</div>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Account Holder Name</span>
            <input value={form.accountHolderName} onChange={handleChange("accountHolderName")} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Account Number</span>
            <input type="password" value={form.accountNumber} onChange={handleChange("accountNumber")} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400" />
            {last4 ? <p className="text-xs text-gray-500">Ending in ****{last4}</p> : null}
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Confirm Account Number</span>
            <input type="password" value={form.confirmAccountNumber} onChange={handleChange("confirmAccountNumber")} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">IFSC Code</span>
            <input
              value={form.ifscCode}
              onChange={handleChange("ifscCode")}
              className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-400 ${form.ifscCode && !ifscRegex.test(form.ifscCode.toUpperCase()) ? "border-red-300" : "border-gray-200"}`}
              placeholder="ABCD0123456"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Bank Name</span>
            <input value={form.bankName} onChange={handleChange("bankName")} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">UPI ID (optional)</span>
            <input value={form.upiId} onChange={handleChange("upiId")} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400" placeholder="name@upi" />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBankAccountModal;