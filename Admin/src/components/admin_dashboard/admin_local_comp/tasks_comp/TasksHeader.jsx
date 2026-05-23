// LOCATION: src/components/admin/tasks/AdminTasksHeader.jsx

import { ClipboardList } from "lucide-react";

const TasksHeader = ({ count, loading }) => {

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
          <ClipboardList size={20} className="text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Tasks</h1>
          <p className="text-sm text-gray-400">Create, review submissions and release payments</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
        <span className="text-sm text-gray-500">Active Tasks:</span>
        {loading
          ? <span className="h-4 w-10 animate-pulse rounded bg-gray-100 inline-block" />
          : <span className="text-lg font-bold text-orange-500">{count ?? 0}</span>
        }
      </div>
    </div>
  );
};

export default TasksHeader;