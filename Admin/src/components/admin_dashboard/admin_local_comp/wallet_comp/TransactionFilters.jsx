// import { FiSearch, FiCalendar } from "react-icons/fi";

// const TransactionFilters = () => {
//   return (
//     <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center gap-4">
//       {/* Search input */}
//       <div className="flex-1 min-w-[200px] relative">
//         <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search by user or transaction ID..."
//           className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//       </div>

//       {/* Transaction type filter */}
//       <select className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500">
//         <option value="">All Types</option>
//         <option value="deposit">Deposit</option>
//         <option value="withdrawal">Withdrawal</option>
//         <option value="game_reward">Game Reward</option>
//         <option value="referral_bonus">Referral Bonus</option>
//       </select>

//       {/* Status filter */}
//       <select className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500">
//         <option value="">All Statuses</option>
//         <option value="completed">Completed</option>
//         <option value="pending">Pending</option>
//         <option value="rejected">Rejected</option>
//       </select>

//       {/* Date range picker (simplified) */}
//       <div className="flex items-center space-x-2">
//         <FiCalendar className="text-gray-400" />
//         <input
//           type="date"
//           className="px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
//         />
//         <span>to</span>
//         <input
//           type="date"
//           className="px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
//         />
//       </div>

//       {/* Apply filters button */}
//       <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
//         Apply Filters
//       </button>
//     </div>
//   );
// };

// export default TransactionFilters;















import { FiSearch, FiCalendar, FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState } from "react";

const TransactionFilters = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [currency, setCurrency] = useState("all");

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (transactionType) count++;
    if (status) count++;
    if (dateRange.start || dateRange.end) count++;
    if (minAmount || maxAmount) count++;
    if (currency !== "all") count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const handleReset = () => {
    setSearchTerm("");
    setTransactionType("");
    setStatus("");
    setDateRange({ start: "", end: "" });
    setMinAmount("");
    setMaxAmount("");
    setCurrency("all");
  };

  // Quick date range presets
  const applyQuickRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FiFilter className="text-white w-4 h-4" />
            </div>
            <h3 className="text-white font-semibold">Filter Transactions</h3>
            {activeFilterCount > 0 && (
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                {activeFilterCount} active
              </span>
            )}
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-white/80 hover:text-white transition-colors flex items-center gap-1 text-sm"
          >
            {showAdvanced ? "Hide Advanced" : "Advanced Filters"}
            {showAdvanced ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Main Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search input */}
          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by user or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Transaction type filter */}
          <div className="relative group">
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="deposit">💰 Deposit</option>
              <option value="withdrawal">💳 Withdrawal</option>
              <option value="game_reward">🎮 Game Reward</option>
              <option value="referral_bonus">🤝 Referral Bonus</option>
              <option value="survey_reward">📋 Survey Reward</option>
              <option value="quiz_reward">❓ Quiz Reward</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
              <FiChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Status filter */}
          <div className="relative group">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="completed">✅ Completed</option>
              <option value="pending">⏳ Pending</option>
              <option value="processing">🔄 Processing</option>
              <option value="rejected">❌ Rejected</option>
              <option value="cancelled">🚫 Cancelled</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
              <FiChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="flex gap-2">
            <button
              onClick={() => applyQuickRange(7)}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
            >
              7D
            </button>
            <button
              onClick={() => applyQuickRange(30)}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
            >
              30D
            </button>
            <button
              onClick={() => applyQuickRange(90)}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
            >
              90D
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvanced && (
          <div className="mt-6 pt-6 border-t border-gray-100 animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date range picker */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <FiCalendar className="w-3 h-3" />
                  Date Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Amount range */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500">Amount Range ($)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Currency filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="all">All Currencies</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              {/* Additional filters placeholder */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500">Transaction ID</label>
                <input
                  type="text"
                  placeholder="Specific transaction ID"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl flex items-center gap-2"
            >
              <FiFilter className="w-4 h-4" />
              Apply Filters
              {activeFilterCount > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={handleReset}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-2"
              >
                <FiX className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>

          {/* Saved filters dropdown */}
          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <span>Save current filters</span>
            <FiChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">Active filters:</span>
              
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")} className="hover:text-indigo-900">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {transactionType && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs">
                  Type: {transactionType.replace('_', ' ')}
                  <button onClick={() => setTransactionType("")} className="hover:text-indigo-900">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {status && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs">
                  Status: {status}
                  <button onClick={() => setStatus("")} className="hover:text-indigo-900">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {(dateRange.start || dateRange.end) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs">
                  Date: {dateRange.start || 'any'} to {dateRange.end || 'any'}
                  <button onClick={() => setDateRange({ start: "", end: "" })} className="hover:text-indigo-900">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;