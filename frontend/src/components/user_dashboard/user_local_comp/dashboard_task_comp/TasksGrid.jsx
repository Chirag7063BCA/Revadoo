// // LOCATION: src/components/user_dashboard/user_local_comp/dashboard_task_comp/TasksGrid.jsx

// import { useState, useMemo } from "react";
// import { useTasksContext } from "./Taskscontext";
// import TaskCard   from "./TaskCard";
// import ActiveTask from "./ActiveTask";

// const ALL = "all";

// const TasksGrid = () => {
//   const { tasks, loading } = useTasksContext();
//   const [activeFilter, setActiveFilter] = useState(ALL);

//   // Only show active, non-expired tasks
//   const visibleTasks = useMemo(
//     () => tasks.filter((t) => t.isActive && !(t.expiresAt && new Date() > new Date(t.expiresAt))),
//     [tasks]
//   );

//   // Unique categories derived from whatever platform values admin created
//   const categories = useMemo(() => {
//     const set = new Set(visibleTasks.map((t) => (t.platform || "other").toLowerCase()));
//     return [...set].sort();
//   }, [visibleTasks]);

//   // Per-category counts
//   const counts = useMemo(() => {
//     const c = { [ALL]: visibleTasks.length };
//     visibleTasks.forEach((t) => {
//       const key = (t.platform || "other").toLowerCase();
//       c[key] = (c[key] || 0) + 1;
//     });
//     return c;
//   }, [visibleTasks]);

//   // Filtered list
//   const filtered = useMemo(
//     () => activeFilter === ALL
//       ? visibleTasks
//       : visibleTasks.filter((t) => (t.platform || "other").toLowerCase() === activeFilter),
//     [visibleTasks, activeFilter]
//   );

//   // Loading skeletons
//   if (loading) {
//     return (
//       <div className="space-y-4">
//         {/* Filter bar skeleton */}
//         <div className="flex gap-2 overflow-x-auto pb-1">
//           {[80, 100, 70, 90].map((w, i) => (
//             <div key={i} className="h-9 animate-pulse rounded-full bg-gray-100 shrink-0" style={{ width: w }} />
//           ))}
//         </div>
//         {/* Card skeletons */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
//               <div className="h-40 bg-gray-100" />
//               <div className="p-5 space-y-3">
//                 <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
//                 <div className="h-3 bg-gray-100 rounded-lg w-full" />
//                 <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
//                 <div className="h-10 bg-gray-100 rounded-xl mt-4" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-5">

//       {/* ── Filter chips ─────────────────────────────────────────────────── */}
//       <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">

//         {/* ALL chip */}
//         <button
//           onClick={() => setActiveFilter(ALL)}
//           className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all duration-200 ${
//             activeFilter === ALL
//               ? "bg-orange-500 text-white shadow-md shadow-orange-200"
//               : "bg-white border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500"
//           }`}
//         >
//           All
//           <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${
//             activeFilter === ALL ? "bg-white/30 text-white" : "bg-gray-100 text-gray-400"
//           }`}>
//             {counts[ALL]}
//           </span>
//         </button>

//         {/* One chip per category — exactly what admin typed */}
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setActiveFilter(cat)}
//             className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-sm font-bold capitalize transition-all duration-200 ${
//               activeFilter === cat
//                 ? "bg-orange-500 text-white shadow-md shadow-orange-200"
//                 : "bg-white border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500"
//             }`}
//           >
//             {cat}
//             <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${
//               activeFilter === cat ? "bg-white/30 text-white" : "bg-gray-100 text-gray-400"
//             }`}>
//               {counts[cat] || 0}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* ── Grid or empty state ──────────────────────────────────────────── */}
//       {filtered.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
//           <div className="p-4 bg-white rounded-full shadow-sm mb-4">
//             <span className="text-4xl">{activeFilter === ALL ? "📋" : "🔍"}</span>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900">
//             {activeFilter === ALL ? "No tasks available" : `No "${activeFilter}" tasks`}
//           </h3>
//           <p className="text-gray-500 mt-2 text-sm text-center px-4">
//             {activeFilter === ALL
//               ? "Check back later for new challenges!"
//               : "No tasks in this category right now."}
//           </p>
//           {activeFilter !== ALL && (
//             <button
//               onClick={() => setActiveFilter(ALL)}
//               className="mt-4 rounded-full bg-orange-500 px-5 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors"
//             >
//               Show all tasks
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filtered.map((task) => (
//             <TaskCard key={task._id || task.id} task={task} />
//           ))}
//         </div>
//       )}

//       <ActiveTask />
//     </div>
//   );
// };

// export default TasksGrid;