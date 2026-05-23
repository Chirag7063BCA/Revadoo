import React, { memo, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const sidebarIcons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 5.5C4 4.67 4.67 4 5.5 4H9.5C10.33 4 11 4.67 11 5.5V9.5C11 10.33 10.33 11 9.5 11H5.5C4.67 11 4 10.33 4 9.5V5.5Z" fill="currentColor" fillOpacity="0.95" />
      <path d="M13 5.5C13 4.67 13.67 4 14.5 4H18.5C19.33 4 20 4.67 20 5.5V9.5C20 10.33 19.33 11 18.5 11H14.5C13.67 11 13 10.33 13 9.5V5.5Z" fill="currentColor" fillOpacity="0.7" />
      <path d="M4 14.5C4 13.67 4.67 13 5.5 13H9.5C10.33 13 11 13.67 11 14.5V18.5C11 19.33 10.33 20 9.5 20H5.5C4.67 20 4 19.33 4 18.5V14.5Z" fill="currentColor" fillOpacity="0.7" />
      <path d="M13 14.5C13 13.67 13.67 13 14.5 13H18.5C19.33 13 20 13.67 20 14.5V18.5C20 19.33 19.33 20 18.5 20H14.5C13.67 20 13 19.33 13 18.5V14.5Z" fill="currentColor" />
    </svg>
  ),
  wallet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 8.5C4 6.57 5.57 5 7.5 5H17C18.66 5 20 6.34 20 8V16C20 17.66 18.66 19 17 19H7.5C5.57 19 4 17.43 4 15.5V8.5Z" fill="currentColor" fillOpacity="0.18" />
      <path d="M7.5 6H18C19.1 6 20 6.9 20 8V9H7.5C6.12 9 5 7.88 5 6.5C5 6.22 5.22 6 5.5 6H7.5Z" fill="currentColor" />
      <rect x="4.75" y="9.75" width="14.5" height="8.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.5" cy="14" r="1.25" fill="currentColor" />
    </svg>
  ),
  games: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="7" width="17" height="10" rx="4.5" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 12H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 10V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="11" r="1.2" fill="currentColor" />
      <circle cx="18.5" cy="13.5" r="1.2" fill="currentColor" />
    </svg>
  ),
  surveys: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 3.75H14.4L19 8.35V18.75C19 19.44 18.44 20 17.75 20H7C6.31 20 5.75 19.44 5.75 18.75V5C5.75 4.31 6.31 3.75 7 3.75Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 4V8.25H18.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.75 11H15.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.75 14H15.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8.75" cy="17" r="1" fill="currentColor" />
      <path d="M11.25 17H15.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  tasks: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="4.5" width="14" height="15" rx="2.5" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 12H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 16H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 12L14.4 13.4L17 10.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 16L14.4 17.4L17 14.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  leaderboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M8 20H5.75C5.34 20 5 19.66 5 19.25V12.75C5 12.34 5.34 12 5.75 12H8V20Z" fill="currentColor" fillOpacity="0.5" />
      <path d="M13 20H10.75C10.34 20 10 19.66 10 19.25V8.75C10 8.34 10.34 8 10.75 8H13V20Z" fill="currentColor" fillOpacity="0.78" />
      <path d="M18 20H15.75C15.34 20 15 19.66 15 19.25V5.75C15 5.34 15.34 5 15.75 5H18V20Z" fill="currentColor" />
      <path d="M4.5 20H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  referrals: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="17.5" cy="6.5" r="2.75" fill="currentColor" />
      <circle cx="6.5" cy="12" r="2.75" fill="currentColor" fillOpacity="0.72" />
      <circle cx="17.5" cy="17.5" r="2.75" fill="currentColor" fillOpacity="0.45" />
      <path d="M8.9 11L14.8 7.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.9 13L14.8 16.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="9" r="3" fill="currentColor" />
      <path d="M4.75 18.25C4.75 15.9 6.65 14 9 14C11.35 14 13.25 15.9 13.25 18.25" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16.5" cy="9.5" r="2.25" fill="currentColor" fillOpacity="0.62" />
      <path d="M14.75 17.75C15.01 16.15 16.27 15 17.75 15C19.23 15 20.49 16.15 20.75 17.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  quizzes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 18.5C15.59 18.5 18.5 15.59 18.5 12C18.5 8.41 15.59 5.5 12 5.5C8.41 5.5 5.5 8.41 5.5 12C5.5 13.71 6.16 15.27 7.24 16.43L6.5 19.5L9.57 18.76C10.73 19.84 12.29 20.5 14 20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.35 10.2C10.55 9.23 11.34 8.5 12.34 8.5C13.49 8.5 14.42 9.43 14.42 10.58C14.42 11.91 12.8 12.34 12.36 13.13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12.35" cy="15.55" r="1.05" fill="currentColor" />
    </svg>
  ),
  reports: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6.5 4.75H14.25L18.5 9V18.25C18.5 19.08 17.83 19.75 17 19.75H6.5C5.67 19.75 5 19.08 5 18.25V6.25C5 5.42 5.67 4.75 6.5 4.75Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 5V9.25H18.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.25 15.5L10.5 13.25L12.4 14.9L15.75 11.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  lottery: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 7.5C5 6.67 5.67 6 6.5 6H17.5C18.33 6 19 6.67 19 7.5V18C19 18.83 18.33 19.5 17.5 19.5H6.5C5.67 19.5 5 18.83 5 18V7.5Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="9" r="0.75" fill="currentColor" />
      <circle cx="12" cy="9" r="0.75" fill="currentColor" />
      <circle cx="15.5" cy="9" r="0.75" fill="currentColor" />
      <circle cx="8.5" cy="13" r="1" fill="currentColor" fillOpacity="0.7" />
      <circle cx="12" cy="13" r="1" fill="currentColor" />
      <circle cx="15.5" cy="13" r="1" fill="currentColor" fillOpacity="0.7" />
      <circle cx="8.5" cy="17" r="0.75" fill="currentColor" fillOpacity="0.5" />
      <circle cx="12" cy="17" r="0.75" fill="currentColor" fillOpacity="0.8" />
      <circle cx="15.5" cy="17" r="0.75" fill="currentColor" fillOpacity="0.5" />
    </svg>
  ),
};

