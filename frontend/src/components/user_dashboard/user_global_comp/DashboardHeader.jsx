import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../../../services/apiConfig";

const DashboardHeader = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "Guest User",
    initial: "G",
    balance: 0,
    wallet: 0,
    avatar: null,
  });

  useEffect(() => {
    if (!document.getElementById("dashboard-fonts")) {
      const link = document.createElement("link");
      link.id = "dashboard-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }

    const loadUser = () => {
      let initialUser = null;
      try {
        const stored = localStorage.getItem("user");
        if (stored) initialUser = JSON.parse(stored);
      } catch (e) {}

      let avatar = null;
      try {
        avatar = localStorage.getItem("userAvatar") || null;
      } catch (e) {}

      if (initialUser) {
        setUserData({
          username: initialUser.username || "Guest User",
          initial: (initialUser.username || "G").charAt(0).toUpperCase(),
          balance: initialUser.creds || 0,
          wallet: initialUser.wallet || 0,
          avatar,
        });
      }
    };

    loadUser();

    const handleAvatarUpdate = (e) => {
      setUserData((prev) => ({ ...prev, avatar: e.detail.avatar }));
    };
    window.addEventListener("avatarUpdated", handleAvatarUpdate);

    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; 
        const res = await fetch(apiUrl("/auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        if (data && (data.id || data._id)) {
          const avatar = localStorage.getItem("userAvatar") || null;
          setUserData(prev => ({
            ...prev,
            username: data.username || prev.username,
            initial: (data.username || prev.username).charAt(0).toUpperCase(),
            balance: data.creds !== undefined ? data.creds : prev.balance,
            wallet: data.wallet !== undefined ? data.wallet : prev.wallet,
            avatar: data.avatar || avatar || prev.avatar,
          }));
          localStorage.setItem("user", JSON.stringify(data));
          if (data.avatar) localStorage.setItem("userAvatar", data.avatar);
        }
      } catch (err) {}
    };
    fetchMe();

    const handleBalanceUpdate = (event) => {
      const nextBalance = event?.detail?.newBalance;
      
      if (typeof nextBalance === "number") {
        setUserData((prev) => ({ ...prev, balance: nextBalance }));
        
        try {
          const rawUser = localStorage.getItem("user");
          let parsed = rawUser ? JSON.parse(rawUser) : { creds: 0, wallet: 0 };
          parsed.creds = nextBalance;
          localStorage.setItem("user", JSON.stringify(parsed));
        } catch (e) {}
      }
      
      if (localStorage.getItem("token")) {
        fetchMe();
      }
    };
    
    window.addEventListener("balanceUpdated", handleBalanceUpdate);
    window.addEventListener("walletUpdated", handleBalanceUpdate);

    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
      window.removeEventListener("balanceUpdated", handleBalanceUpdate);
      window.removeEventListener("walletUpdated", handleBalanceUpdate);
    };
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8"
      style={{
        background: "rgba(10,10,10,0.98)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,107,0,0.15)",
        boxShadow: "0 2px 24px rgba(0,0,0,0.4)",
        height: "65px",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-1.5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,107,0,0.2)",
          }}
          aria-label="Toggle sidebar"
        >
          <span className="block w-4 h-0.5 rounded-full" style={{ background: "#FF6B00" }} />
          <span className="block w-4 h-0.5 rounded-full" style={{ background: "rgba(255,107,0,0.6)" }} />
          <span className="block w-3 h-0.5 rounded-full" style={{ background: "rgba(255,107,0,0.35)" }} />
        </button>

        <Link
          to="/dashboard"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.85rem",
            letterSpacing: "0.08em",
            lineHeight: 1,
            textDecoration: "none",
            color: "white",
          }}
        >
          REVA<span style={{ color: "#FF6B00" }}>Doo</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "rgba(255,255,255,0.5)",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B00")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <div
          className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300"
          style={{
            background: "rgba(255,107,0,0.1)",
            border: "1px solid rgba(255,107,0,0.25)",
            fontFamily: "'DM Sans', sans-serif",
            color: "rgba(255,255,255,0.7)",
          }}
          title="Account Balance"
        >
          <span className="hidden sm:inline">Balance:</span>
          <span style={{ color: "#FF6B00" }}>{userData.balance}</span>
        </div>

        <div className="hidden sm:block" style={{ width: 1, height: 28, background: "rgba(255,255,255,0.08)" }} />

        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => navigate("/dashboard/profile")}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden shrink-0"
            style={{
              background: userData.avatar ? "transparent" : "linear-gradient(135deg, #FF6B00, #FF8C00)",
              boxShadow: "0 4px 14px rgba(255,107,0,0.32)",
              border: "2px solid rgba(255,107,0,0.5)",
            }}
          >
            {userData.avatar ? (
              <img src={userData.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-sm font-bold">{userData.initial}</span>
            )}
          </div>
          <span className="hidden sm:block text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.7)" }}>
            {userData.username}
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, #FF6B00 50%, transparent 100%)" }} />
    </header>
  );
};

export default DashboardHeader;