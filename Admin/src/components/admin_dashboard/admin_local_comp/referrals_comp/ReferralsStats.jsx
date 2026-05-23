// LOCATION: src/components/admin/referrals/ReferralsStats.jsx

import { useEffect, useState } from "react";
import { Users, Coins, UserCheck, UserCog } from "lucide-react";

const BASE = "http://localhost:5000";

const CARDS = [
  {
    key:   "totalReferrals",
    label: "Total Referrals",
    icon:  Users,
    style: { icon: "text-orange-600", bg: "bg-orange-50",  border: "border-orange-100", value: "text-orange-600" },
  },
  {
    key:   "activeReferrals",
    label: "Active Referrals",
    icon:  UserCheck,
    style: { icon: "text-green-600",  bg: "bg-green-50",   border: "border-green-100",  value: "text-green-700" },
  },
  {
    key:   "totalEarnings",
    label: "Total TKN Paid Out",
    icon:  Coins,
    style: { icon: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-100",   value: "text-blue-700"  },
    suffix: " TKN",
  },
  {
    key:   "uniqueReferrers",
    label: "Active Referrers",
    icon:  UserCog,
    style: { icon: "text-purple-600", bg: "bg-purple-50",  border: "border-purple-100", value: "text-purple-700"},
  },
];

const ReferralsStats = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/admin/referrals/stats`)
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon, style, suffix }) => (
        <div
          key={key}
          className={`rounded-lg border ${style.border} bg-white p-4 shadow-sm`}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${style.bg}`}>
              <Icon size={15} className={style.icon} />
            </div>
          </div>

          {loading ? (
            <div className="h-7 w-20 animate-pulse rounded bg-gray-100" />
          ) : (
            <p className={`text-2xl font-bold ${style.value}`}>
              {stats?.[key] !== undefined
                ? stats[key].toLocaleString() + (suffix || "")
                : "—"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReferralsStats;