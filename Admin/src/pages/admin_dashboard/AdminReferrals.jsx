// LOCATION: src/components/admin/referrals/AdminReferralsPage.jsx
//
// Composes all 5 admin referral components.
// Add to your admin router:
//   <Route path="/admin/referrals" element={<AdminReferralsPage />} />

import { useState } from "react";
import ReferralsHeader       from "../../components/admin_dashboard/admin_local_comp/referrals_comp/ReferralsHeader";
import ReferralsStats        from "../../components/admin_dashboard/admin_local_comp/referrals_comp/ReferralsStats";
import ReferralsQuickActions from "../../components/admin_dashboard/admin_local_comp/referrals_comp/ReferralsQuickActions";
import ReferralsTable        from "../../components/admin_dashboard/admin_local_comp/referrals_comp/ReferralsTable";
import ReferralsSettings     from "../../components/admin_dashboard/admin_local_comp/referrals_comp/ReferralsSettings";

const AdminReferralsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((k) => k + 1);
  const [activeTab, setActiveTab] = useState("referrals");

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <ReferralsHeader key={`hdr-${refreshKey}`} />
        <ReferralsStats  key={`stats-${refreshKey}`} />
        <ReferralsQuickActions onRefresh={refresh} />

        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 w-fit shadow-sm">
          {[{ id: "referrals", label: "Referrals Table" }, { id: "settings", label: "Settings" }].map(({ id, label }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeTab === id ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >{label}</button>
          ))}
        </div>

        {activeTab === "referrals" && <ReferralsTable refreshKey={refreshKey} />}
        {activeTab === "settings"  && <ReferralsSettings />}
      </div>
    </div>
  );
};

export default AdminReferralsPage;