import { FiMail, FiUserPlus, FiDownload, FiUpload } from "react-icons/fi";

const UsersQuickActions = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
      <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100">
        <FiMail />
        <span>Email All Users</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
        <FiUserPlus />
        <span>Bulk Add Users</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
        <FiDownload />
        <span>Export Users</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
        <FiUpload />
        <span>Import Users</span>
      </button>
    </div>
  );
};

export default UsersQuickActions;