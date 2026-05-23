import { FiUsers, FiDollarSign, FiActivity, FiAlertCircle } from "react-icons/fi";

const stats = [
  {
    title: "Total Users",
    value: "12,845",
    icon: FiUsers,
    color: "bg-blue-500"
  },
  {
    title: "Total Revenue",
    value: "$24,580",
    icon: FiDollarSign,
    color: "bg-green-500"
  },
  {
    title: "Active Sessions",
    value: "1,245",
    icon: FiActivity,
    color: "bg-purple-500"
  },
];

const modulesGrid = () => {
  return (
    <div className="space-y-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow flex items-center justify-between"
            >
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h2 className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </h2>
              </div>

              <div className={`${stat.color} p-3 rounded-full text-white`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
};

export default modulesGrid;