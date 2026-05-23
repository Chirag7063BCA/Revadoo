// import { useState } from "react";

// const ManualAdjustment = () => {
//   const [userId, setUserId] = useState("");
//   const [amount, setAmount] = useState(0);
//   const [reason, setReason] = useState("");

//   const handleAdjust = () => {
//     // API call to adjust balance
//     alert(`Adjust user ${userId} by ${amount} for ${reason}`);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h2 className="text-xl font-semibold mb-4">Manual Balance Adjustment</h2>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <input
//           type="text"
//           placeholder="User ID or Email"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           className="px-4 py-2 border rounded-lg"
//         />
//         <input
//           type="number"
//           placeholder="Amount (+/-)"
//           value={amount}
//           onChange={(e) => setAmount(parseFloat(e.target.value))}
//           className="px-4 py-2 border rounded-lg"
//         />
//         <input
//           type="text"
//           placeholder="Reason"
//           value={reason}
//           onChange={(e) => setReason(e.target.value)}
//           className="px-4 py-2 border rounded-lg"
//         />
//         <button
//           onClick={handleAdjust}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
//         >
//           Apply Adjustment
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ManualAdjustment;




















import { useState } from "react";
import { FiDollarSign, FiUser, FiEdit3, FiAlertCircle, FiCheckCircle, FiClock, FiPlus, FiMinus } from "react-icons/fi";

const ManualAdjustment = () => {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  // Sample recent adjustments
  const recentAdjustments = [
    { id: 1, user: "john@example.com", amount: 50, type: "add", reason: "Bonus", date: "2 hours ago", status: "completed" },
    { id: 2, user: "jane@example.com", amount: 25, type: "subtract", reason: "Correction", date: "5 hours ago", status: "completed" },
    { id: 3, user: "bob@example.com", amount: 100, type: "add", reason: "Compensation", date: "1 day ago", status: "completed" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!userId.trim()) newErrors.userId = "User ID or email is required";
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!reason.trim()) newErrors.reason = "Reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdjust = () => {
    if (validateForm()) {
      setShowConfirm(true);
    }
  };

  const confirmAdjustment = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert(`✅ Adjustment applied: ${adjustmentType === 'add' ? '+' : '-'}$${amount} for user ${userId}`);
      setUserId("");
      setAmount("");
      setReason("");
      setAdjustmentType("add");
      setErrors({});
      setIsSubmitting(false);
      setShowConfirm(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Main Adjustment Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FiDollarSign className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Manual Balance Adjustment</h2>
              <p className="text-indigo-100 text-sm">Add or deduct funds from user accounts</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Adjustment Type Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Adjustment Type</label>
            <div className="flex gap-3">
              <button
                onClick={() => setAdjustmentType("add")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                  adjustmentType === "add"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <FiPlus className={`w-5 h-5 ${adjustmentType === "add" ? "text-green-500" : "text-gray-400"}`} />
                <span className="font-medium">Add Funds</span>
              </button>
              <button
                onClick={() => setAdjustmentType("subtract")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                  adjustmentType === "subtract"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <FiMinus className={`w-5 h-5 ${adjustmentType === "subtract" ? "text-red-500" : "text-gray-400"}`} />
                <span className="font-medium">Deduct Funds</span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User ID Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiUser className="w-4 h-4" />
                User ID / Email
              </label>
              <input
                type="text"
                placeholder="e.g., john@example.com"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.userId 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-200 focus:ring-indigo-200'
                }`}
              />
              {errors.userId && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="w-3 h-3" />
                  {errors.userId}
                </p>
              )}
            </div>

            {/* Amount Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiDollarSign className="w-4 h-4" />
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.amount 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-indigo-200'
                  }`}
                  step="0.01"
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="w-3 h-3" />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Reason Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiEdit3 className="w-4 h-4" />
                Reason
              </label>
              <input
                type="text"
                placeholder="e.g., Bonus, Correction"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.reason 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-200 focus:ring-indigo-200'
                }`}
              />
              {errors.reason && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="w-3 h-3" />
                  {errors.reason}
                </p>
              )}
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
              <button
                onClick={handleAdjust}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 ${
                  adjustmentType === "add"
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                } hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {adjustmentType === "add" ? <FiPlus className="w-5 h-5" /> : <FiMinus className="w-5 h-5" />}
                    <span>Apply Adjustment</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Panel (shows when form has values) */}
          {userId && amount && reason && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fadeIn">
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 text-indigo-500" />
                Adjustment Preview
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    adjustmentType === "add" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {adjustmentType === "add" ? "+" : "-"}${parseFloat(amount || 0).toFixed(2)}
                  </div>
                  <span className="text-sm text-gray-600">for <strong>{userId}</strong></span>
                  <span className="text-sm text-gray-500">• {reason}</span>
                </div>
                <span className="text-xs text-gray-400">Click Apply to confirm</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Adjustments History */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiClock className="text-gray-400 w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-800">Recent Adjustments</h3>
          </div>
          <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
        </div>

        <div className="space-y-3">
          {recentAdjustments.map((adj) => (
            <div key={adj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  adj.type === "add" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {adj.type === "add" 
                    ? <FiPlus className="text-green-600 w-4 h-4" />
                    : <FiMinus className="text-red-600 w-4 h-4" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{adj.user}</p>
                  <p className="text-xs text-gray-500">{adj.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  adj.type === "add" ? "text-green-600" : "text-red-600"
                }`}>
                  {adj.type === "add" ? "+" : "-"}${adj.amount}
                </p>
                <p className="text-xs text-gray-400">{adj.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FiAlertCircle className="text-yellow-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Confirm Adjustment</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to {adjustmentType === "add" ? "add" : "deduct"} <strong>${parseFloat(amount).toFixed(2)}</strong> {adjustmentType === "add" ? "to" : "from"} <strong>{userId}</strong>?
            </p>

            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <p className="text-sm text-gray-600"><strong>Reason:</strong> {reason}</p>
              <p className="text-xs text-gray-400 mt-2">This action will be logged and cannot be undone.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmAdjustment}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualAdjustment;