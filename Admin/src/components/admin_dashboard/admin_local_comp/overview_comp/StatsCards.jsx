import { FiUsers, FiDollarSign, FiGamepad, FiMessageSquare } from "react-icons/fi";

const stats = [
  { label: "Total Users", value: "12,345", icon: FiUsers, color: "bg-blue-500" },
  { label: "Total Earnings", value: "$45,678", icon: FiDollarSign, color: "bg-green-500" },
  { label: "Active Games", value: "23", icon: FiGamepad, color: "bg-purple-500" },
  { label: "Contact Messages", value: "89", icon: FiMessageSquare, color: "bg-yellow-500" },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className={`${stat.color} text-white p-3 rounded-full mr-4`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;