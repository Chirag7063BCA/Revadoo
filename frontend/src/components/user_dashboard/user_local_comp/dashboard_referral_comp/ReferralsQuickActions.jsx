// // LOCATION: src/components/user_dashboard/user_local_comp/dashboard_referral_comp/ReferralsQuickActions.jsx

// import { motion } from "framer-motion";
// import { Share2, Trophy, Gift, BarChart3 } from "lucide-react";

// const ACTIONS = [
//   { Icon: Share2,    label: "Invite Friends", sub: "Share your link",  orange: true  },
//   { Icon: Trophy,    label: "Top Referrers",  sub: "View leaderboard", orange: false },
//   { Icon: Gift,      label: "Bonus Rewards",  sub: "Unlock perks",     orange: true  },
//   { Icon: BarChart3, label: "Referral Stats", sub: "Track progress",   orange: false },
// ];

// const container = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.09 } },
// };

// const card = {
//   hidden: { opacity: 0, scale: 0.78, y: 16 },
//   show: {
//     opacity: 1, scale: 1, y: 0,
//     transition: { type: "spring", stiffness: 200, damping: 16 },
//   },
// };

// const ReferralsQuickActions = ({ onAction }) => (
//   <>
//     <style>{`
//       @keyframes orangeCardGlow {
//         0%,100% { box-shadow: 0 2px 12px rgba(249,115,22,0.1); }
//         50%      { box-shadow: 0 4px 24px rgba(249,115,22,0.25); }
//       }
//       @keyframes iconPulse {
//         0%,100% { filter: drop-shadow(0 0 3px rgba(249,115,22,0.5)); }
//         50%      { filter: drop-shadow(0 0 8px rgba(249,115,22,0.9)); }
//       }
//       @keyframes blobAction {
//         0%,100% { opacity: .10; transform: scale(1);    }
//         50%      { opacity: .20; transform: scale(1.25); }
//       }
//       @keyframes shimmerBtn {
//         0%   { background-position: -200% center; }
//         100% { background-position:  200% center; }
//       }
//     `}</style>

//     <motion.div
//       variants={container}
//       initial="hidden"
//       animate="show"
//       className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
//     >
//       {ACTIONS.map(({ Icon, label, sub, orange }) => (
//         <motion.button
//           key={label}
//           variants={card}
//           whileHover={{ y: -6, scale: 1.03 }}
//           whileTap={{ scale: 0.96 }}
//           onClick={() => onAction?.(label)}
//           className="group relative overflow-hidden flex flex-col items-center gap-3 rounded-3xl border p-6 text-center transition-all duration-300 bg-white"
//           style={{
//             borderColor: orange ? "rgba(249,115,22,0.25)" : "rgba(0,0,0,0.08)",
//             animation: orange ? "orangeCardGlow 2.5s ease-in-out infinite" : "none",
//             boxShadow: orange ? undefined : "0 1px 6px rgba(0,0,0,0.05)",
//           }}
//         >
//           {/* top accent line */}
//           <div
//             className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
//             style={{
//               background: orange
//                 ? "linear-gradient(90deg,transparent,#f97316,transparent)"
//                 : "linear-gradient(90deg,transparent,rgba(0,0,0,0.1),transparent)",
//             }}
//           />

//           {/* blob */}
//           <div
//             className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full blur-2xl"
//             style={{
//               background: orange ? "#f97316" : "#1f2937",
//               animation: "blobAction 3.5s ease-in-out infinite",
//               opacity: orange ? 0.15 : 0.04,
//             }}
//           />

//           {/* icon */}
//           <div
//             className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110"
//             style={
//               orange
//                 ? {
//                     background: "linear-gradient(135deg,#ea580c,#f97316,#fb923c)",
//                     backgroundSize: "200% auto",
//                     animation: "shimmerBtn 2s linear infinite",
//                     boxShadow: "0 0 16px rgba(249,115,22,0.4)",
//                   }
//                 : {
//                     background: "#f3f4f6",
//                     border: "1px solid rgba(0,0,0,0.08)",
//                   }
//             }
//           >
//             <Icon
//               size={22}
//               className={orange ? "text-white" : "text-orange-500"}
//               style={!orange ? { animation: "iconPulse 2.5s ease-in-out infinite" } : {}}
//             />
//           </div>

//           {/* text */}
//           <div className="relative z-10">
//             <p className="text-sm font-black text-black">{label}</p>
//             <p className="mt-0.5 text-[10px] text-gray-400">{sub}</p>
//           </div>

//           {/* bottom accent on hover */}
//           <div
//             className="absolute bottom-0 left-6 right-6 h-px transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-b-3xl"
//             style={{
//               background: orange
//                 ? "linear-gradient(90deg,transparent,#f97316,transparent)"
//                 : "linear-gradient(90deg,transparent,rgba(0,0,0,0.1),transparent)",
//             }}
//           />
//         </motion.button>
//       ))}
//     </motion.div>
//   </>
// );

// export default ReferralsQuickActions;