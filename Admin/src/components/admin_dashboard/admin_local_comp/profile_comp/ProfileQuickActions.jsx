import { FiLogOut, FiRefreshCw, FiHelpCircle } from "react-icons/fi";

const ProfileQuickActions = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
      <button className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
        <FiLogOut />
        <span>Logout from all devices</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
        <FiRefreshCw />
        <span>Sync Profile</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
        <FiHelpCircle />
        <span>Help & Support</span>
      </button>
    </div>
  );
};

export default ProfileQuickActions;