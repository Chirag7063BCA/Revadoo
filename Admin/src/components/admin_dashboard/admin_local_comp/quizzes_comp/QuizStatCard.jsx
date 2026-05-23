const QuizStatCard = ({ icon: Icon, label, value }) => {
  return (
    <div
      className="bg-white rounded-xl border p-4 sm:p-5 font-['DM_Sans',sans-serif] shadow-md hover:shadow-lg transition-shadow"
      style={{ borderColor: "rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#9ca3af" }}
        >
          {label}
        </p>
        <div
          className="p-2 rounded-lg"
          style={{ background: "rgba(255,107,0,0.08)" }}
        >
          <Icon className="w-5 h-5" style={{ color: "#FF6B00" }} />
        </div>
      </div>
      <p
        className="text-2xl sm:text-3xl font-bold tracking-tight"
        style={{ color: "#030712" }}
      >
        {value}
      </p>
    </div>
  );
};

export default QuizStatCard;
