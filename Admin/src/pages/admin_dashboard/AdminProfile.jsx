// import React from 'react'

// const AdminProfile = () => {
//   return (
//     <div>
//       <h1>Admin Profile</h1>
//     </div>
//   )
// }

// export default AdminProfile



import ProfileHeader from "../../components/admin_dashboard/admin_local_comp/profile_comp/ProfileHeader";
import PersonalInfo from "../../components/admin_dashboard/admin_local_comp/profile_comp/PersonalInfo";
import SecuritySettings from "../../components/admin_dashboard/admin_local_comp/profile_comp/SecuritySettings";
import NotificationPreferences from "../../components/admin_dashboard/admin_local_comp/profile_comp/NotificationPreferences";
import ActivityLog from "../../components/admin_dashboard/admin_local_comp/profile_comp/ActivityLog";
import ProfileQuickActions from "../../components/admin_dashboard/admin_local_comp/profile_comp/ProfileQuickActions";

const AdminProfile = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <ProfileHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Personal Info & Security */}
        <div className="lg:col-span-2 space-y-6">
          <PersonalInfo />
          <SecuritySettings />
        </div>
        {/* Right column - Notifications & Activity */}
        <div className="space-y-6">
          <NotificationPreferences />
          <ActivityLog />
        </div>
      </div>
      <ProfileQuickActions />
    </div>
  );
};

export default AdminProfile;