const UsersStats = () => {
  const stats = [
    { label: "Total Users", value: "12,345" },
    { label: "Active Today", value: "1,234" },
    { label: "Admins", value: "12" },
    { label: "Banned", value: "23" },
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

export default UsersStats;