// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_settings_comp/SettingsSecurity.jsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Lock, Trash2, Eye, EyeOff,
  Loader2, CheckCircle2, AlertCircle, ChevronRight,
} from "lucide-react";
import SettingsModal from "./SettingsModal";
import { apiUrl } from "../../../../services/apiConfig";

// ── Password input component ──────────────────────────
const PwInput = ({ label, value, show, onToggle, onChange, placeholder = "••••••••" }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">{label}</label>
    <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white px-4 py-3 focus-within:border-orange-400 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] transition-all">
      <Lock size={14} className="text-orange-400 shrink-0" />
      <input type={show ? "text" : "password"} value={value} onChange={onChange}
        className="flex-1 bg-transparent text-sm font-semibold text-black outline-none placeholder:text-gray-300 min-w-0"
        placeholder={placeholder} />
      <button type="button" onClick={onToggle} className="text-gray-300 hover:text-orange-400 transition-colors shrink-0">
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  </div>
);

// ── Step indicator ────────────────────────────────────
const StepDot = ({ step, current, label }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all"
      style={{
        background: step < current ? "#22c55e" : step === current ? "#ef4444" : "#f3f4f6",
        color:      step <= current ? "#fff" : "#9ca3af",
      }}
    >
      {step < current ? <CheckCircle2 size={14} /> : step}
    </div>
    <span className="text-[9px] font-bold text-gray-400 text-center">{label}</span>
  </div>
);

const DELETE_REASONS = [
  "I no longer use this platform",
  "I found a better alternative",
  "Privacy concerns",
  "Too many notifications",
  "Technical issues",
  "Other reason",
];

