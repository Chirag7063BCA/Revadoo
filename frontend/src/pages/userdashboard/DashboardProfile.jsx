// LOCATION: src/pages/dashboard/DashboardProfile.jsx

import ProfileHeader  from "../../components/user_dashboard/user_local_comp/dashboard_profile_comp/ProfileHeader";
import ProfileCard    from "../../components/user_dashboard/user_local_comp/dashboard_profile_comp/ProfileCard";
import ProfileStats   from "../../components/user_dashboard/user_local_comp/dashboard_profile_comp/ProfileStats";
// import ProfileActivity from "../../components/user_dashboard/user_local_comp/dashboard_profile_comp/ProfileActivity";
import ProfileActions from "../../components/user_dashboard/user_local_comp/dashboard_profile_comp/ProfileActions";
import EditProfileModal from "../../components/user_dashboard/user_local_comp/dashboard_profile_comp/Editprofilemodal";

const DashboardProfile = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-5">

     
      {/* Stats row */}
      <ProfileStats />

      {/* Two column — left: sidebar card | right: personal info + activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
        {/* Left — profile card with nav */}
        <ProfileCard />

        {/* Right — personal info form + recent activity */}
        <div className="space-y-5">
          {/* <ProfileActivity /> */}
           {/* Avatar picker — full width, unchanged */}
          <ProfileHeader />
          <ProfileActions />
          <EditProfileModal />

        </div>
      </div>

    </div>
  );
};

export default DashboardProfile;