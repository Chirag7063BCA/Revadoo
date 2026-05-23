// LOCATION: src/components/admin/referrals/ReferralsSettings.jsx

import { useEffect, useState } from "react";
import { Save, CheckCircle, XCircle, Settings } from "lucide-react";

const BASE = "http://localhost:5000";

const DEFAULT = {
  baseReward:      50,
  milestone1Refs:  1,   milestone1Bonus:  50,
  milestone2Refs:  5,   milestone2Bonus:  300,
  milestone3Refs:  15,  milestone3Bonus:  1000,
  milestone4Refs:  50,  milestone4Bonus:  5000,
  autoPayout:      true,
  payoutMethod:    "wallet",
};

const Field = ({ label, hint, children }) => (
  <div>
    <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
    {hint && <p className="mb-1 text-xs text-gray-400">{hint}</p>}
    {children}
  </div>
);

const Input = ({ value, onChange, type = "number", ...rest }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-100 transition-colors"
    {...rest}
  />
);

const ReferralsSettings = () => {
  const [form,   setForm]   = useState(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [toast,  setToast]  = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Load settings ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${BASE}/api/admin/referrals/settings`)
      .then((r) => r.json())
      .then((d) => {
        setForm((prev) => ({
          ...prev,
          baseReward:      d.baseReward      ?? prev.baseReward,
          payoutMethod:    d.payoutMethod    ?? prev.payoutMethod,
          autoPayout:      d.autoPayout      ?? prev.autoPayout,
          milestone1Refs:  d.milestone1Refs  ?? prev.milestone1Refs,
          milestone1Bonus: d.milestone1Bonus ?? prev.milestone1Bonus,
          milestone2Refs:  d.milestone2Refs  ?? prev.milestone2Refs,
          milestone2Bonus: d.milestone2Bonus ?? prev.milestone2Bonus,
          milestone3Refs:  d.milestone3Refs  ?? prev.milestone3Refs,
          milestone3Bonus: d.milestone3Bonus ?? prev.milestone3Bonus,
          milestone4Refs:  d.milestone4Refs  ?? prev.milestone4Refs,
          milestone4Bonus: d.milestone4Bonus ?? prev.milestone4Bonus,
        }));
      })
      .catch(() => {}); // silently fall back to DEFAULT
  }, []);

  const set = (key) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked
      : e.target.type === "number" ? parseFloat(e.target.value) || 0
      : e.target.value;
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  // ── Save settings ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/admin/referrals/settings`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form), // sends every field
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast("Settings saved successfully");
    } catch (err) {
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const MILESTONES = [
    { refsKey: "milestone1Refs", bonusKey: "milestone1Bonus", label: "Starter" },
    { refsKey: "milestone2Refs", bonusKey: "milestone2Bonus", label: "Raider"  },
    { refsKey: "milestone3Refs", bonusKey: "milestone3Bonus", label: "Elite"   },
    { refsKey: "milestone4Refs", bonusKey: "milestone4Bonus", label: "Legend"  },
  ];

  return (
    <>
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.type === "error" ? <XCircle size={15} /> : <CheckCircle size={15} />}
          {toast.msg}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
            <Settings size={15} className="text-orange-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Referral Settings</h2>
            <p className="text-xs text-gray-400">Configure rewards and payout rules</p>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* ── Base reward ── */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Base Reward
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Per Referral Reward (TKN)"
                hint="Awarded to referrer on each successful signup"
              >
                <Input value={form.baseReward} onChange={set("baseReward")} min={0} />
              </Field>
              <Field label="Payout Method">
                <select
                  value={form.payoutMethod}
                  onChange={set("payoutMethod")}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-300"
                >
                  <option value="wallet">Wallet Balance</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </Field>
            </div>
          </div>

          {/* ── Milestone bonuses ── */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Milestone Bonuses
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {MILESTONES.map(({ refsKey, bonusKey, label }) => (
                <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <p className="mb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {label}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Refs needed">
                      <Input value={form[refsKey]} onChange={set(refsKey)} min={1} />
                    </Field>
                    <Field label="Bonus TKN">
                      <Input value={form[bonusKey]} onChange={set(bonusKey)} min={0} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Payout options ── */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Payout Options
            </h3>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={form.autoPayout}
                onChange={set("autoPayout")}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-300"
              />
              <div>
                <p className="text-sm font-semibold text-gray-700">Enable automatic payouts</p>
                <p className="text-xs text-gray-400">
                  Rewards are credited instantly on referral completion
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-100 px-5 py-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={14} className={saving ? "animate-pulse" : ""} />
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ReferralsSettings;