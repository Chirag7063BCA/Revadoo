




import { Link } from "react-router-dom";

const actions = [
  { 
    label: "Add New User", 
    to: "/admin/users?action=add", 
    icon: "👤",
    color: "from-blue-500 to-blue-600",
    lightColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  { 
    label: "Create Game", 
    to: "/admin/games?action=add", 
    icon: "🎮",
    color: "from-green-500 to-green-600",
    lightColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  { 
    label: "New Survey", 
    to: "/admin/surveys?action=add", 
    icon: "📋",
    color: "from-purple-500 to-purple-600",
    lightColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  { 
    label: "Write Blog Post", 
    to: "/admin/blog?action=add", 
    icon: "✍️",
    color: "from-yellow-500 to-yellow-600",
    lightColor: "bg-yellow-50",
    iconColor: "text-yellow-600"
  },
  { 
    label: "View Reports", 
    to: "/admin/reports", 
    icon: "📊",
    color: "from-red-500 to-red-600",
    lightColor: "bg-red-50",
    iconColor: "text-red-600"
  },
  { 
    label: "System Settings", 
    to: "/admin/settings", 
    icon: "⚙️",
    color: "from-gray-500 to-gray-600",
    lightColor: "bg-gray-50",
    iconColor: "text-gray-600"
  },
];

const QuickActions = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 p-2">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <span className="text-orange-600 text-xl">⚡</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
          <p className="text-sm text-gray-500">Frequently used tasks at your fingertips</p>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => {
          return (
            <Link
              key={index}
              to={action.to}
              className="group relative flex flex-col items-center p-5 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden"
            >
              {/* Colored top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${action.color}`}></div>
              
              {/* Icon with background */}
              <div className={`${action.lightColor} p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{action.icon}</span>
              </div>
              
              {/* Label */}
              <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-gray-900 transition-colors">
                {action.label}
              </span>
              
              {/* Subtle hint */}
              <span className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to proceed
              </span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
        <span>Quick access to common tasks</span>
      </div>
    </div>
  );
};

export default QuickActions;