const SettingsSecurity = () => {
  // ── Change Password state ─────────────────────────
  const [pwOpen,    setPwOpen]    = useState(false);
  const [showOld,   setShowOld]   = useState(false);
  const [showNew,   setShowNew]   = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [pwForm,    setPwForm]    = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [pwSaving,  setPwSaving]  = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError,   setPwError]   = useState("");

  // ── Delete Account state ──────────────────────────
  const [delOpen,      setDelOpen]      = useState(false);
  const [delStep,      setDelStep]      = useState(1);   // 1, 2, 3
  const [delPassword,  setDelPassword]  = useState("");
  const [showDelPw,    setShowDelPw]    = useState(false);
  const [delPwError,   setDelPwError]   = useState("");
  const [delPwLoading, setDelPwLoading] = useState(false);
  const [delReason,    setDelReason]    = useState("");
  const [delOther,     setDelOther]     = useState("");
  const [delConfirm,   setDelConfirm]   = useState("");
  const [deleting,     setDeleting]     = useState(false);
  const [delError,     setDelError]     = useState("");

  const openDelModal = () => {
    setDelStep(1);
    setDelPassword(""); setDelPwError(""); setShowDelPw(false);
    setDelReason(""); setDelOther("");
    setDelConfirm(""); setDelError("");
    setDelOpen(true);
  };

  // ── Step 1 — verify password ──────────────────────
  const handleStep1 = async () => {
    if (!delPassword.trim()) { setDelPwError("Please enter your current password."); return; }
    setDelPwLoading(true); setDelPwError("");
    try {
      const token = localStorage.getItem("token");
      // Verify password by hitting change-password with same old+new
      // We use a dedicated verify endpoint — or re-use login to verify
      const res = await fetch(apiUrl("/auth/verify-password"), {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ password: delPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setDelPwError(data.message || "Incorrect password."); return; }
      setDelStep(2);
    } catch { setDelPwError("Network error. Try again."); }
    finally { setDelPwLoading(false); }
  };

  // ── Step 2 — reason ───────────────────────────────
  const handleStep2 = () => {
    if (!delReason) { setDelPwError("Please select a reason."); return; }
    if (delReason === "Other reason" && !delOther.trim()) { setDelPwError("Please describe your reason."); return; }
    setDelPwError("");
    setDelStep(3);
  };

  // ── Step 3 — final delete ─────────────────────────
  const handleDeleteAccount = async () => {
    if (delConfirm !== "DELETE") { setDelError('Type "DELETE" to confirm.'); return; }
    setDeleting(true); setDelError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/auth/delete-account"), {
        method:  "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: delReason === "Other reason" ? delOther : delReason,
        }),
      });
      if (!res.ok) { const d = await res.json(); setDelError(d.message || "Failed."); return; }
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch { setDelError("Network error. Try again."); }
    finally { setDeleting(false); }
  };

  // ── Change password handler ───────────────────────
  const handlePasswordChange = async () => {
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirm) { setPwError("All fields are required."); return; }
    if (pwForm.newPassword !== pwForm.confirm) { setPwError("Passwords do not match."); return; }
    if (pwForm.newPassword.length < 6) { setPwError("At least 6 characters required."); return; }
    setPwSaving(true); setPwError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/auth/change-password"), {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.message || "Failed."); return; }
      setPwSuccess(true);
      setPwForm({ oldPassword: "", newPassword: "", confirm: "" });
      setTimeout(() => { setPwOpen(false); setPwSuccess(false); }, 1200);
    } catch { setPwError("Network error. Try again."); }
    finally { setPwSaving(false); }
  };

  return (
    <>
      <style>{`
        @keyframes blobPw  { 0%,100%{opacity:.06;transform:scale(1)} 50%{opacity:.12;transform:scale(1.2)} }
        @keyframes blobDel { 0%,100%{opacity:.06;transform:scale(1)} 50%{opacity:.10;transform:scale(1.2)} }
      `}</style>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* ── CARD 1 — Change Password ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 160 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-orange-100 bg-white shadow-sm p-5 sm:p-6"
        >
          <div className="pointer-events-none absolute -left-8 -bottom-8 h-36 w-36 rounded-full bg-orange-200 blur-3xl"
            style={{ animation: "blobPw 4.5s ease-in-out infinite" }} />
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

          <div className="relative z-10 flex flex-col h-full gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 border border-orange-200 shrink-0">
                <Lock size={16} className="text-orange-500" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-500">Security</p>
                <p className="text-sm font-black text-black">Change Password</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Keep your account safe by regularly updating your password. Use at least 6 characters.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setPwError(""); setPwSuccess(false); setPwForm({ oldPassword: "", newPassword: "", confirm: "" }); setPwOpen(true); }}
              className="mt-auto w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black text-white"
              style={{ background: "linear-gradient(135deg,#ea580c,#f97316)", boxShadow: "0 0 16px rgba(249,115,22,0.3)" }}
            >
              <Lock size={14} /> Update Password
            </motion.button>
          </div>
        </motion.div>

        {/* ── CARD 2 — Delete Account ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 160 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-red-100 bg-white shadow-sm p-5 sm:p-6"
        >
          <div className="pointer-events-none absolute -right-8 -bottom-8 h-36 w-36 rounded-full bg-red-200 blur-3xl"
            style={{ animation: "blobDel 4s ease-in-out infinite" }} />
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-300 to-transparent" />

          <div className="relative z-10 flex flex-col h-full gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 border border-red-200 shrink-0">
                <Trash2 size={16} className="text-red-500" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">Danger Zone</p>
                <p className="text-sm font-black text-black">Delete Account</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Permanently delete your account and all data including tokens and referrals. This cannot be undone.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={openDelModal}
              className="mt-auto w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black text-white"
              style={{ background: "#ef4444", boxShadow: "0 0 16px rgba(239,68,68,0.25)" }}
            >
              <Trash2 size={14} /> Delete Account
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ════ Change Password Modal ════ */}
      <SettingsModal open={pwOpen} onClose={() => setPwOpen(false)} title="Change Password">
        <div className="space-y-4">
          <PwInput label="Current Password" value={pwForm.oldPassword} show={showOld}  onToggle={() => setShowOld(v => !v)}  onChange={e => setPwForm(f => ({ ...f, oldPassword: e.target.value }))} />
          <PwInput label="New Password"     value={pwForm.newPassword} show={showNew}  onToggle={() => setShowNew(v => !v)}  onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} />
          <PwInput label="Confirm Password" value={pwForm.confirm}     show={showConf} onToggle={() => setShowConf(v => !v)} onChange={e => setPwForm(f => ({ ...f, confirm:     e.target.value }))} />
          {pwError   && <div className="flex items-center gap-2 rounded-xl border border-red-100   bg-red-50   px-3 py-2"><AlertCircle  size={13} className="text-red-400   shrink-0" /><p className="text-xs text-red-500   font-semibold">{pwError}</p></div>}
          {pwSuccess && <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-3 py-2"><CheckCircle2 size={13} className="text-green-500 shrink-0" /><p className="text-xs text-green-600 font-semibold">Password updated!</p></div>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handlePasswordChange} disabled={pwSaving || pwSuccess}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#ea580c,#f97316)", boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}>
            {pwSaving ? <><Loader2 size={15} className="animate-spin" />Updating…</> : pwSuccess ? <><CheckCircle2 size={15} />Updated!</> : "Update Password"}
          </motion.button>
        </div>
      </SettingsModal>

      {/* ════ Delete Account Modal — 3 steps ════ */}
      <SettingsModal open={delOpen} onClose={() => setDelOpen(false)} title="Delete Account">
        <div className="space-y-5">

          {/* ── Step indicators ── */}
          <div className="flex items-center justify-center gap-2">
            <StepDot step={1} current={delStep} label="Verify"  />
            <div className="flex-1 h-0.5 rounded-full bg-gray-100 mx-1" />
            <StepDot step={2} current={delStep} label="Reason"  />
            <div className="flex-1 h-0.5 rounded-full bg-gray-100 mx-1" />
            <StepDot step={3} current={delStep} label="Confirm" />
          </div>

          <AnimatePresence mode="wait">

            {/* ══ STEP 1 — Verify Password ══ */}
            {delStep === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-4">
                <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
                  <p className="text-xs font-black text-orange-600 mb-0.5">🔐 Verify it's you</p>
                  <p className="text-xs text-gray-500">Enter your current password to continue.</p>
                </div>
                <PwInput
                  label="Current Password"
                  value={delPassword}
                  show={showDelPw}
                  onToggle={() => setShowDelPw(v => !v)}
                  onChange={e => setDelPassword(e.target.value)}
                />
                {delPwError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2">
                    <AlertCircle size={13} className="text-red-400 shrink-0" />
                    <p className="text-xs text-red-500 font-semibold">{delPwError}</p>
                  </div>
                )}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleStep1} disabled={delPwLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black text-white disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#ea580c,#f97316)", boxShadow: "0 0 16px rgba(249,115,22,0.3)" }}>
                  {delPwLoading ? <><Loader2 size={15} className="animate-spin" />Verifying…</> : <>Continue <ChevronRight size={15} /></>}
                </motion.button>
              </motion.div>
            )}

            {/* ══ STEP 2 — Reason ══ */}
            {delStep === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-4">
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-xs font-black text-red-600 mb-0.5">😢 We're sorry to see you go</p>
                  <p className="text-xs text-gray-500">Please tell us why you're leaving — your feedback helps us improve.</p>
                </div>

                <div className="space-y-2">
                  {DELETE_REASONS.map((reason) => (
                    <motion.button
                      key={reason}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setDelReason(reason); setDelPwError(""); }}
                      className="w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all"
                      style={{
                        borderColor: delReason === reason ? "#ef4444"   : "#f3f4f6",
                        background:  delReason === reason ? "#fef2f2"   : "#fafafa",
                      }}
                    >
                      <span className="text-sm font-semibold" style={{ color: delReason === reason ? "#dc2626" : "#374151" }}>
                        {reason}
                      </span>
                      {delReason === reason && <CheckCircle2 size={15} className="text-red-500 shrink-0" />}
                    </motion.button>
                  ))}
                </div>

                {/* Other — text input */}
                {delReason === "Other reason" && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                    <textarea
                      rows={3}
                      value={delOther}
                      onChange={e => setDelOther(e.target.value)}
                      placeholder="Tell us your reason…"
                      className="w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-black outline-none focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)] transition-all placeholder:font-normal placeholder:text-gray-300 resize-none"
                    />
                  </motion.div>
                )}

                {delPwError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2">
                    <AlertCircle size={13} className="text-red-400 shrink-0" />
                    <p className="text-xs text-red-500 font-semibold">{delPwError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setDelStep(1)}
                    className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-sm font-black text-gray-500 hover:bg-gray-100 transition-all">
                    ← Back
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleStep2}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black text-white"
                    style={{ background: "#ef4444", boxShadow: "0 0 16px rgba(239,68,68,0.25)" }}>
                    Continue <ChevronRight size={15} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 3 — Final Confirm ══ */}
            {delStep === 3 && (
              <motion.div key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-4">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
                  <p className="text-sm font-black text-red-600 mb-1">⚠️ This is permanent and irreversible</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    All your tokens, referrals, tasks and account data will be <strong>deleted forever</strong>. You cannot undo this.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">
                    Type <span className="text-red-500 font-black">DELETE</span> to permanently delete
                  </label>
                  <input
                    type="text"
                    value={delConfirm}
                    onChange={e => setDelConfirm(e.target.value)}
                    placeholder='Type "DELETE" here'
                    className="w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-black text-black outline-none focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)] transition-all placeholder:font-normal placeholder:text-gray-300"
                  />
                </div>

                {delError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2">
                    <AlertCircle size={13} className="text-red-400 shrink-0" />
                    <p className="text-xs text-red-500 font-semibold">{delError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setDelStep(2)}
                    className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-sm font-black text-gray-500 hover:bg-gray-100 transition-all">
                    ← Back
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleDeleteAccount}
                    disabled={deleting || delConfirm !== "DELETE"}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black text-white disabled:opacity-40 transition-all"
                    style={{ background: delConfirm === "DELETE" ? "#ef4444" : "#d1d5db" }}>
                    {deleting ? <><Loader2 size={15} className="animate-spin" />Deleting…</> : <><Trash2 size={15} />Delete Forever</>}
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </SettingsModal>
    </>
  );
};

export default SettingsSecurity;