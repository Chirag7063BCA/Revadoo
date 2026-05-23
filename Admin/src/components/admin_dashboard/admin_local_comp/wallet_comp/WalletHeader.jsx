import { FiDollarSign, FiArrowUpRight, FiArrowDownLeft, FiRefreshCw, FiCalendar, FiMoreHorizontal } from "react-icons/fi";
import { useState } from "react";

const WalletHeader = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [showBalance, setShowBalance] = useState(true);

  const totalBalance = 45678.90;
  const todayChange = 1234.56;
  const percentChange = 2.8;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }}></div>

      <div className="relative px-6 py-8 md:px-8 md:py-10">
        {/* Top section with title and currency selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl shadow-orange-500/20">
              <FiDollarSign className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Wallet Overview</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your funds and transactions</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <select 
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-gray-800/50 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>

            {/* Date display */}
            <div className="hidden md:flex items-center gap-2 bg-gray-800/30 px-4 py-2 rounded-lg border border-gray-700/50">
              <FiCalendar className="text-gray-400 w-4 h-4" />
              <span className="text-sm text-gray-300">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>

            {/* More options button */}
            <button className="p-2 bg-gray-800/30 hover:bg-gray-700/30 rounded-lg transition-colors border border-gray-700/50">
              <FiMoreHorizontal className="text-gray-400 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Balance section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main balance card */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <span>Total Balance</span>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showBalance ? '👁️' : '👁️‍🗨️'}
                  </button>
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    {showBalance ? `$${totalBalance.toLocaleString()}` : '••••••'}
                  </span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${percentChange > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {percentChange > 0 ? '+' : ''}{percentChange}%
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2 flex items-center gap-1">
                  <FiArrowUpRight className="text-green-400" />
                  <span>+${todayChange.toLocaleString()} today</span>
                </p>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2">
                <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 group">
                  <FiArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="text-sm font-medium">Send</span>
                </button>
                <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300">
                  <FiArrowDownLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Receive</span>
                </button>
              </div>
            </div>

            {/* Balance progress bars */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Available</p>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">$34,259.18</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Locked</p>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">$11,419.72</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Pending</p>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">$0.00</p>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300">
              <p className="text-gray-400 text-xs mb-2">Today's Earnings</p>
              <p className="text-xl font-bold text-white">$1,234</p>
              <p className="text-xs text-green-400 mt-1">+12.5%</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300">
              <p className="text-gray-400 text-xs mb-2">Pending</p>
              <p className="text-xl font-bold text-white">$2,345</p>
              <p className="text-xs text-yellow-400 mt-1">3 transactions</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300">
              <p className="text-gray-400 text-xs mb-2">Withdrawn</p>
              <p className="text-xl font-bold text-white">$8,901</p>
              <p className="text-xs text-gray-400 mt-1">This month</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300">
              <p className="text-gray-400 text-xs mb-2">Deposited</p>
              <p className="text-xl font-bold text-white">$12,345</p>
              <p className="text-xs text-gray-400 mt-1">This month</p>
            </div>
          </div>
        </div>

        {/* Footer with quick links */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
              <FiRefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
            <span className="text-gray-600">|</span>
            <button className="text-gray-400 hover:text-white transition-colors">
              Transaction History
            </button>
            <span className="text-gray-600 hidden md:inline">|</span>
            <button className="text-gray-400 hover:text-white transition-colors hidden md:inline">
              Export Report
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-gray-400 text-xs">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletHeader;