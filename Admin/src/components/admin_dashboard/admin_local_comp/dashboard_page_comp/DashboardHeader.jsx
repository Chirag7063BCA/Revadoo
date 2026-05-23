




import { FiCalendar, FiBell } from "react-icons/fi";

const DashboardHeader = ({ stats = {} }) => {
  const adminName = JSON.parse(localStorage.getItem("user") || "{}")?.username || "Admin User";

  // Format today's date nicely
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded-lg shadow-sm p-6">
      {/* Left: Avatar + Greeting */}
      <div className="flex items-center space-x-4">
        {/* Avatar with first letter */}
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
          {adminName.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back,{" "}
            <span className="text-orange-600">{adminName}</span>!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Live totals: {Number(stats.totalUsers || 0).toLocaleString()} users, ${Number(stats.totalEarnings || 0).toLocaleString()} earnings.
          </p>
        </div>
      </div>

      {/* Right: Date pill + Notifications */}
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        {/* Date display */}
        <div className="flex items-center space-x-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
          <FiCalendar className="text-orange-500" />
          <span className="text-sm font-medium">{formattedDate}</span>
        </div>

        {/* Notification bell */}
        <button className="relative p-2 text-gray-500 hover:text-orange-600 transition-colors">
          <FiBell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
