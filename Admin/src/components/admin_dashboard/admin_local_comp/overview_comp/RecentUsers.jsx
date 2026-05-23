import { Link } from "react-router-dom";

const recentUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", date: "2025-03-09" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", date: "2025-03-08" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", date: "2025-03-07" },
];

const RecentUsers = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Users</h2>
        <Link to="/admin/users" className="text-indigo-600 hover:underline">View All</Link>
      </div>
      <ul className="divide-y">
        {recentUsers.map((user) => (
          <li key={user.id} className="py-3 flex justify-between">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <span className="text-sm text-gray-400">{user.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentUsers;