import React from "react";

const QuizStatCard = ({ icon: Icon, label, value, color = "#FF6B00" }) => {
  return (
    <div
      className="bg-white rounded-xl border p-4 shadow-md 
                   hover:shadow-lg transition-shadow duration-300
                   flex flex-col items-center justify-center text-center"
      style={{ borderColor: "rgba(0,0,0,0.05)" }}
    >
      {/* Icon */}
      {Icon && (
        <div
          className="w-12 h-12 flex items-center justify-center rounded-lg mb-2"
          style={{ background: "#FFF3E0" }}
        >
          <Icon size={24} style={{ color: color }} />
        </div>
      )}

      {/* Label */}
      <span className="text-xs font-semibold mb-1" style={{ color: "#9ca3af" }}>
        {label}
      </span>

      {/* Value */}
      <span className="text-lg font-bold" style={{ color: "#030712" }}>
        {value}
      </span>
    </div>
  );
};

export default QuizStatCard;
