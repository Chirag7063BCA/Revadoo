// LOCATION: src/components/user_dashboard/user_local_comp/dashboard_settings_comp/SettingsPreferences.jsx

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, CheckCircle2 } from "lucide-react";

const LANGUAGES = ["English","Hindi","Spanish","French","German","Arabic","Portuguese","Japanese"];
const REGIONS   = ["India","United States","United Kingdom","Canada","Australia","Germany","Japan","UAE"];

const SelectField = ({ icon: Icon, label, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">{label}</label>
    <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white px-4 py-3 focus-within:border-orange-400 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] transition-all">
      <Icon size={14} className="text-orange-400 shrink-0" />
      <select value={value} onChange={onChange} className="flex-1 bg-transparent text-sm font-semibold text-black outline-none cursor-pointer min-w-0">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  </div>
);

const SettingsPreferences = () => {
  const [language, setLanguage] = useState("English");
  const [region,   setRegion]   = useState("India");
  const [saved,    setSaved]    = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <>
      <style>{`@keyframes blobPref{0%,100%{opacity:.06;transform:scale(1)}50%{opacity:.12;transform:scale(1.2)}}`}</style>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 160 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-orange-100 bg-white shadow-sm p-5 sm:p-6"
      >
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-orange-200 blur-3xl" style={{ animation: "blobPref 4s ease-in-out infinite" }} />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-orange-100 border border-orange-200 shrink-0">
              <Globe size={14} className="text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-500">Preferences</p>
              <p className="text-xs sm:text-sm font-black text-black">Language & Region</p>
            </div>
          </div>

          {/* responsive grid — stack on mobile, 2 col on sm+ */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField icon={Globe}  label="Language" value={language} onChange={e=>setLanguage(e.target.value)} options={LANGUAGES} />
            <SelectField icon={MapPin} label="Region"   value={region}   onChange={e=>setRegion(e.target.value)}   options={REGIONS}   />
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black text-white transition-all"
            style={{ background: saved ? "#22c55e" : "linear-gradient(135deg,#ea580c,#f97316)", boxShadow: saved ? "0 0 20px rgba(34,197,94,0.3)" : "0 0 20px rgba(249,115,22,0.3)" }}>
            {saved ? <><CheckCircle2 size={15} />Saved!</> : "Save Preferences"}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default SettingsPreferences;