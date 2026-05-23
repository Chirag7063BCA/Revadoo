import SettingsHeader from "../../components/user_dashboard/user_local_comp/dashboard_settings_comp/SettingsHeader";
import SettingsProfile from "../../components/user_dashboard/user_local_comp/dashboard_settings_comp/SettingsProfile";
import SettingsSecurity from "../../components/user_dashboard/user_local_comp/dashboard_settings_comp/SettingsSecurity";
import SettingsNotifications from "../../components/user_dashboard/user_local_comp/dashboard_settings_comp/SettingsNotifications";
import SettingsPreferences from "../../components/user_dashboard/user_local_comp/dashboard_settings_comp/SettingsPreferences";
import SettingsSupport from "../../components/user_dashboard/user_local_comp/dashboard_settings_comp/Settingssupport";

const DashboardSettings = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <SettingsHeader />
      <SettingsProfile />
      <SettingsSecurity />
      <SettingsSupport />        
      <SettingsNotifications />
      <SettingsPreferences />
    </div>
  );
};

export default DashboardSettings;