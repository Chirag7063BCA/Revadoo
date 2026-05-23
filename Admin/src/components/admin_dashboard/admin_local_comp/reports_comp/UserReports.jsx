const UserReports = ({ users = [], loading = false, onExportSingle }) => {
  const userData = users.slice(0, 7).map((user, index) => ({
    date: new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { weekday: "short" }),
    new: index + 1,
    active: user.status === "active" ? 1 : 0,
  }));
  const chartData = userData.length
    ? userData
    : [{ date: "No data", new: 0, active: 0 }];
  const maxActive = Math.max(...chartData.map((d) => d.active || 0), 1);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">User Activity (Live)</h2>
        <button onClick={onExportSingle} className="text-sm px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Download PDF</button>
      </div>
      <div className="flex items-end justify-between h-40 space-x-2">
        {loading ? (
          <div className="text-sm text-gray-500">Loading report data...</div>
        ) : chartData.map((day) => (
          <div key={day.date} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-indigo-500 rounded-t"
              style={{ height: `${(day.active / maxActive) * 100}%` }}
            ></div>
            <span className="text-xs mt-2">{day.date}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>New Users: {chartData.reduce((acc, d) => acc + d.new, 0)}</span>
        <span>Active Users: {users.filter((u) => (u.status || "active") === "active").length}</span>
      </div>
    </div>
  );
};

export default UserReports;
