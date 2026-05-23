import { Outlet } from "react-router-dom";
import { useState } from "react";
import DashboardHeader from "../components/user_dashboard/user_global_comp/DashboardHeader";
import DashboardSidebar from "../components/user_dashboard/user_global_comp/DashboardSidebar";
import DashboardFooter from "../components/user_dashboard/user_global_comp/DashbordFooter"; // ✅ fixed typo: DashbordFooter → DashboardFooter
import ScrollToTop from "../components/globalcomp/ScrollToTop";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    /*
      SANDWICH LAYOUT
      ┌─────────────────────────────────────┐
      │         HEADER (fixed, 65px)        │
      ├──────────┬──────────────────────────┤
      │          │                          │
      │ SIDEBAR  │    MAIN CONTENT          │
      │ (sticky) │    (bg-white)            │
      │          │                          │
      ├──────────┴──────────────────────────┤
      │        FOOTER (full width)          │
      └─────────────────────────────────────┘
    */
    <div className="flex flex-col min-h-screen bg-gray-950">
      <ScrollToTop />

      {/* 1. Fixed header */}
      <DashboardHeader onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

      {/* 2. Middle row: sidebar + content */}
      <div className="flex flex-1 pt-[65px]">

        {/* Sidebar — sticky on desktop, fixed drawer on mobile */}
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0 bg-white p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* 3. Footer — full width */}
      <DashboardFooter />
    </div>
  );
};

export default DashboardLayout;