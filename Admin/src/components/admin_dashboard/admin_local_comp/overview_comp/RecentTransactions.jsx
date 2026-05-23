const transactions = [
  { id: 1, user: "john@example.com", amount: "$50.00", status: "completed", date: "2025-03-09" },
  { id: 2, user: "jane@example.com", amount: "$20.00", status: "pending", date: "2025-03-08" },
  { id: 3, user: "bob@example.com", amount: "$100.00", status: "completed", date: "2025-03-07" },
];

const RecentTransactions = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <button className="text-indigo-600 hover:underline">View All</button>
      </div>
      <ul className="divide-y">
        {transactions.map((tx) => (
          <li key={tx.id} className="py-3 flex justify-between">
            <div>
              <p className="font-medium">{tx.user}</p>
              <p className="text-sm text-gray-500">{tx.amount}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {tx.status}
              </span>
              <p className="text-xs text-gray-400 mt-1">{tx.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;