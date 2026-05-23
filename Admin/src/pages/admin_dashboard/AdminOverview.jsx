import OverviewHeader from "../../components/admin_dashboard/admin_local_comp/overview_comp/OverviewHeader";
import StatsCards from "../../components/admin_dashboard/admin_local_comp/overview_comp/StatsCards";
import RecentUsers from "../../components/admin_dashboard/admin_local_comp/overview_comp/RecentUsers";
import RecentTransactions from "../../components/admin_dashboard/admin_local_comp/overview_comp/RecentTransactions";
import SystemHealth from "../../components/admin_dashboard/admin_local_comp/overview_comp/SystemHealth";
import QuickActions from "../../components/admin_dashboard/admin_local_comp/overview_comp/QuickActions";

const AdminOverview = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <OverviewHeader />
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentUsers />
        <RecentTransactions />
      </div>
      <SystemHealth />
      <QuickActions />
    </div>
  );
};

export default AdminOverview;