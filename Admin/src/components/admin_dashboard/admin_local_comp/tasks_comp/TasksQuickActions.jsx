import { FiUpload, FiDownload, FiCopy, FiClock } from "react-icons/fi";

const TasksQuickActions = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
      <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100">
        <FiUpload />
        <span>Import Tasks</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
        <FiDownload />
        <span>Export Tasks</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
        <FiCopy />
        <span>Duplicate Task</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
        <FiClock />
        <span>Schedule Tasks</span>
      </button>
    </div>
  );
};

export default TasksQuickActions;