const mainItems = [
  {
    path: "/admin",
    label: "Dashboard",
    exact: true,
    icon: sidebarIcons.dashboard,
    accent: "#ff8a3d",
    glow: "rgba(255,138,61,0.45)",
  },
  {
    path: "/admin/wallet",
    label: "Wallet",
    icon: sidebarIcons.wallet,
    accent: "#f5b942",
    glow: "rgba(245,185,66,0.45)",
  },
  {
    path: "/admin/games",
    label: "Games",
    icon: sidebarIcons.games,
    accent: "#26c281",
    glow: "rgba(38,194,129,0.42)",
  },
  {
    path: "/admin/surveys",
    label: "Surveys",
    icon: sidebarIcons.surveys,
    accent: "#5d8bff",
    glow: "rgba(93,139,255,0.42)",
  },
  {
    path: "/admin/tasks",
    label: "Tasks",
    icon: sidebarIcons.tasks,
    accent: "#0fb9b1",
    glow: "rgba(15,185,177,0.42)",
  },
  {
    path: "/admin/leaderboard",
    label: "Leaderboard",
    icon: sidebarIcons.leaderboard,
    accent: "#a66cff",
    glow: "rgba(166,108,255,0.42)",
  },
  {
    path: "/admin/referrals",
    label: "Referrals",
    icon: sidebarIcons.referrals,
    accent: "#ff6f91",
    glow: "rgba(255,111,145,0.42)",
  },
  {
    path: "/admin/users",
    label: "Users",
    icon: sidebarIcons.users,
    accent: "#4fb3ff",
    glow: "rgba(79,179,255,0.42)",
  },
  {
    path: "/admin/quizzes",
    label: "Quizzes",
    icon: sidebarIcons.quizzes,
    accent: "#ff8f3f",
    glow: "rgba(255,143,63,0.42)",
  },
  {
    path: "/admin/reports",
    label: "Reports",
    icon: sidebarIcons.reports,
    accent: "#ef5d5d",
    glow: "rgba(239,93,93,0.42)",
  },
  {
    path: "/admin/lottery",
    label: "Lottery",
    icon: sidebarIcons.lottery,
    accent: "#ff6b9d",
    glow: "rgba(255,107,157,0.42)",
  },
];

