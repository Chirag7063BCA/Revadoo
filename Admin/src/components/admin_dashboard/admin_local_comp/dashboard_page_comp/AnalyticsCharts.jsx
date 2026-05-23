import { FiTrendingUp, FiPieChart, FiInfo } from "react-icons/fi";
import { useState } from "react";

// Sample data for user growth (last 7 days)
const userGrowthData = [
  { day: "Mon", users: 45, fullDate: "March 10" },
  { day: "Tue", users: 52, fullDate: "March 11" },
  { day: "Wed", users: 48, fullDate: "March 12" },
  { day: "Thu", users: 61, fullDate: "March 13" },
  { day: "Fri", users: 55, fullDate: "March 14" },
  { day: "Sat", users: 38, fullDate: "March 15" },
  { day: "Sun", users: 42, fullDate: "March 16" },
];

// Sample data for revenue by category
const revenueByCategory = [
  { category: "Games", amount: 12500, percentage: 45, color: "bg-blue-500", gradient: "from-blue-500 to-blue-600", lightColor: "bg-blue-50", textColor: "text-blue-600" },
  { category: "Surveys", amount: 8200, percentage: 30, color: "bg-green-500", gradient: "from-green-500 to-green-600", lightColor: "bg-green-50", textColor: "text-green-600" },
  { category: "Quizzes", amount: 4500, percentage: 16, color: "bg-purple-500", gradient: "from-purple-500 to-purple-600", lightColor: "bg-purple-50", textColor: "text-purple-600" },
  { category: "Referrals", amount: 2500, percentage: 9, color: "bg-yellow-500", gradient: "from-yellow-500 to-yellow-600", lightColor: "bg-yellow-50", textColor: "text-yellow-600" },
];

const AnalyticsCharts = ({ stats = {} }) => {
  const maxUsers = Math.max(...userGrowthData.map((d) => d.users));
  const [hoveredBar, setHoveredBar] = useState(null);
  const totalRevenue = revenueByCategory.reduce((acc, i) => acc + i.amount, 0);

  // Create conic-gradient string for donut chart
  const getConicGradient = () => {
    let cumulativePercentage = 0;
    const gradientParts = [];

    revenueByCategory.forEach((item) => {
      const start = cumulativePercentage;
      const end = cumulativePercentage + item.percentage;

      let colorClass = "";
      if (item.category === "Games") colorClass = "#3B82F6";
      else if (item.category === "Surveys") colorClass = "#10B981";
      else if (item.category === "Quizzes") colorClass = "#8B5CF6";
      else colorClass = "#F59E0B";

      gradientParts.push(`${colorClass} ${start}% ${end}%`);
      cumulativePercentage = end;
    });

    return `conic-gradient(${gradientParts.join(", ")})`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Growth Chart - Enhanced */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <FiTrendingUp className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">User Growth</h2>
              <p className="text-xs text-gray-500">Live users: {Number(stats.totalUsers || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-indigo-50 px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-indigo-600">{Number(stats.activeTasks || 0).toLocaleString()} active tasks</span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative">
          {/* Y-axis labels (implied) */}
          <div className="absolute -left-2 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
            <span>{maxUsers}</span>
            <span>{Math.round(maxUsers * 0.75)}</span>
            <span>{Math.round(maxUsers * 0.5)}</span>
            <span>{Math.round(maxUsers * 0.25)}</span>
            <span>0</span>
          </div>

          {/* Bars */}
          <div className="flex items-end justify-between h-48 ml-6 space-x-2">
            {userGrowthData.map((day, index) => (
              <div
                key={day.day}
                className="flex flex-col items-center flex-1 group relative"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip */}
                {hoveredBar === index && (
                  <div className="absolute -top-12 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 z-10 whitespace-nowrap">
                    <div className="font-bold">{day.users} new users</div>
                    <div className="text-gray-300">{day.fullDate}</div>
                    <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                  </div>
                )}

                {/* Bar with gradient */}
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all duration-300 group-hover:from-indigo-600 group-hover:to-indigo-500 group-hover:shadow-lg relative overflow-hidden"
                  style={{ height: `${(day.users / maxUsers) * 100}%` }}
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-opacity duration-300"></div>
                </div>

                {/* Day label */}
                <span className="text-xs font-medium text-gray-500 mt-2 group-hover:text-indigo-600 transition-colors">
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Total new users</span>
            <div className="text-2xl font-bold text-gray-800">
              {userGrowthData.reduce((acc, d) => acc + d.users, 0)}
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <FiInfo className="w-3 h-3" />
            <span>Hover bars for details</span>
          </div>
        </div>
      </div>

      {/* Revenue by Category - Donut Chart Style */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <FiPieChart className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Revenue Breakdown</h2>
              <p className="text-xs text-gray-500">Backend earnings: ${Number(stats.totalEarnings || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-green-50 px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-green-600">+8.2% vs last month</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Donut Chart */}
          <div className="relative w-40 h-40 md:w-36 md:h-36 flex-shrink-0">
            <div
              className="w-full h-full rounded-full"
              style={{ background: getConicGradient() }}
            >
              <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-xs text-gray-500">Total</span>
                <span className="text-xl font-bold text-gray-800">${(totalRevenue / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>

          {/* Legend and Details */}
          <div className="flex-1 w-full">
            <div className="space-y-3">
              {revenueByCategory.map((item) => (
                <div key={item.category} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-800">
                        ${item.amount.toLocaleString()}
                      </span>
                      <span className={`text-xs font-bold ${item.textColor} bg-opacity-20 ${item.lightColor} px-2 py-0.5 rounded-full`}>
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-300 group-hover:scale-x-105 origin-left`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-gray-500">Average Revenue/Day</span>
            <div className="text-lg font-bold text-gray-800">$1,964</div>
          </div>
          <div>
            <span className="text-xs text-gray-500">Top Category</span>
            <div className="text-lg font-bold text-blue-600">Games (45%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
