const SystemHealth = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">System Health</h2>
      <div className="space-y-3">
        <div className="flex items-center">
          <span className="w-32">CPU Usage</span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-green-500 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <span className="ml-3 text-sm">45%</span>
        </div>
        <div className="flex items-center">
          <span className="w-32">Memory</span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '62%' }}></div>
          </div>
          <span className="ml-3 text-sm">62%</span>
        </div>
        <div className="flex items-center">
          <span className="w-32">Disk</span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
          </div>
          <span className="ml-3 text-sm">78%</span>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;