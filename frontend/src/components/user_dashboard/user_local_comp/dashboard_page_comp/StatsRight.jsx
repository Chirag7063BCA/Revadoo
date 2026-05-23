import React from "react";

const StatsRight = ({ selectedStat }) => {
  const weeklyData = {
    tasks: {
      label: "Tasks Completed",
      color: "#FF6B00",
      total: 15,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [3, 5, 4, 7, 6, 9, 5],
      unit: "",
    },
    earnings: {
      label: "Earnings",
      color: "#FF6B00",
      total: 240,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [12, 18, 15, 22, 28, 35, 20],
      unit: "$",
    },
    surveys: {
      label: "Surveys Completed",
      color: "#FF6B00",
      total: 8,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [1, 2, 1, 3, 2, 4, 2],
      unit: "",
    },
    referrals: {
      label: "Referrals",
      color: "#FF6B00",
      total: 5,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [0, 1, 0, 2, 1, 2, 1],
      unit: "",
    },
  };

  const current = weeklyData[selectedStat] || weeklyData.tasks;
  const max = Math.max(...current.values);
  const weeklyTotal = current.values.reduce((sum, val) => sum + val, 0);
  const weeklyAverage = (weeklyTotal / 7).toFixed(1);
  const growthRates = { tasks: 12, earnings: 8, surveys: 15, referrals: 20 };
  const growthRate = growthRates[selectedStat] || 0;
  const bestDayIndex = current.values.indexOf(Math.max(...current.values));
  const bestDay = current.days[bestDayIndex];
  const bestDayValue = current.values[bestDayIndex];
  const isPositive = growthRate >= 0;

  const fmt = (val) => (selectedStat === "earnings" ? `$${val}` : val);

  return (
    <div
      className="flex flex-col h-full w-full rounded-2xl p-4 sm:p-6"
      style={{
        background: "#ffffff",
        border: "1.5px solid rgba(0,0,0,0.07)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-1"
            style={{ color: "#FF6B00" }}
          >
            {current.label}
          </p>
          <h3
            className="text-3xl sm:text-4xl font-black leading-none"
            style={{ color: "#030712" }}
          >
            {fmt(current.total)}
          </h3>
          <p
            className="text-[11px] mt-1.5 font-medium"
            style={{ color: "#9ca3af" }}
          >
            This week
          </p>
        </div>

        {/* Growth pill — moved to header top-right */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: isPositive
              ? "rgba(255,107,0,0.08)"
              : "rgba(239,68,68,0.08)",
            color: isPositive ? "#FF6B00" : "#ef4444",
            border: `1px solid ${isPositive ? "rgba(255,107,0,0.2)" : "rgba(239,68,68,0.2)"}`,
          }}
        >
          <span>{isPositive ? "↑" : "↓"}</span>
          <span>{Math.abs(growthRate)}%</span>
          <span className="font-normal opacity-70">vs last wk</span>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div
        className="grid grid-cols-3 gap-2 mb-5 rounded-xl p-3"
        style={{
          background: "rgba(0,0,0,0.02)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {[
          { label: "Weekly Total", val: fmt(weeklyTotal) },
          { label: "Daily Avg", val: fmt(weeklyAverage) },
          { label: "Best Day", val: `${bestDay} (${bestDayValue})` },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <p
              className="text-[10px] font-medium mb-1"
              style={{ color: "#9ca3af" }}
            >
              {item.label}
            </p>
            <p
              className="text-xs sm:text-sm font-bold"
              style={{ color: "#030712" }}
            >
              {item.val}
            </p>
          </div>
        ))}
      </div>

      {/* ── Bar Chart ── */}
      <div className="flex gap-1 sm:gap-2 flex-1 min-h-[120px]">
        {/* Y-axis */}
        <div
          className="flex flex-col justify-between text-right pr-2"
          style={{ height: 120 }}
        >
          {[max, Math.round(max / 2), 0].map((tick) => (
            <span
              key={tick}
              className="text-[9px] leading-none"
              style={{ color: "#d1d5db" }}
            >
              {current.unit}
              {tick}
            </span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex items-end gap-1.5 sm:gap-2.5 flex-1">
          {current.days.map((day, i) => {
            const isLast = i === current.days.length - 1;
            const isBest = i === bestDayIndex;
            const heightPct = max > 0 ? (current.values[i] / max) * 120 : 2;

            return (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 flex-1"
              >
                <div
                  className="w-full relative group"
                  style={{
                    height: `${heightPct}px`,
                    background:
                      isLast || isBest ? "#FF6B00" : "rgba(255,107,0,0.12)",
                    borderRadius: "6px 6px 3px 3px",
                    transition: "all 0.4s ease",
                  }}
                >
                  {/* Top accent line on active bar */}
                  {(isLast || isBest) && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: "rgba(255,255,255,0.4)",
                        borderRadius: "6px 6px 0 0",
                      }}
                    />
                  )}
                  {/* Tooltip */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-[10px] text-white rounded-md px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {current.unit}
                    {current.values[i]}
                  </div>
                </div>
                <span
                  className="text-[9px] sm:text-[10px] font-medium"
                  style={{ color: isLast || isBest ? "#FF6B00" : "#9ca3af" }}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        className="flex items-center justify-between mt-4 pt-4"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <p className="text-[11px] font-medium" style={{ color: "#9ca3af" }}>
          7-day performance
        </p>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: "#FF6B00",
              }}
            />
            <span className="text-[10px]" style={{ color: "#9ca3af" }}>
              Best / Today
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: "rgba(255,107,0,0.15)",
              }}
            />
            <span className="text-[10px]" style={{ color: "#9ca3af" }}>
              Other days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsRight;
