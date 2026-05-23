// import { Link } from "react-router-dom";
// import { TASK_CATEGORIES } from "./taskNavigation";

// const TASK_LINKS = [
//   ...TASK_CATEGORIES.map((category) => ({
//     key: category.key,
//     to: `/dashboard/tasks/${category.key}`,
//     label: category.label,
//     icon: category.icon,
//   })),
// ];

// const VARIANT_STYLES = {
//   navbar: {
//     link: "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
//     active: "bg-orange-50 text-orange-600",
//     idle: "text-gray-700 hover:bg-gray-50 hover:text-orange-600",
//   },
//   sidebar: {
//     link: "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
//     active: "bg-orange-500/15 text-orange-300",
//     idle: "text-white/55 hover:bg-white/5 hover:text-white",
//   },
//   drawer: {
//     link: "flex items-center gap-2 rounded-lg px-0 py-2 text-sm font-medium transition-colors",
//     active: "text-orange-600",
//     idle: "text-gray-800 hover:text-orange-600",
//   },
// };

// export default function TaskTypeLinks({
//   activePath,
//   onItemClick,
//   variant = "navbar",
//   className = "",
//   itemClassName = "",
// }) {
//   const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.navbar;

//   return (
//     <div className={className}>
//       {TASK_LINKS.map((item) => {
//         const active = activePath === item.to;
//         const showIcon = variant !== "sidebar";

//         return (
//           <Link
//             key={item.key}
//             to={item.to}
//             onClick={onItemClick}
//             className={`${styles.link} ${active ? styles.active : styles.idle} ${itemClassName}`}
//             aria-current={active ? "page" : undefined}
//           >
//             {showIcon && <span className="w-4 text-center">{item.icon}</span>}
//             <span>{item.label}</span>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }