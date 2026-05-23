




import { FiUser, FiDollarSign, FiMessageSquare, FiEdit, FiClock, FiArrowRight, FiMoreHorizontal } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";

const defaultActivities = [
  {
    id: 1,
    type: "user",
    title: "New User Registration",
    message: "john@example.com joined the platform",
    time: "5 minutes ago",
    icon: FiUser,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    gradient: "from-blue-500 to-blue-600",
    action: "View profile",
  },
  {
    id: 2,
    type: "withdrawal",
    title: "Withdrawal Request",
    message: "$50 requested by jane@example.com",
    time: "1 hour ago",
    icon: FiDollarSign,
    color: "text-green-500",
    bgColor: "bg-green-100",
    gradient: "from-green-500 to-green-600",
    action: "Process payment",
  },
  {
    id: 3,
    type: "contact",
    title: "New Contact Message",
    message: "Bob Johnson sent a support request",
    time: "3 hours ago",
    icon: FiMessageSquare,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
    gradient: "from-yellow-500 to-yellow-600",
    action: "View message",
  },
  {
    id: 4,
    type: "blog",
    title: "Blog Post Published",
    message: "How to earn more - New article",
    time: "5 hours ago",
    icon: FiEdit,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    gradient: "from-purple-500 to-purple-600",
    action: "Read article",
  },
];

const RecentActivity = ({ recentUsers = [] }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const activities = recentUsers.length
    ? recentUsers.slice(0, 4).map((user, index) => ({
        id: user._id || index,
        type: "user",
        title: "New User Registration",
        message: `${user.username || user.email} joined the platform`,
        time: new Date(user.createdAt || Date.now()).toLocaleString(),
        icon: FiUser,
        color: "text-blue-500",
        bgColor: "bg-blue-100",
        gradient: "from-blue-500 to-blue-600",
        action: "View profile",
      }))
    : defaultActivities;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* Header with gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent"></div>
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <FiClock className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
              <p className="text-xs text-gray-500">Latest platform updates</p>
            </div>
          </div>
          <Link
            to="/admin/activity"
            className="group flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg transition-all duration-300"
          >
            <span>View All</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="relative">
        {/* Timeline vertical line */}
        <div className="absolute left-[72px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-transparent"></div>
        
        <ul className="divide-y divide-gray-100">
          {activities.map((act, index) => {
            const Icon = act.icon;
            const isHovered = hoveredId === act.id;
            
            return (
              <li
                key={act.id}
                className="relative group"
                onMouseEnter={() => setHoveredId(act.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Hover background effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${act.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative flex items-start space-x-4 px-6 py-5">
                  {/* Timeline dot with icon */}
                  <div className="relative flex-shrink-0">
                    <div className={`absolute inset-0 ${act.bgColor} rounded-xl blur-md group-hover:blur-lg transition-all duration-300`}></div>
                    <div className={`relative ${act.bgColor} p-3 rounded-xl group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 z-10`}>
                      <Icon className={`w-5 h-5 ${act.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    {/* Animated pulse dot */}
                    {act.type === "user" && index === 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                        {act.title}
                      </h3>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {act.time}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{act.message}</p>
                    
                    {/* Action button that appears on hover */}
                    <div className={`flex items-center gap-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                      <button className={`text-xs font-medium bg-gradient-to-r ${act.gradient} text-white px-3 py-1.5 rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105`}>
                        {act.action}
                      </button>
                      <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>

                  {/* Right side indicators */}
                  <div className="flex items-center gap-3">
                    {/* Type badge (appears on hover) */}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                      {act.type}
                    </span>
                    
                    {/* More options button */}
                    <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                      <FiMoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer with stats and actions */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-600">3 new activities</span>
            </div>
            <div className="flex -space-x-2">
              {activities.slice(0, 3).map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className={`w-6 h-6 ${act.bgColor} rounded-full border-2 border-white flex items-center justify-center`}>
                    <Icon className={`w-3 h-3 ${act.color}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-500 hover:text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm">
              Mark all as read
            </button>
            <button className="text-xs text-orange-600 hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100 transition-all duration-300">
              Refresh feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
