// import { FiUsers, FiDollarSign, FiGamepad, FiClipboard } from "react-icons/fi";

// const stats = [
//   { label: "New Users", value: "+1,234", change: "+12%", icon: FiUsers, color: "bg-blue-500" },
//   { label: "Total Earnings", value: "$45,678", change: "+8%", icon: FiDollarSign, color: "bg-green-500" },
//   { label: "Game Plays", value: "23,456", change: "+23%", icon: FiGamepad, color: "bg-purple-500" },
//   { label: "Survey Responses", value: "5,678", change: "+5%", icon: FiClipboard, color: "bg-yellow-500" },
// ];

// const OverviewStats = () => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {stats.map((stat, index) => {
//         const Icon = stat.icon;

//         return (
//           <div key={index} className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">{stat.label}</p>
//                 <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
//                 <p className="text-xs text-green-600 mt-1">
//                   {stat.change} vs previous period
//                 </p>
//               </div>

//               <div className={`${stat.color} text-white p-3 rounded-full`}>
//                 <Icon className="w-6 h-6" />
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default OverviewStats;