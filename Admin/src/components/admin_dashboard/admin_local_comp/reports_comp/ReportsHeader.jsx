const ReportsHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>
      <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default ReportsHeader;