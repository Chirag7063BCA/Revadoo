import React from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2, DollarSign, TrendingDown, Eye } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Games",
      icon: Gamepad2,
      color: "#FF6B00",
      bg: "rgba(255,107,0,0.1)",
      border: "rgba(255,107,0,0.15)",
      route: "/dashboard/games",
    },
    {
      label: "Deposit",
      icon: DollarSign,
      color: "#FF6B00",
      bg: "rgba(255,107,0,0.1)",
      border: "rgba(255,107,0,0.15)",
      route: "/dashboard/wallet",
    },
    {
      label: "Withdraw",
      icon: TrendingDown,
      color: "#FF6B00",
      bg: "rgba(255,107,0,0.1)",
      border: "rgba(255,107,0,0.15)",
      route: "/dashboard/wallet",
    },
    {
      label: "View Ads",
      icon: Eye,
      color: "#FF6B00",
      bg: "rgba(255,107,0,0.1)",
      border: "rgba(255,107,0,0.15)",
      route: "/dashboard/ads",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        return (
          <button
            key={index}
            onClick={() => navigate(action.route)}
            className="flex flex-col items-center justify-center gap-3 rounded-xl py-5 px-4 transition-all duration-200 hover:scale-105"
            style={{
              background: "#ffffff",
              border: `1px solid ${action.border}`,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 20px rgba(0,0,0,0.08)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
            }}
          >
            {/* Icon circle */}
            <div
              className="flex items-center justify-center rounded-lg p-2.5"
              style={{
                background: action.bg,
                border: `1px solid ${action.border}`,
              }}
            >
              <IconComponent width={20} height={20} color={action.color} />
            </div>

            {/* Label */}
            <span
              className="text-sm font-bold text-center"
              style={{ color: "#030712" }}
            >
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;
