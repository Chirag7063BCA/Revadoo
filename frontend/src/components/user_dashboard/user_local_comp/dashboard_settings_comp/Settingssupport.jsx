// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_settings_comp/SettingsSupport.jsx

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, MessageSquare, Phone, ChevronDown, ChevronUp,
  Send, Loader2, CheckCircle2, AlertCircle, Paperclip, X,
  Image, FileText, File, Mail
} from "lucide-react";
import SettingsModal from "./Settingsmodal";
import { apiUrl } from "../../../../services/apiConfig";

const FAQS = [
  { q: "How do I earn tokens?",                ans: "Complete tasks, refer friends using your referral code, and reach milestones to earn tokens." },
  { q: "How does the referral system work?",   ans: "Share your unique referral code. When a friend signs up, you earn 50+ tokens automatically." },
  { q: "How do I redeem my tokens?",           ans: "Go to the Referral section and use the Redeem option to exchange tokens for perks and rewards." },
  { q: "Can I change my username?",            ans: "Yes — go to Settings and update your profile details." },
  { q: "What happens if I delete my account?", ans: "All your data including tokens, referrals and tasks will be permanently deleted." },
];

const FAQItem = ({ faq, idx }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 }} className="rounded-2xl border border-gray-100 overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-4 bg-gray-50 hover:bg-orange-50 transition-colors text-left gap-3">
        <span className="text-sm font-bold text-black flex-1">{faq.q}</span>
        {open ? <ChevronUp size={15} className="text-orange-500 shrink-0" />
              : <ChevronDown size={15} className="text-gray-400 shrink-0" />}
      </button>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="px-4 py-3.5 bg-white border-t border-gray-100">
          <p className="text-sm text-gray-500 leading-relaxed">{faq.ans}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

const FileIcon = ({ type }) => {
  if (type.startsWith("image/")) return <Image size={15} className="text-orange-400" />;
  if (type === "application/pdf") return <FileText size={15} className="text-red-400" />;
  return <File size={15} className="text-gray-400" />;
};

