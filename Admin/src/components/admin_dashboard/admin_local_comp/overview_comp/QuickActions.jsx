import { Link } from "react-router-dom";

const actions = [
  { label: "Add User", to: "/admin/users?action=add", icon: "👤" },
  { label: "New Game", to: "/admin/games?action=add", icon: "🎮" },
  { label: "Create Survey", to: "/admin/surveys?action=add", icon: "📋" },
  { label: "Write Blog Post", to: "/admin/blog?action=add", icon: "✍️" },
];

const QuickActions = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-3xl mb-2">{action.icon}</span>
            <span className="text-sm text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;