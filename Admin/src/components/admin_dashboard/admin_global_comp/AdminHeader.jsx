import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../../utils/adminAuth";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

const AdminHeader = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState({
    username: "Admin",
    initial: "A",
    balance: 0,
    avatar: null,
  });

  useEffect(() => {
    if (!document.getElementById("dashboard-fonts")) {
      const link = document.createElement("link");
      link.id = "dashboard-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }

    const loadUser = () => {
      let initialUser = null;
      try {
        const stored = localStorage.getItem("user");
        if (stored) initialUser = JSON.parse(stored);
      } catch (error) {
        console.warn("AdminHeader: failed to parse stored user", error);
      }

      let avatar = null;
      try {
        avatar = localStorage.getItem("userAvatar") || null;
      } catch (error) {
        console.warn("AdminHeader: failed to read avatar", error);
      }

      if (initialUser) {
        setUserData({
          username: initialUser.username || "Admin",
          initial: (initialUser.username || "A").charAt(0).toUpperCase(),
          balance: initialUser.creds || 0,
          avatar,
        });
      }
    };

    loadUser();

    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data && data.id) {
          const avatar = localStorage.getItem("userAvatar") || null;
          setUserData({
            username: data.username || "Admin",
            initial: (data.username || "A").charAt(0).toUpperCase(),
            balance: data.creds || 0,
            avatar: data.avatar || avatar,
          });
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to fetch admin user", err);
      }
    };
    fetchMe();

    // STEP 3 INTEGRATED HERE: Instantly catch real-time balance
    const handleBalanceUpdate = (event) => {
      const nextBalance = event?.detail?.newBalance;
      
      if (typeof nextBalance === "number") {
        setUserData((prev) => ({ ...prev, balance: nextBalance }));
        try {
          const rawUser = localStorage.getItem("user");
          if (rawUser) {
            const parsed = JSON.parse(rawUser);
            localStorage.setItem("user", JSON.stringify({ ...parsed, creds: nextBalance }));
          }
        } catch (e) {}
      }
      
      fetchMe(); 
    };

    window.addEventListener("balanceUpdated", handleBalanceUpdate);
    window.addEventListener("walletUpdated", handleBalanceUpdate);

    return () => {
      window.removeEventListener("balanceUpdated", handleBalanceUpdate);
      window.removeEventListener("walletUpdated", handleBalanceUpdate);
    };
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/", { replace: true });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
      style={{
        background: "rgba(10,10,10,0.98)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,107,0,0.15)",
        boxShadow: "0 2px 24px rgba(0,0,0,0.4)",
        height: "65px",
      }}
    >
      {/* Logo */}
      <Link
        to="/Admin"
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

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        {/* <button
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "rgba(255,255,255,0.5)",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B00")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
          }
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button> */}

        {/* Balance Display */}
        {/* <div
          className="flex items-center gap-2 px-4 py-1 rounded-lg text-sm font-semibold"
          style={{
            background: "rgba(255,107,0,0.1)",
            border: "1px solid rgba(255,107,0,0.25)",
            fontFamily: "'DM Sans', sans-serif",
            color: "rgba(255,255,255,0.7)",
          }}
          title="Account Balance"
        >
          Balance: <span style={{ color: "#FF6B00" }}>{userData.balance}</span>
        </div> */}

        {/* Divider */}
        <div
          style={{ width: 1, height: 28, background: "rgba(255,255,255,0.08)" }}
        />

        {/* Profile */}
        {/* <div className="flex items-center gap-3 cursor-pointer">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{
              background: userData.avatar
                ? "transparent"
                : "linear-gradient(135deg, #FF6B00, #FF8C00)",
              boxShadow: "0 4px 14px rgba(255,107,0,0.32)",
              border: userData.avatar ? "2px solid rgba(255,107,0,0.5)" : "none",
              overflow: "hidden"
            }}
          >
            {userData.avatar ? (
              <img src={userData.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              userData.initial
            )}
          </div>
          <span
            className="text-sm font-medium"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {userData.username}
          </span>
        </div> */}

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-orange-500/30 px-4 py-2 text-sm font-medium text-orange-400 transition hover:bg-orange-500/10"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Logout
        </button>
      </div>

      {/* Orange accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #FF6B00 50%, transparent 100%)",
        }}
      />
    </header>
  );
};

export default AdminHeader;