const SettingsSupport = () => {
  const [helpOpen,    setHelpOpen]    = useState(false);
  const [fbOpen,      setFbOpen]      = useState(false);
  const [fbForm,      setFbForm]      = useState({ subject: "", message: "" });
  const [fbSending,   setFbSending]   = useState(false);
  const [fbSuccess,   setFbSuccess]   = useState(false);
  const [fbError,     setFbError]     = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [ctForm,      setCtForm]      = useState({ name: "", email: "", message: "" });
  const [ctFiles,     setCtFiles]     = useState([]);
  const [ctSending,   setCtSending]   = useState(false);
  const [ctSuccess,   setCtSuccess]   = useState(false);
  const [ctError,     setCtError]     = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (ctFiles.length + selected.length > 5) { setCtError("Max 5 files."); return; }
    if (selected.find(f => f.size > 10 * 1024 * 1024)) { setCtError("Max 10MB per file."); return; }
    setCtFiles(prev => [...prev, ...selected]);
    setCtError("");
    e.target.value = "";
  };

  const removeFile = (idx) => setCtFiles(p => p.filter((_, i) => i !== idx));

  const formatSize = (b) => b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(1)}KB` : `${(b/1048576).toFixed(1)}MB`;

  // ── Feedback ──────────────────────────────────────
  const handleFeedback = async () => {
    if (!fbForm.subject.trim() || !fbForm.message.trim()) { setFbError("All fields required."); return; }
    setFbSending(true); setFbError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/feedback"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(fbForm),
      });
      const data = await res.json();
      if (!res.ok) { setFbError(data.message || "Failed."); return; }
      setFbSuccess(true);
      setFbForm({ subject: "", message: "" });
      setTimeout(() => { setFbOpen(false); setFbSuccess(false); }, 1500);
    } catch { setFbError("Network error."); }
    finally { setFbSending(false); }
  };

  // ── Contact — sends email to Revadoo + confirmation to user ──
  const handleContact = async () => {
    if (!ctForm.name.trim() || !ctForm.email.trim() || !ctForm.message.trim()) {
      setCtError("All fields are required."); return;
    }
    if (!/^\S+@\S+\.\S+$/.test(ctForm.email)) {
      setCtError("Enter a valid email address."); return;
    }
    setCtSending(true); setCtError("");
    try {
      const formData = new FormData();
      formData.append("name",    ctForm.name);
      formData.append("email",   ctForm.email);
      formData.append("message", ctForm.message);
      ctFiles.forEach(f => formData.append("attachments", f));

      const res  = await fetch(apiUrl("/contact"), {
        method: "POST",
        body:   formData,
      });
      const data = await res.json();
      if (!res.ok) { setCtError(data.message || "Failed."); return; }
      setCtSuccess(true);
      setCtForm({ name: "", email: "", message: "" });
      setCtFiles([]);
      setTimeout(() => { setContactOpen(false); setCtSuccess(false); }, 2000);
    } catch { setCtError("Network error. Try again."); }
    finally { setCtSending(false); }
  };

  const CARDS = [
    { Icon: HelpCircle,    label: "Help Center",     sub: "Browse FAQs",
      onClick: () => setHelpOpen(true) },
    { Icon: MessageSquare, label: "Send Feedback",   sub: "Share thoughts",
      onClick: () => { setFbError(""); setFbSuccess(false); setFbForm({ subject: "", message: "" }); setFbOpen(true); } },
    { Icon: Phone,         label: "Contact Support", sub: "Send us a message",
      onClick: () => { setCtError(""); setCtSuccess(false); setCtForm({ name: "", email: "", message: "" }); setCtFiles([]); setContactOpen(true); } },
  ];

  const inputCls = "w-full rounded-2xl border border-orange-200 bg-white px-4 py-3.5 text-sm font-semibold text-black outline-none focus:border-orange-400 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] transition-all placeholder:font-normal placeholder:text-gray-300";

  return (
    <>
      <style>{`@keyframes blobSup{0%,100%{opacity:.06;transform:scale(1)}50%{opacity:.12;transform:scale(1.2)}}`}</style>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 160 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-orange-100 bg-white shadow-sm p-5 sm:p-6"
      >
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-orange-200 blur-3xl"
          style={{ animation: "blobSup 4s ease-in-out infinite" }} />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 border border-orange-200 shrink-0">
              <HelpCircle size={15} className="text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-500">Support</p>
              <p className="text-sm font-black text-black">Help & Feedback</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CARDS.map(({ Icon, label, sub, onClick }, i) => (
              <motion.button key={label}
                initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 180 }}
                whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={onClick}
                className="flex flex-row sm:flex-col items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/50 p-4 sm:p-5 text-left sm:text-center hover:border-orange-300 hover:bg-orange-50 transition-all"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-orange-200 shadow-sm">
                  <Icon size={18} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-black">{label}</p>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">{sub}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Help Center ── */}
      <SettingsModal open={helpOpen} onClose={() => setHelpOpen(false)} title="Help Center">
        <div className="space-y-2">
          <p className="text-sm text-gray-400 mb-4">Find answers to common questions below.</p>
          {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} idx={i} />)}
        </div>
      </SettingsModal>

      {/* ── Feedback ── */}
      <SettingsModal open={fbOpen} onClose={() => setFbOpen(false)} title="Send Feedback">
        <div className="space-y-4">
          {fbSuccess ? (
            <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border border-green-200">
                <CheckCircle2 size={28} className="text-green-500" />
              </div>
              <p className="text-base font-black text-black">Feedback Received!</p>
              <p className="text-sm text-gray-400">Thank you — we'll review it shortly.</p>
            </motion.div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">Subject</label>
                <input className={inputCls} placeholder="What's on your mind?" value={fbForm.subject} onChange={e => setFbForm(f => ({ ...f, subject: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">Message</label>
                <textarea rows={5} className={`${inputCls} resize-none`} placeholder="Tell us more…" value={fbForm.message} onChange={e => setFbForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              {fbError && <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5"><AlertCircle size={14} className="text-red-400 shrink-0" /><p className="text-sm text-red-500 font-semibold">{fbError}</p></div>}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleFeedback} disabled={fbSending}
                className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#ea580c,#f97316)", boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}>
                {fbSending ? <><Loader2 size={16} className="animate-spin" />Submitting…</> : <><Send size={16} />Submit Feedback</>}
              </motion.button>
            </>
          )}
        </div>
      </SettingsModal>

      {/* ── Contact Support ── */}
      <SettingsModal open={contactOpen} onClose={() => setContactOpen(false)} title="Contact Support">
        {ctSuccess ? (
          <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 border border-green-200">
              <CheckCircle2 size={36} className="text-green-500" />
            </div>
            <p className="text-lg font-black text-black">Message Sent! 🎉</p>
            <div className="flex flex-col gap-1.5 text-sm text-gray-500">
              <p>✅ We received your message</p>
              <p>✅ Check your inbox for confirmation</p>
              <p>We'll reply to your email soon.</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* info banner */}
            <div className="flex items-start gap-2.5 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
              <Mail size={14} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">
                We'll receive your message and you'll get a <strong>confirmation email</strong> in your inbox.
              </p>
            </div>

            {/* name + email */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">Your Name</label>
                <input className={inputCls} placeholder="Full name" value={ctForm.name} onChange={e => setCtForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">Your Email</label>
                <input type="email" className={inputCls} placeholder="your@email.com" value={ctForm.email} onChange={e => setCtForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">Message</label>
              <textarea rows={5} className={`${inputCls} resize-none`} placeholder="Describe your issue in detail…" value={ctForm.message} onChange={e => setCtForm(f => ({ ...f, message: e.target.value }))} />
            </div>

            {/* file upload */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">
                Attachments <span className="normal-case font-normal text-gray-300">(optional · max 5 · 10MB each)</span>
              </label>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 px-4 py-5 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-orange-200 shadow-sm">
                  <Paperclip size={18} className="text-orange-500" />
                </div>
                <p className="text-sm font-black text-black">Click to attach files or screenshots</p>
                <p className="text-xs text-gray-400">Images, PDF, DOC, TXT — up to 10MB each</p>
              </motion.div>
              <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.zip" className="hidden" onChange={handleFileChange} />
              <AnimatePresence>
                {ctFiles.map((file, idx) => (
                  <motion.div key={`${file.name}-${idx}`}
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-3"
                  >
                    {file.type.startsWith("image/")
                      ? <img src={URL.createObjectURL(file)} alt={file.name} className="h-10 w-10 rounded-xl object-cover border border-orange-100 shrink-0" />
                      : <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-100 shrink-0"><FileIcon type={file.type} /></div>}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => removeFile(idx)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 transition-all">
                      <X size={12} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {ctError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <p className="text-sm text-red-500 font-semibold">{ctError}</p>
              </div>
            )}

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleContact} disabled={ctSending}
              className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#ea580c,#f97316)", boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}>
              {ctSending
                ? <><Loader2 size={16} className="animate-spin" />Sending…</>
                : <><Send size={16} />Send Message{ctFiles.length > 0 ? ` + ${ctFiles.length} file${ctFiles.length > 1 ? "s" : ""}` : ""}</>}
            </motion.button>
          </div>
        )}
      </SettingsModal>
    </>
  );
};

export default SettingsSupport;