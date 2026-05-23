import React, { useState } from "react";
import WelcomeLeft from "../../components/user_dashboard/user_local_comp/dashboard_page_comp/WelcomeLeft";
import WelcomeRight from "../../components/user_dashboard/user_local_comp/dashboard_page_comp/WelcomeRight";
import StatsLeft from "../../components/user_dashboard/user_local_comp/dashboard_page_comp/StatsLeft";
import StatsRight from "../../components/user_dashboard/user_local_comp/dashboard_page_comp/StatsRight";
import RecentTransactions from "../../components/user_dashboard/user_local_comp/dashboard_page_comp/RecentTransactions";
import QuickActions from "../../components/user_dashboard/user_local_comp/dashboard_page_comp/QuickActions";
import StatisticsGraph from "../../components/user_dashboard/user_local_comp/dashboard_page_comp/StatisticsGraph";
import UserProfileOverview from "../../components/user_dashboard/user_local_comp/dashboard_page_comp/UserProfileOverview";
import AccountStatsSection from "../../components/user_dashboard/user_local_comp/dashboard_page_comp/AccountStatsSection";

function DashboardPage() {
  const [selectedStat, setSelectedStat] = useState("tasks");

  return (
    <div
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 lg:space-y-12"
      style={{ background: "#fafafa" }}
    >
      {/* Unified Welcome Section Card */}
      <div
        className="w-full rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div>
          <WelcomeLeft />
        </div>
        <div>
          <WelcomeRight />
        </div>
      </div>

      {/* User Profile Overview */}
      <UserProfileOverview />

      {/* Quick Actions - Full Width Card */}
      <div
        className="rounded-2xl p-5 sm:p-6 w-full"
        style={{
          background: "#ffffff",
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <QuickActions />
      </div>

      {/* Account Stats Section */}
      <AccountStatsSection />

      {/* Stats Section - Cards on Left, Chart on Right */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 w-full">
        <div className="w-full md:w-[45%] lg:w-[40%]">
          <StatsLeft
            selectedStat={selectedStat}
            onSelectStat={setSelectedStat}
          />
        </div>
        <div className="w-full md:w-[55%] lg:w-[60%]">
          <StatsRight selectedStat={selectedStat} />
        </div>
      </div>

      {/* Statistics Graph - Full Width Card */}
      <div className="w-full">
        <StatisticsGraph />
      </div>

      {/* Recent Transactions - Full Width Card */}
      <div className="w-full">
        <RecentTransactions />
      </div>
    </div>
  );
}

export default DashboardPage;
