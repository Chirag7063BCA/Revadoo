import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const StatisticsGraph = () => {
  const [chartReady, setChartReady] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const isDesktop =
    typeof window !== "undefined" ? window.matchMedia("(min-width: 640px)").matches : true;

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setChartReady(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === "undefined") return undefined;

    const updateSize = () => {
      setContainerSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Weekly earnings data
  const earningsData = [
    { day: "Mon", earnings: 5.5 },
    { day: "Tue", earnings: 8.25 },
    { day: "Wed", earnings: 6.75 },
    { day: "Thu", earnings: 12.0 },
    { day: "Fri", earnings: 9.5 },
    { day: "Sat", earnings: 15.25 },
    { day: "Sun", earnings: 8.0 },
  ];

  const totalEarnings = earningsData
    .reduce((sum, day) => sum + day.earnings, 0)
    .toFixed(2);
  const averageEarnings = (totalEarnings / 7).toFixed(2);
  const bestDay = earningsData.reduce(
    (max, day) => (day.earnings > max.earnings ? day : max),
    earningsData[0],
  );
  const weeklyGrowth = "+18%"; // Weekly growth compared to last week
  const chartWidth = Math.max(containerSize.width, 1);
  const chartHeight = Math.max(containerSize.height, 1);

  return (
    <div
      className="rounded-2xl p-7 w-full"
      style={{
        background: "#ffffff",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="rounded-full"
            style={{ width: 4, height: 28, background: "#FF6B00" }}
          />
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#030712" }}>
              Weekly Earnings
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
              Your daily earnings over the past week
            </p>
          </div>
        </div>

        {/* Stats Badge - Desktop Only */}
        <div
          className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(255,107,0,0.08)" }}
        >
          <div className="text-right">
            <p className="text-xs" style={{ color: "#9ca3af" }}>
              Total Earnings
            </p>
            <p className="text-sm font-bold" style={{ color: "#FF6B00" }}>
              ${totalEarnings}
            </p>
          </div>
          <div
            className="w-px h-8"
            style={{ background: "rgba(0,0,0,0.05)" }}
          />
          <div className="text-right">
            <p className="text-xs" style={{ color: "#9ca3af" }}>
              Daily Avg
            </p>
            <p className="text-sm font-bold" style={{ color: "#FF6B00" }}>
              ${averageEarnings}
            </p>
          </div>
        </div>
      </div>

      {/* Graph Section - Desktop Only */}
      <div ref={containerRef} className="hidden sm:block" style={{ height: 280, width: "100%", minWidth: 1 }}>
        {isDesktop && chartReady && containerSize.width > 0 && containerSize.height > 0 ? (
          <LineChart
            width={chartWidth}
            height={chartHeight}
            data={earningsData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid rgba(255,107,0,0.3)",
                borderRadius: "12px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                fontFamily: "'DM Sans', sans-serif",
              }}
              labelStyle={{ color: "#030712", fontWeight: 700 }}
              formatter={(value) => [`$${value}`, "Earnings"]}
            />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#FF6B00"
              strokeWidth={3}
              dot={{ fill: "#FF6B00", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: "#FF6B00" }}
            />
          </LineChart>
        ) : null}
      </div>

      {/* Mobile-Optimized 2x2 Grid (Visible only on small screens) */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {/* Total Earnings */}
        <div
          className="p-4 rounded-xl border"
          style={{ borderColor: "rgba(0,0,0,0.05)", background: "#ffffff" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "#9ca3af" }}
          >
            Total Earnings
          </p>
          <p className="text-lg font-black mt-1" style={{ color: "#030712" }}>
            ${totalEarnings}
          </p>
          <div
            className="h-1 w-8 rounded-full mt-1"
            style={{ background: "#FF6B00" }}
          />
        </div>

        {/* Daily Avg */}
        <div
          className="p-4 rounded-xl border"
          style={{ borderColor: "rgba(0,0,0,0.05)", background: "#ffffff" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "#9ca3af" }}
          >
            Daily Avg
          </p>
          <p className="text-lg font-black mt-1" style={{ color: "#030712" }}>
            ${averageEarnings}
          </p>
          <div
            className="h-1 w-8 rounded-full mt-1"
            style={{ background: "#FF6B00" }}
          />
        </div>

        {/* Best Day */}
        <div
          className="p-4 rounded-xl border"
          style={{ borderColor: "rgba(0,0,0,0.05)", background: "#ffffff" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "#9ca3af" }}
          >
            Best Day
          </p>
          <p className="text-lg font-black mt-1" style={{ color: "#FF6B00" }}>
            {bestDay.day}
          </p>
          <p
            className="text-[9px] mt-1 font-medium"
            style={{ color: "#9ca3af" }}
          >
            ${bestDay.earnings}
          </p>
        </div>

        {/* Growth */}
        <div
          className="p-4 rounded-xl border"
          style={{ borderColor: "rgba(0,0,0,0.05)", background: "#ffffff" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "#9ca3af" }}
          >
            Weekly Trend
          </p>
          <p className="text-lg font-black mt-1" style={{ color: "#FF6B00" }}>
            {weeklyGrowth}
          </p>
          <p
            className="text-[9px] mt-1 font-medium"
            style={{ color: "#9ca3af" }}
          >
            vs last week
          </p>
        </div>

        {/* Mini Sparkline Bar Chart at Bottom - Full Width */}
        <div
          className="col-span-2 p-4 rounded-xl border flex items-center justify-between"
          style={{ borderColor: "rgba(0,0,0,0.05)", background: "#ffffff" }}
        >
          <div className="flex flex-col">
            <p
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: "#9ca3af" }}
            >
              7-Day Summary
            </p>
            <p
              className="text-xs font-bold mt-0.5"
              style={{ color: "#030712" }}
            >
              Daily earnings
            </p>
          </div>
          <div className="h-8 w-32 flex items-end gap-1.5 px-1">
            {earningsData.map((d, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${(d.earnings / 15) * 100}%`,
                  background: i === 5 ? "#FF6B00" : "rgba(255,107,0,0.15)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Insights - Desktop Only */}
      <div
        className="hidden sm:block mt-4 pt-4 border-t"
        style={{ borderColor: "rgba(0,0,0,0.05)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="rounded-full"
              style={{ width: 10, height: 10, background: "#FF6B00" }}
            />
            <span className="text-sm" style={{ color: "#030712" }}>
              Weekly Earnings
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: "#9ca3af" }}>
                Best day:
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: "#FF6B00" }}
              >
                {bestDay.day} (${bestDay.earnings})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: "#9ca3af" }}>
                vs last week:
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: "#FF6B00" }}
              >
                ↑ {weeklyGrowth}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsGraph;
