import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../../services/apiConfig";

// ── Component 1: Left Side ──
const WelcomeLeft = ({ greeting, username }) => {
  return (
    <div className="flex flex-col gap-2">
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#FF6B00" }}
      >
        {greeting} 👋
      </p>
      <h2
        className="text-2xl font-bold"
        style={{ color: "#0a0a0a", lineHeight: 1.2 }}
      >
        Welcome, {username}!
      </h2>
      <p className="text-sm" style={{ color: "#6b7280" }}>
        Ready to Unlock Your Earning Potential?
      </p>
      <p className="text-xs" style={{ color: "#9ca3af" }}>
        Complete surveys, refer friends & grow your earnings every day.
      </p>
    </div>
  );
};

// ── Component 2: Right Side ──
const WelcomeRight = ({ userData }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Name on top */}
      <p className="text-sm font-semibold" style={{ color: "#0a0a0a" }}>
        {userData.username}
      </p>

      {/* Avatar below name */}
      <div
        className="relative flex items-center justify-center rounded-full overflow-hidden flex-shrink-0"
        style={{
          width: 72,
          height: 72,
          border: "2.5px solid #FF6B00",
          boxShadow:
            "0 0 0 4px rgba(255,107,0,0.1), 0 4px 16px rgba(255,107,0,0.2)",
          background: userData.avatar
            ? "transparent"
            : "linear-gradient(135deg, #FF6B00, #FF8C00)",
        }}
      >
        {userData.avatar ? (
          <img
            src={userData.avatar}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span style={{ color: "#fff", fontSize: "1.7rem", fontWeight: 700 }}>
            {userData.initial}
          </span>
        )}

        {/* Online dot */}
        <div
          className="absolute bottom-1 right-1 rounded-full"
          style={{
            width: 13,
            height: 13,
            background: "#FF6B00",
            border: "2px solid #ffffff",
          }}
        />
      </div>
    </div>
  );
};

// ── Main Export: WelcomeSection ──
const WelcomeSection = () => {
  const [userData, setUserData] = useState({
    username: "User",
    initial: "U",
    avatar: null,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    // Step 1: Load from localStorage instantly
    try {
      const stored = localStorage.getItem("user");
      const avatar = localStorage.getItem("userAvatar") || null;
      if (stored) {
        const user = JSON.parse(stored);
        setUserData({
          username: user.username || "User",
          initial: (user.username || "U").charAt(0).toUpperCase(),
          avatar,
        });
      }
    } catch (e) {}

    // Step 2: Fetch fresh from API
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(apiUrl("/auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.user) {
          const avatar =
            data.user.avatar || localStorage.getItem("userAvatar") || null;
          setUserData({
            username: data.user.username || "User",
            initial: (data.user.username || "U").charAt(0).toUpperCase(),
            avatar,
          });
          localStorage.setItem("user", JSON.stringify(data.user));
          if (data.user.avatar) {
            localStorage.setItem("userAvatar", data.user.avatar);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchMe();

    // Step 3: Live avatar sync
    const handleAvatarUpdate = (e) => {
      setUserData((prev) => ({ ...prev, avatar: e.detail.avatar }));
    };
    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () =>
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
  }, []);

  return (
    <div
      className="flex items-center justify-between w-full rounded-2xl px-6 py-5"
      style={{
        background: "#ffffff",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Left */}
      <WelcomeLeft greeting={getGreeting()} username={userData.username} />

      {/* Dashed divider — matches wireframe */}
      <div
        style={{
          width: "1px",
          alignSelf: "stretch",
          borderLeft: "2px dashed #f0f0f0",
          margin: "0 24px",
        }}
      />

      {/* Right */}
      <WelcomeRight userData={userData} />
    </div>
  );
};

export default WelcomeSection;
