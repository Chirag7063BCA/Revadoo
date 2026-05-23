const GamesStats = () => {
  const stats = [
    { label: "Active Games", value: "18" },
    { label: "Inactive Games", value: "6" },
    { label: "Total Plays", value: "45.2K" },
    { label: "Total Rewards Paid", value: "$12,345" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-2xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default GamesStats;