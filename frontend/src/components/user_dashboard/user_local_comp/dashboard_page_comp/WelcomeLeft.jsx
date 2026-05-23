import React from "react";

const WelcomeLeft = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const username = (() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) return JSON.parse(stored).username || "User";
    } catch (e) {}
    return "User";
  })();

  return (
    <div
      className="flex flex-col gap-6 w-full"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Greeting Badge */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ background: "rgba(255,107,0,0.1)" }}
        >
          <span style={{ fontSize: "20px" }}>👋</span>
        </div>
        <div>
          <p
            className="text-xs uppercase font-bold tracking-wider"
            style={{ color: "#FF6B00" }}
          >
            {getGreeting()}
          </p>
          <p
            className="text-sm font-medium mt-0.5"
            style={{ color: "#6b7280" }}
          >
            Welcome back to your dashboard
          </p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <p
          className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight"
          style={{ color: "#030712", lineHeight: 1.2 }}
        >
          Welcome Back,
        </p>
        <p
          className="text-2xl sm:text-3xl md:text-4xl font-black"
          style={{ color: "#FF6B00", lineHeight: 1.2 }}
        >
          {username}!
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <p
          className="text-sm sm:text-base font-semibold"
          style={{ color: "#030712" }}
        >
          Ready to unlock your earning potential today?
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
          Complete surveys, play games, and earn rewards. You're just a few
          clicks away from growing your portfolio.
        </p>
      </div>

      {/* Quick Stats Inline */}
      <div
        className="grid grid-cols-2 gap-3 pt-4 border-t"
        style={{ borderColor: "rgba(0,0,0,0.05)" }}
      >
        <div>
          <p
            className="text-xs uppercase font-bold mb-1"
            style={{ color: "#6b7280" }}
          >
            Today's Earnings
          </p>
          <p className="text-lg font-black" style={{ color: "#FF6B00" }}>
            $0.00
          </p>
        </div>
        <div>
          <p
            className="text-xs uppercase font-bold mb-1"
            style={{ color: "#6b7280" }}
          >
            Active Streaks
          </p>
          <p className="text-lg font-black" style={{ color: "#FF6B00" }}>
            0 Days
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLeft;
