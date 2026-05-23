// LOCATION: src/components/admin_dashboard/admin_local_comp/leaderboard_comp/LeaderboardSettings.jsx
import { useEffect, useState } from "react";
import { Settings, Save } from "lucide-react";

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
        ${checked ? "bg-orange-500" : "bg-gray-200"}`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200
        ${checked ? "left-6" : "left-1"}`} />
    </button>
    <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{label}</span>
  </label>
);

const RewardInput = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
      <input
        type="number"
        value={value}
        min={0}
        step={0.1}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-black outline-none
          focus:border-orange-400 hover:border-gray-300 transition-colors"
      />
    </div>
  </div>
);

const LeaderboardSettings = ({ settings = null, onSave = () => {} }) => {
  const [form, setForm] = useState({
    autoResetDaily  : true,
    autoResetWeekly : true,
    autoResetMonthly: true,
    dailyReward     : 10,
    weeklyReward    : 50,
    monthlyReward   : 200,
  });
  const [saving, setSaving] = useState(false);
  const [dirty,  setDirty]  = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        autoResetDaily  : settings.autoResetDaily   ?? true,
        autoResetWeekly : settings.autoResetWeekly  ?? true,
        autoResetMonthly: settings.autoResetMonthly ?? true,
        dailyReward     : settings.dailyReward       ?? 10,
        weeklyReward    : settings.weeklyReward      ?? 50,
        monthlyReward   : settings.monthlyReward     ?? 200,
      });
      setDirty(false);
    }
  }, [settings]);

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setDirty(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
          <Settings className="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <h2 className="font-black text-black text-base">Leaderboard Settings</h2>
          <p className="text-xs text-gray-400">Auto-reset schedules &amp; leader reward values</p>
        </div>
        {dirty && (
          <span className="ml-auto text-xs font-bold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xs font-black text-black uppercase tracking-widest mb-4">Auto Reset</h3>
          <div className="space-y-4">
            <Toggle checked={form.autoResetDaily}   onChange={(v) => update("autoResetDaily",   v)} label="Reset daily leaderboard at 00:00"          />
            <Toggle checked={form.autoResetWeekly}  onChange={(v) => update("autoResetWeekly",  v)} label="Reset weekly leaderboard every Monday"      />
            <Toggle checked={form.autoResetMonthly} onChange={(v) => update("autoResetMonthly", v)} label="Reset monthly leaderboard on 1st of month"  />
          </div>
        </div>
        <div>
          <h3 className="text-xs font-black text-black uppercase tracking-widest mb-4">Leader Rewards</h3>
          <div className="space-y-3">
            <RewardInput label="Daily Leader"   value={form.dailyReward}   onChange={(v) => update("dailyReward",   v)} />
            <RewardInput label="Weekly Leader"  value={form.weeklyReward}  onChange={(v) => update("weeklyReward",  v)} />
            <RewardInput label="Monthly Leader" value={form.monthlyReward} onChange={(v) => update("monthlyReward", v)} />
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-black
            hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default LeaderboardSettings;