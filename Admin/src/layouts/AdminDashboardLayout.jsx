
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin_dashboard/admin_global_comp/AdminHeader";
import AdminSidebar from "../components/admin_dashboard/admin_global_comp/AdminSidebar";
import ScrollToTop from "../components/admin_dashboard/admin_global_comp/ScrollToTop";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#030712]">
      <ScrollToTop />

      {/* HEADER */}
      <AdminHeader
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* MAIN SECTION */}
      <div className="flex flex-1 pt-[65px]">
        
        <AdminSidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 bg-white p-6">
          <Outlet />
        </main>
      </div>

    
    </div>
  );
};

export default AdminDashboardLayout;