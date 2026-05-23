import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, CheckCircle, Calendar } from "lucide-react";
import { apiUrl } from "../../../../services/apiConfig";

const WelcomeRight = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "User",
    initial: "U",
    avatar: null,
    memberSince: "",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const avatar = localStorage.getItem("userAvatar") || null;
      if (stored) {
        const user = JSON.parse(stored);
        setUserData({
          username: user.username || "User",
          initial: (user.username || "U").charAt(0).toUpperCase(),
          avatar,
          memberSince: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "N/A",
        });
      }
    } catch (e) {}

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
            memberSince: data.user.createdAt
              ? new Date(data.user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "N/A",
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

    const handleAvatarUpdate = (e) => {
      setUserData((prev) => ({ ...prev, avatar: e.detail.avatar }));
    };
    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () =>
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
  }, []);

  return (
    <div
      className="flex flex-col gap-6 w-full"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Profile Card */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="flex items-center justify-center rounded-full overflow-hidden"
            style={{
              width: "110px",
              height: "110px",
              background: userData.avatar ? "transparent" : "#FF6B00",
              border: "2px solid rgba(255,107,0,0.2)",
              boxShadow: "0 4px 12px rgba(255,107,0,0.1)",
            }}
          >
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                style={{
                  color: "#fff",
                  fontSize: "48px",
                  fontWeight: 800,
                }}
              >
                {userData.initial}
              </span>
            )}
          </div>

          {/* Online Status */}
          <div
            className="absolute bottom-0 right-0 rounded-full"
            style={{
              width: "18px",
              height: "18px",
              background: "#22c55e",
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(34,197,94,0.3)",
            }}
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <p
            className="text-xs uppercase font-bold mb-1"
            style={{ color: "#6b7280" }}
          >
            Your Profile
          </p>
          <h3
            className="text-xl sm:text-2xl font-black"
            style={{ color: "#030712" }}
          >
            {userData.username}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div
              className="px-2.5 py-1 rounded-lg flex items-center gap-1.5"
              style={{ background: "rgba(34,197,94,0.1)" }}
            >
              <CheckCircle
                width={14}
                height={14}
                style={{ color: "#22c55e" }}
              />
              <span
                className="text-xs font-semibold"
                style={{ color: "#22c55e" }}
              >
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Info Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Member Since */}
        <div
          className="p-3 rounded-lg flex items-center gap-2"
          style={{
            background: "rgba(0,0,0,0.02)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="p-2 rounded-lg flex-shrink-0"
            style={{ background: "rgba(255,107,0,0.1)" }}
          >
            <Calendar width={16} height={16} style={{ color: "#FF6B00" }} />
          </div>
          <div className="min-w-0">
            <p
              className="text-xs font-bold uppercase"
              style={{ color: "#6b7280" }}
            >
              Member Since
            </p>
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "#030712" }}
            >
              {userData.memberSince}
            </p>
          </div>
        </div>

        {/* Account Button */}
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="p-3 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-md"
          style={{
            background: "#FF6B00",
            border: "1px solid rgba(255,107,0,0.2)",
            color: "#ffffff",
          }}
        >
          <Settings width={16} height={16} />
          <span className="text-xs font-bold uppercase">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeRight;
