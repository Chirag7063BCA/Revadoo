import { FiUpload, FiDownload, FiCopy, FiSettings } from "react-icons/fi";

const GamesQuickActions = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
      <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100">
        <FiUpload />
        <span>Import Games</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
        <FiDownload />
        <span>Export Games</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
        <FiCopy />
        <span>Duplicate Game</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100">
        <FiSettings />
        <span>Game Settings</span>
      </button>
    </div>
  );
};

export default GamesQuickActions;