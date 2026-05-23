import { FiDollarSign, FiDownload, FiUpload, FiBarChart2 } from "react-icons/fi";

const WalletQuickActions = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
      <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
        <FiDollarSign />
        <span>Manual Deposit</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
        <FiDollarSign />
        <span>Manual Withdrawal</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
        <FiDownload />
        <span>Export Transactions</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
        <FiUpload />
        <span>Import Transactions</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
        <FiBarChart2 />
        <span>View Reports</span>
      </button>
    </div>
  );
};

export default WalletQuickActions;