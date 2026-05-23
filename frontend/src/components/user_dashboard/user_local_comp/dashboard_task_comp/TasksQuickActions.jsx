// // LOCATION: src/components/user_dashboard/user_local_comp/dashboard_task_comp/TasksQuickActions.jsx

// import { useTasksContext } from "./Taskscontext";

// const ACTIONS = [
//   { icon: "🔥", label: "Trending"    },
//   { icon: "🎁", label: "Bonus Offers"},
//   { icon: "🏆", label: "Leaderboard" },
//   { icon: "📊", label: "My History"  },
// ];

// const TasksQuickActions = () => {
//   const { submissions } = useTasksContext();
//   const historyCount = Object.keys(submissions).length;

//   return (
//     <div className="grid grid-cols-4 gap-3">
//       {ACTIONS.map((a, i) => (
//         <button
//           key={a.label}
//           className="relative bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col items-center gap-2 hover:border-orange-300 hover:shadow-orange-100 hover:-translate-y-0.5 transition-all duration-200 group"
//         >
//           <span className="text-2xl">{a.icon}</span>
//           <span className="text-xs font-bold text-gray-700 group-hover:text-orange-600 transition-colors">{a.label}</span>
//           {i === 3 && historyCount > 0 && (
//             <span className="absolute top-2 right-2 bg-orange-500 text-white rounded-full text-[10px] font-black px-1.5 py-0.5">
//               {historyCount}
//             </span>
//           )}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default TasksQuickActions;