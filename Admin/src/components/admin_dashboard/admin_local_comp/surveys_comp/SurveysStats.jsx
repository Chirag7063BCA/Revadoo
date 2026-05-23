const SurveysStats = () => {
  const stats = [
    { label: "Active Surveys", value: "8" },
    { label: "Total Responses", value: "1,234" },
    { label: "Avg. Reward", value: "$2.50" },
    { label: "Completion Rate", value: "78%" },
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

export default SurveysStats;