import {
  X,
  Ban,
  Trash2,
  DollarSign,
  TrendingUp,
  Award,
  Users,
} from "lucide-react";

const UserDetailsModal = ({ user, isOpen, onClose, onBan, onDelete }) => {
  if (!isOpen || !user) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div
          className="flex justify-between items-start p-6 border-b sticky top-0"
          style={{ borderColor: "rgba(0,0,0,0.05)", background: "#ffffff" }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#030712" }}>
              {user.username}
            </h2>
            <p className="mt-1" style={{ color: "#9ca3af" }}>
              {user.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: "#9ca3af", cursor: "pointer" }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Profile Info */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="bg-white rounded-lg p-4"
              style={{ border: "1px solid rgba(0,0,0,0.05)" }}
            >
              <p
                className="text-xs uppercase font-semibold"
                style={{ color: "#9ca3af" }}
              >
                Referral Code
              </p>
              <p
                className="text-lg font-semibold mt-1"
                style={{ color: "#030712" }}
              >
                {user.referralCode || "N/A"}
              </p>
            </div>
            <div
              className="bg-white rounded-lg p-4"
              style={{ border: "1px solid rgba(0,0,0,0.05)" }}
            >
              <p
                className="text-xs uppercase font-semibold"
                style={{ color: "#9ca3af" }}
              >
                Member Since
              </p>
              <p
                className="text-lg font-semibold mt-1"
                style={{ color: "#030712" }}
              >
                {formatDate(user.createdAt)}
              </p>
            </div>
            <div
              className="rounded-lg p-4"
              style={{
                border: "1px solid rgba(0,0,0,0.05)",
                background: "#ffffff",
              }}
            >
              <p
                className="text-xs uppercase font-semibold"
                style={{ color: "#9ca3af" }}
              >
                Status
              </p>
              <p
                className="text-lg font-semibold mt-1"
                style={{
                  color: user.status === "active" ? "#059669" : "#dc2626",
                }}
              >
                {user.status === "active" ? "Active" : "Banned"}
              </p>
            </div>
            <div
              className="bg-white rounded-lg p-4"
              style={{ border: "1px solid rgba(0,0,0,0.05)" }}
            >
              <p
                className="text-xs uppercase font-semibold"
                style={{ color: "#9ca3af" }}
              >
                Balance
              </p>
              <p
                className="text-lg font-semibold mt-1"
                style={{ color: "#030712" }}
              >
                {user.creds}
              </p>
            </div>
          </div>

          {/* Financial Stats */}
          <div
            className="border-t pt-6"
            style={{ borderColor: "rgba(0,0,0,0.05)" }}
          >
            <h3
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: "#030712" }}
            >
              <DollarSign className="w-5 h-5" style={{ color: "#FF6B00" }} />
              Financial Overview
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div
                className="bg-white rounded-lg p-4"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p
                  className="text-xs uppercase font-semibold"
                  style={{ color: "#9ca3af" }}
                >
                  Total Earned
                </p>
                <p
                  className="text-2xl font-bold mt-2"
                  style={{ color: "#030712" }}
                >
                  {user.financials?.totalEarned || 0}
                </p>
              </div>
              <div
                className="bg-white rounded-lg p-4"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p
                  className="text-xs uppercase font-semibold"
                  style={{ color: "#9ca3af" }}
                >
                  Total Spent
                </p>
                <p
                  className="text-2xl font-bold mt-2"
                  style={{ color: "#030712" }}
                >
                  {user.financials?.totalSpent || 0}
                </p>
              </div>
              <div
                className="bg-white rounded-lg p-4"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p
                  className="text-xs uppercase font-semibold"
                  style={{ color: "#9ca3af" }}
                >
                  Current Wallet
                </p>
                <p
                  className="text-2xl font-bold mt-2"
                  style={{ color: "#030712" }}
                >
                  ${user.wallet}
                </p>
              </div>
            </div>
          </div>

          {/* Quiz Stats */}
          <div
            className="border-t pt-6"
            style={{ borderColor: "rgba(0,0,0,0.05)" }}
          >
            <h3
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: "#030712" }}
            >
              <Award className="w-5 h-5" style={{ color: "#FF6B00" }} />
              Quiz Statistics
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div
                className="bg-white rounded-lg p-3"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p
                  className="text-xs uppercase font-semibold"
                  style={{ color: "#9ca3af" }}
                >
                  Attempts
                </p>
                <p
                  className="text-xl font-bold mt-1"
                  style={{ color: "#030712" }}
                >
                  {user.quizStats?.totalAttempts || 0}
                </p>
              </div>
              <div
                className="bg-white rounded-lg p-3"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p
                  className="text-xs uppercase font-semibold"
                  style={{ color: "#9ca3af" }}
                >
                  Correct
                </p>
                <p
                  className="text-xl font-bold mt-1"
                  style={{ color: "#030712" }}
                >
                  {user.quizStats?.totalCorrect || 0}
                </p>
              </div>
              <div
                className="bg-white rounded-lg p-3"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p
                  className="text-xs uppercase font-semibold"
                  style={{ color: "#9ca3af" }}
                >
                  Wrong
                </p>
                <p
                  className="text-xl font-bold mt-1"
                  style={{ color: "#030712" }}
                >
                  {user.quizStats?.totalWrong || 0}
                </p>
              </div>
              <div
                className="bg-white rounded-lg p-3"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p
                  className="text-xs uppercase font-semibold"
                  style={{ color: "#9ca3af" }}
                >
                  Avg Score
                </p>
                <p
                  className="text-xl font-bold mt-1"
                  style={{ color: "#030712" }}
                >
                  {user.quizStats?.averageScore}%
                </p>
              </div>
            </div>
          </div>

          {/* Referral Stats */}
          <div
            className="border-t pt-6"
            style={{ borderColor: "rgba(0,0,0,0.05)" }}
          >
            <h3
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: "#030712" }}
            >
              <Users className="w-5 h-5" style={{ color: "#FF6B00" }} />
              Referral Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="bg-white rounded-lg p-4"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p
                  className="text-xs uppercase font-semibold"
                  style={{ color: "#9ca3af" }}
                >
                  Referrals
                </p>
                <p
                  className="text-2xl font-bold mt-2"
                  style={{ color: "#030712" }}
                >
                  {user.referralStats?.totalReferrals || 0}
                </p>
              </div>
              <div
                className="bg-white rounded-lg p-4"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p
                  className="text-xs uppercase font-semibold"
                  style={{ color: "#9ca3af" }}
                >
                  Referral Earnings
                </p>
                <p
                  className="text-2xl font-bold mt-2"
                  style={{ color: "#030712" }}
                >
                  {user.referralStats?.referralEarnings || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div
            className="border-t pt-6"
            style={{ borderColor: "rgba(0,0,0,0.05)" }}
          >
            <h3
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: "#030712" }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: "#FF6B00" }} />
              Activity Overview
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div
                className="bg-white rounded-lg p-4"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p
                  className="text-xs uppercase font-semibold"
                  style={{ color: "#9ca3af" }}
                >
                  Transactions
                </p>
                <p
                  className="text-2xl font-bold mt-2"
                  style={{ color: "#030712" }}
                >
                  {user.activityStats?.transactionCount || 0}
                </p>
              </div>
              <div
                className="bg-white rounded-lg p-4"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p
                  className="text-xs uppercase font-semibold"
                  style={{ color: "#9ca3af" }}
                >
                  Tasks
                </p>
                <p
                  className="text-2xl font-bold mt-2"
                  style={{ color: "#030712" }}
                >
                  {user.activityStats?.taskCount || 0}
                </p>
              </div>
              <div
                className="bg-white rounded-lg p-4"
                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p
                  className="text-xs uppercase font-semibold"
                  style={{ color: "#9ca3af" }}
                >
                  Quiz Attempts
                </p>
                <p
                  className="text-2xl font-bold mt-2"
                  style={{ color: "#030712" }}
                >
                  {user.activityStats?.quizAttempts || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {user.recentTransactions && user.recentTransactions.length > 0 && (
            <div
              className="border-t pt-6"
              style={{ borderColor: "rgba(0,0,0,0.05)" }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#030712" }}
              >
                Recent Transactions
              </h3>
              <div className="space-y-2">
                {user.recentTransactions.map((trans, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-lg"
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#030712" }}
                      >
                        {trans.description}
                      </p>
                      <p className="text-xs" style={{ color: "#9ca3af" }}>
                        {formatDate(trans.createdAt)}
                      </p>
                    </div>
                    <span
                      className="font-semibold"
                      style={{
                        color: trans.type === "credit" ? "#059669" : "#dc2626",
                      }}
                    >
                      {trans.type === "credit" ? "+" : "-"}
                      {trans.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className="border-t p-6 flex gap-3 flex-shrink-0"
          style={{ borderColor: "rgba(0,0,0,0.05)", background: "#ffffff" }}
        >
          <button
            onClick={() => {
              onBan(user._id);
              onClose();
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2`}
            style={{
              backgroundColor: user.status === "banned" ? "#059669" : "#FF6B00",
              color: "#ffffff",
            }}
          >
            <Ban className="w-4 h-4" />
            {user.status === "banned" ? "Unban User" : "Ban User"}
          </button>
          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this user?")
              ) {
                onDelete(user._id);
                onClose();
              }
            }}
            className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete User
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: "#ffffff",
              color: "#030712",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