const IconBadge = ({ item, active }) => (
  <div
    className="relative flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300"
    style={{
      color: active ? "#fff8f3" : item.accent,
      background: active
        ? `linear-gradient(145deg, ${item.accent}, #101010)`
        : `linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))`,
      border: active
        ? `1px solid ${item.accent}`
        : "1px solid rgba(255,255,255,0.08)",
      boxShadow: active
        ? `0 14px 28px ${item.glow}, inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -10px 16px rgba(0,0,0,0.3)`
        : `inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -10px 16px rgba(0,0,0,0.22)`,
      transform: active ? "translateY(-1px)" : "translateY(0)",
    }}
  >
    <div
      className="pointer-events-none absolute inset-x-2 top-1 h-3 rounded-full"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.34), rgba(255,255,255,0))",
        opacity: active ? 0.95 : 0.55,
      }}
    />
    <span className="relative z-10">{item.icon}</span>
  </div>
);

const NavItem = memo(({ item, active, onClick }) => (
  <NavLink
    to={item.path}
    end={item.exact || false}
    onClick={onClick}
    className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200"
    style={{
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.02em",
      textDecoration: "none",
      color: active ? "#fff8f3" : "rgba(255,255,255,0.72)",
      background: active
        ? "linear-gradient(90deg, rgba(255,107,0,0.18), rgba(255,255,255,0.04))"
        : "transparent",
      border: active
        ? "1px solid rgba(255,107,0,0.22)"
        : "1px solid transparent",
      boxShadow: active ? "0 10px 24px rgba(0,0,0,0.24)" : "none",
    }}
  >
    <IconBadge item={item} active={active} />
    <div className="min-w-0 flex-1">
      <div className="text-sm font-semibold">{item.label}</div>
      <div
        className="text-[11px] uppercase tracking-[0.24em]"
        style={{ color: active ? item.accent : "rgba(255,255,255,0.28)" }}
      >
        Admin Module
      </div>
    </div>
    <div
      className="h-2.5 w-2.5 rounded-full transition-opacity duration-200"
      style={{
        background: item.accent,
        opacity: active ? 1 : 0.22,
        boxShadow: active ? `0 0 18px ${item.glow}` : "none",
      }}
    />
  </NavLink>
));

NavItem.displayName = "NavItem";

const AdminSidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();

  const isActiveLink = useCallback((path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const SidebarContent = ({ onLinkClick = null }) => (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-4 pt-6">
        <div
          className="rounded-[28px] border px-4 py-5"
          style={{
            borderColor: "rgba(255,107,0,0.16)",
            background:
              "radial-gradient(circle at top left, rgba(255,107,0,0.18), transparent 42%), linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-orange-300">
            Revadoo
          </div>
          <div className="mt-2 text-xl font-semibold text-white">Admin Console</div>
          <div className="mt-1 text-sm text-white/45">
            Smart controls for the full platform.
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 pb-5">
        <span
          className="px-3 pb-3 text-[11px] font-bold uppercase tracking-[0.32em]"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.24)" }}
        >
          Main Menu
        </span>
        <nav className="mt-1 flex flex-col gap-2">
          {mainItems.map((item) => {
            const active = isActiveLink(item.path, item.exact);
            return (
              <NavItem
                key={item.path}
                item={item}
                active={active}
                onClick={onLinkClick}
              />
            );
          })}
        </nav>
      </div>
    </div>
  );

  const sidebarBase = {
    background:
      "linear-gradient(180deg, rgba(8,8,8,0.98) 0%, rgba(15,15,15,0.98) 100%)",
    borderRight: "1px solid rgba(255,107,0,0.14)",
  };

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 0, 0.18); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 107, 0, 0.4); }
    .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(255, 107, 0, 0.18) transparent; overflow-y: auto; overflow-x: hidden; }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>

      <aside
        className="custom-scrollbar sticky hidden w-72 shrink-0 self-start lg:flex"
        style={{
          ...sidebarBase,
          top: "65px",
          height: "calc(100vh - 65px)",
          zIndex: 40,
        }}
      >
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="custom-scrollbar fixed left-0 top-0 z-[70] flex h-full w-[300px] max-w-[88vw] flex-col shadow-2xl lg:hidden"
              style={sidebarBase}
            >
              <div className="flex items-center justify-between border-b border-white/5 p-4">
                <span className="text-sm font-bold tracking-[0.3em] text-[#FF6B00]">
                  MENU
                </span>
                <button
                  onClick={closeSidebar}
                  className="rounded-xl border border-white/10 p-2 text-white/40 transition-colors hover:text-white"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <SidebarContent onLinkClick={closeSidebar} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
