// WalletQuickActions.jsx
import { useState } from "react";
import CredsConversionPanel from "./CredsConversionPanel";

const actions = [
  { icon: "📊", label: "Earnings Report", desc: "View full report" },
  { icon: "📧", label: "Payment Settings", desc: "Manage payouts" },
  { icon: "📱", label: "Mobile Money", desc: "Link mobile wallet" },
  { icon: "⚙️", label: "Support", desc: "Get help" },
];

const ActionCard = ({ icon, label, desc }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#FFF0E6" : "#fff",
        border: `1.5px solid ${hov ? "#FF6B00" : "#eee"}`,
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.15s",
        fontFamily: "'DM Sans', sans-serif",
        textAlign: "left",
        outline: "none",
        width: "100%",
      }}
    >
      <span style={{ fontSize: "22px" }}>{icon}</span>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 700,
            color: hov ? "#FF6B00" : "#000",
            transition: "color 0.15s",
          }}
        >
          {label}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#aaa" }}>
          {desc}
        </p>
      </div>
    </button>
  );
};

const WalletQuickActions = () => {
  const [showConversionPanel, setShowConversionPanel] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .wallet-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        @media (max-width: 640px) {
          .wallet-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
      <div style={{ fontFamily: "'DM Sans', sans-serif", marginTop: "16px" }}>
        <div className="flex items-center justify-between gap-3" style={{ marginBottom: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#000" }}>
            Quick Actions
          </h3>
          <button
            type="button"
            onClick={() => setShowConversionPanel((current) => !current)}
            className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-100"
          >
            Convert Creds
          </button>
        </div>
        <div className="wallet-actions-grid">
          {actions.map((action, index) => (
            <ActionCard key={index} icon={action.icon} label={action.label} desc={action.desc} />
          ))}
        </div>
        {showConversionPanel ? (
          <div className="mt-4">
            <CredsConversionPanel />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default WalletQuickActions;