// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_settings_comp/SettingsNotifications.jsx

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, ListTodo, Gift, CheckCircle2 } from "lucide-react";

const NOTIFS = [
  { key: "email",   Icon: Mail,     label: "Email Notifications", sub: "Receive updates via email"        },
  { key: "tasks",   Icon: ListTodo, label: "Task Updates",         sub: "Get notified on task completions" },
  { key: "rewards", Icon: Gift,     label: "Reward Alerts",        sub: "Be notified when you earn tokens" },
];

const Toggle = ({ checked, onChange }) => (
  <button onClick={onChange}
    className="relative flex h-6 w-11 shrink-0 items-center rounded-full transition-all duration-300"
    style={{ background: checked ? "#f97316" : "#e5e7eb" }}>
    <motion.div animate={{ x: checked ? 22 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="h-5 w-5 rounded-full bg-white shadow-sm" />
  </button>
);

const SettingsNotifications = () => {
  const [prefs, setPrefs] = useState({ email: true, tasks: true, rewards: false });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <>
      <style>{`@keyframes blobNotif{0%,100%{opacity:.06;transform:scale(1)}50%{opacity:.12;transform:scale(1.2)}}`}</style>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 160 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-orange-100 bg-white shadow-sm p-5 sm:p-6"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-200 blur-3xl" style={{ animation: "blobNotif 4.5s ease-in-out infinite" }} />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-orange-100 border border-orange-200 shrink-0">
              <Bell size={14} className="text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-500">Notifications</p>
              <p className="text-xs sm:text-sm font-black text-black">Alert Preferences</p>
            </div>
          </div>

          <div className="space-y-3">
            {NOTIFS.map(({ key, Icon, label, sub }, i) => (
              <motion.div key={key}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 sm:py-3.5 hover:border-orange-100 hover:bg-orange-50/50 transition-all gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm">
                    <Icon size={13} className="text-orange-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-black text-black truncate">{label}</p>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">{sub}</p>
                  </div>
                </div>
                <Toggle checked={prefs[key]} onChange={() => toggle(key)} />
              </motion.div>
            ))}
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black text-white transition-all"
            style={{ background: saved ? "#22c55e" : "linear-gradient(135deg,#ea580c,#f97316)", boxShadow: saved ? "0 0 20px rgba(34,197,94,0.3)" : "0 0 20px rgba(249,115,22,0.3)" }}>
            {saved ? <><CheckCircle2 size={15} />Saved!</> : "Save Notifications"}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default SettingsNotifications;