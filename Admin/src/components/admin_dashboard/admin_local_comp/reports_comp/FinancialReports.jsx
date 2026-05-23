const FinancialReports = ({ reportData = {} }) => {
  const transactions = [
    { category: "Referral Earnings", amount: reportData.referralStats?.totalEarnings || 0, percentage: 45 },
    { category: "Pending Reviews", amount: reportData.taskStats?.pendingReview || 0, percentage: 30 },
    { category: "Paid TKN", amount: reportData.taskStats?.totalPaidTKN || 0, percentage: 16 },
    { category: "Total Referrals", amount: reportData.referralStats?.totalReferrals || 0, percentage: 9 },
  ];
  const total = transactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-2">Revenue Breakdown</p>
          <div className="space-y-3">
            {transactions.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-sm">
                  <span>{item.category}</span>
                  <span>${item.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-4xl font-bold text-gray-800">${total.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-2">Live backend snapshot</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">Pending Payouts</p>
            <p className="text-xl font-semibold">$3,450</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
