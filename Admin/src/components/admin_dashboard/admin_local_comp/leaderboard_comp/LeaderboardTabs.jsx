// LOCATION: src/components/admin_dashboard/admin_local_comp/leaderboard_comp/LeaderboardTabs.jsx
const TABS = [
  { id: "daily",   label: "Daily"   },
  { id: "weekly",  label: "Weekly"  },
  { id: "monthly", label: "Monthly" },
];

const LeaderboardTabs = ({ activeTab = "daily", setActiveTab = () => {} }) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-150
            ${activeTab === tab.id
              ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
              : "text-gray-500 hover:text-black hover:bg-white"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default LeaderboardTabs;