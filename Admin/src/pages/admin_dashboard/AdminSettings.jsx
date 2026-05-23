import SettingsHeader from "../../components/admin_dashboard/admin_local_comp/settings_comp/SettingsHeader";
import GeneralSettings from "../../components/admin_dashboard/admin_local_comp/settings_comp/GeneralSettings";
import RewardSettings from "../../components/admin_dashboard/admin_local_comp/settings_comp/RewardSettings";
import EmailSettings from "../../components/admin_dashboard/admin_local_comp/settings_comp/EmailSettings";
import SecuritySettings from "../../components/admin_dashboard/admin_local_comp/settings_comp/SecuritySettings";

const AdminSettings = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <SettingsHeader />
      <GeneralSettings />
      <RewardSettings />
      <EmailSettings />
      <SecuritySettings />
    </div>
  );
};

export default AdminSettings;