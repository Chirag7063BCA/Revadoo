// WithdrawForm.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PinInput from "./PinInput";
import AddBankAccountModal from "./AddBankAccountModal";
import { apiUrl } from "../../../../services/apiConfig";

const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const accountRegex = /^[0-9]{8,18}$/;
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const upiRegex = /^[\w.-]+@[\w.-]+$/;

const WithdrawForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [wallet, setWallet] = useState({ balance: 0 });
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState("bank_transfer");
  const [accounts, setAccounts] = useState([]);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState("");
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bankForm, setBankForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    upiId: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || user?.id;

  const fetchWallet = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(apiUrl(`/wallet/balance/${userId}`));
      setWallet(response.data.wallet || response.data);
    } catch (requestError) {
      console.error(requestError);
    }
  };

  const fetchAccounts = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(apiUrl(`/wallet/bank-accounts/${userId}`));
      const nextAccounts = response.data.accounts || [];
      setAccounts(nextAccounts);
      if (nextAccounts.length > 0) {
        setSelectedBankAccountId(nextAccounts[0]._id);
      }
    } catch (requestError) {
      console.error(requestError);
    }
  };

  useEffect(() => {
    const openHandler = () => {
      setIsOpen(true);
      setStep(1);
    };

    window.addEventListener("openWithdraw", openHandler);
    window.addEventListener("walletUpdated", fetchWallet);
    return () => {
      window.removeEventListener("openWithdraw", openHandler);
      window.removeEventListener("walletUpdated", fetchWallet);
    };
  }, [userId]);

  useEffect(() => {
    fetchWallet();
  }, [userId]);

  useEffect(() => {
    if (isOpen && step === 2 && method === "bank_transfer" && accounts.length === 0) {
      fetchAccounts();
    }
  }, [isOpen, step, method]);

  const quickAmounts = [100, 250, 500, 1000];
  const availableBalance = useMemo(() => Number(wallet.balance || 0), [wallet.balance]);

  const setField = (field) => (event) => {
    setBankForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const continueFromStep1 = () => {
    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (amount > availableBalance) {
      setError("Amount exceeds available balance");
      return;
    }

    setError("");
    setStep(2);
    if (method === "bank_transfer" && accounts.length === 0) {
      fetchAccounts();
    }
  };

  const saveManualBankAccount = async () => {
    if (!bankForm.accountHolderName || !bankForm.accountNumber || !bankForm.confirmAccountNumber || !bankForm.ifscCode || !bankForm.bankName) {
      setError("Complete all bank details");
      return null;
    }
    if (bankForm.accountNumber !== bankForm.confirmAccountNumber) {
      setError("Account numbers do not match");
      return null;
    }
    if (!accountRegex.test(bankForm.accountNumber) || !ifscRegex.test(bankForm.ifscCode.toUpperCase())) {
      setError("Invalid bank details");
      return null;
    }

    const response = await axios.post(apiUrl("/wallet/save-bank-account"), {
      userId,
      accountHolderName: bankForm.accountHolderName,
      accountNumber: bankForm.accountNumber,
      ifscCode: bankForm.ifscCode.toUpperCase(),
      bankName: bankForm.bankName,
      upiId: bankForm.upiId || null,
    });

    return response.data.bankAccountId;
  };

  const continueFromStep2 = async () => {
    try {
      setLoading(true);
      setError("");
      let bankAccountId = selectedBankAccountId;

      if (method === "bank_transfer") {
        if (accounts.length === 0) {
          bankAccountId = await saveManualBankAccount();
          if (!bankAccountId) return;
        } else if (!bankAccountId) {
          setError("Select a bank account");
          return;
        }
      } else if (!upiRegex.test(bankForm.upiId)) {
        setError("Enter a valid UPI ID");
        return;
      }

      setStep(3);

      if (bankAccountId) {
        setSelectedBankAccountId(bankAccountId);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not continue");
    } finally {
      setLoading(false);
    }
  };

  const confirmWithdraw = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(apiUrl("/wallet/withdraw-to-bank"), {
        userId,
        amount,
        method,
        bankAccountId: method === "bank_transfer" ? selectedBankAccountId : undefined,
        upiId: method === "upi" ? bankForm.upiId : undefined,
        bankDetails:
          method === "bank_transfer" && accounts.length === 0
            ? {
                accountHolderName: bankForm.accountHolderName,
                accountNumber: bankForm.accountNumber,
                ifscCode: bankForm.ifscCode.toUpperCase(),
                bankName: bankForm.bankName,
              }
            : undefined,
      });

      setSuccessMessage(`Reference ID: ${response.data.referenceId} | Email sent to ${user?.email || "your email"}`);
      window.dispatchEvent(new Event("walletUpdated"));
      setTimeout(() => {
        setIsOpen(false);
        setStep(1);
        setSuccessMessage("");
      }, 2500);
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Withdrawal failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepDots = () => (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((index) => (
        <span
          key={index}
          className={`h-2.5 w-2.5 rounded-full ${step >= index ? "bg-orange-500" : "bg-gray-200"}`}
        />
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["bank_transfer", "upi"].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMethod(value)}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold ${method === value ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            {value === "bank_transfer" ? "Bank Transfer" : "UPI"}
          </button>
        ))}
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-gray-700">Amount</span>
        <div className="flex items-center rounded-xl border border-gray-200 focus-within:border-orange-400">
          <span className="pl-4 text-gray-500">₹</span>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            className="w-full rounded-xl px-3 py-3 outline-none"
          />
        </div>
        <p className="text-sm text-gray-500">Available: ₹{formatAmount(availableBalance)}</p>
      </label>

      <div className="flex flex-wrap gap-2">
        {quickAmounts.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(preset)}
            className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            ₹{preset}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={continueFromStep1}
          className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      {method === "bank_transfer" ? (
        accounts.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Select a saved bank account</p>
            <div className="space-y-2">
              {accounts.map((account) => (
                <button
                  key={account._id}
                  type="button"
                  onClick={() => setSelectedBankAccountId(account._id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left ${selectedBankAccountId === account._id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <p className="text-sm font-semibold text-gray-900">{account.bankName}</p>
                  <p className="text-xs text-gray-500">****{account.accountNumberLast4}</p>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowAddBankModal(true)}
              className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Add New Account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-gray-700">Account Holder Name</span>
              <input value={bankForm.accountHolderName} onChange={setField("accountHolderName")} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-gray-700">Account Number</span>
              <input type="password" value={bankForm.accountNumber} onChange={setField("accountNumber")} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400" />
              {bankForm.accountNumber ? <p className="text-xs text-gray-500">Ending in ****{String(bankForm.accountNumber).slice(-4)}</p> : null}
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-gray-700">Confirm Account Number</span>
              <input type="password" value={bankForm.confirmAccountNumber} onChange={setField("confirmAccountNumber")} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-gray-700">IFSC Code</span>
              <input value={bankForm.ifscCode} onChange={setField("ifscCode")} className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-400 ${bankForm.ifscCode && !ifscRegex.test(bankForm.ifscCode.toUpperCase()) ? "border-red-300" : "border-gray-200"}`} />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-gray-700">Bank Name</span>
              <input value={bankForm.bankName} onChange={setField("bankName")} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400" />
            </label>
          </div>
        )
      ) : (
        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">UPI ID</span>
          <input value={bankForm.upiId} onChange={setField("upiId")} className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-400 ${bankForm.upiId && !upiRegex.test(bankForm.upiId) ? "border-red-300" : "border-gray-200"}`} placeholder="name@upi" />
        </label>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={continueFromStep2}
          disabled={loading}
          className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-semibold text-gray-900">Summary</p>
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between"><span>Amount</span><span>₹{formatAmount(amount)}</span></div>
          <div className="flex justify-between"><span>Method</span><span>{method === "bank_transfer" ? "Bank Transfer" : "UPI"}</span></div>
          <div className="flex justify-between"><span>Account</span><span>{method === "bank_transfer" ? (accounts.find((account) => account._id === selectedBankAccountId)?.bankName || bankForm.bankName || "Bank Account") : (bankForm.upiId || "UPI")}</span></div>
        </div>
        <p className="mt-3 text-xs text-gray-500">The money will be credited to your bank account after confirmation.</p>
      </div>

      {successMessage ? <p className="text-sm font-medium text-green-600">{successMessage}</p> : null}

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={confirmWithdraw}
          disabled={loading}
          className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <div className="relative w-full overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-white via-orange-50 to-white p-5 font-['DM_Sans',sans-serif] shadow-sm sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-100/60" />
        <div className="relative flex h-full min-h-[240px] flex-col justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">Withdraw Funds</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">Send money to your bank</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              Open the secure payout gateway, enter your bank or UPI details, verify your PIN, and submit a withdrawal request.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(255,107,53,0.08)]">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-gray-500">Available balance</span>
              <span className="font-semibold text-gray-900">₹{formatAmount(availableBalance)}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-semibold text-gray-600">
              <div className="rounded-xl bg-orange-50 px-3 py-2 text-center">Bank transfer</div>
              <div className="rounded-xl bg-orange-50 px-3 py-2 text-center">UPI payout</div>
              <div className="rounded-xl bg-orange-50 px-3 py-2 text-center">PIN secured</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400">2-3 business days bank processing</p>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Open Withdrawal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Withdraw</p>
            <h3 className="text-xl font-bold text-gray-900">Secure Payout Flow</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mb-5 flex items-center gap-2">{renderStepDots()}</div>
        {step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}
      </div>

      {showAddBankModal ? (
        <AddBankAccountModal
          userId={userId}
          onClose={() => setShowAddBankModal(false)}
          onSuccess={async (response) => {
            await fetchAccounts();
            setSelectedBankAccountId(response.bankAccountId);
          }}
        />
      ) : null}

    </div>
  );
};

export default WithdrawForm;