const OverviewHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
      <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default OverviewHeader;