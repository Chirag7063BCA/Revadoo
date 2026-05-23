import { FiClock, FiUser, FiShield, FiSettings } from "react-icons/fi";

const activities = [
  { id: 1, action: "Logged in", time: "2 hours ago", icon: FiUser, color: "text-blue-500" },
  { id: 2, action: "Changed password", time: "3 days ago", icon: FiShield, color: "text-green-500" },
  { id: 3, action: "Updated site settings", time: "1 week ago", icon: FiSettings, color: "text-purple-500" },
  { id: 4, action: "Modified user permissions", time: "1 week ago", icon: FiUser, color: "text-yellow-500" },
];

const ActivityLog = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FiClock className="text-indigo-500" /> Recent Activity
      </h2>
      <ul className="space-y-3">
        {activities.map((act) => (
          <li key={act.id} className="flex items-start space-x-3">
            <act.icon className={`w-4 h-4 ${act.color} mt-0.5`} />
            <div className="flex-1">
              <p className="text-sm text-gray-800">{act.action}</p>
              <p className="text-xs text-gray-400">{act.time}</p>
            </div>
          </li>
        ))}
      </ul>
      <button className="mt-3 text-sm text-indigo-600 hover:underline">
        View All Activity
      </button>
    </div>
  );
};

export default ActivityLog;