// LOCATION: src/components/admin/referrals/ReferralsHeader.jsx

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

const BASE = "http://localhost:5000";

const ReferralsHeader = () => {
  const [total,   setTotal]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/admin/referrals/stats`)
      .then((r) => r.json())
      .then((d) => { setTotal(d.totalReferrals ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
          <Users size={20} className="text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Referral Management</h1>
          <p className="text-sm text-gray-400">Manage all referrals, payouts and settings</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
        <span className="text-sm text-gray-500">Total Referrals:</span>
        {loading ? (
          <span className="h-4 w-14 animate-pulse rounded bg-gray-100 inline-block" />
        ) : (
          <span className="text-lg font-bold text-orange-500">
            {total !== null ? total.toLocaleString() : "—"}
          </span>
        )}
      </div>
    </div>
  );
};

export default ReferralsHeader;