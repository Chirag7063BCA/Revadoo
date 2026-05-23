import React, { useState, useEffect } from "react";
import { User, Mail, Calendar, BadgeCheck } from "lucide-react";
import { apiUrl } from "../../../../services/apiConfig";

const UserProfileOverview = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        }

        // Try to fetch fresh data from API
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(
            apiUrl("/user/profile"),
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
          }
        } catch (apiErr) {
          console.warn("Could not fetch profile from API:", apiErr.message);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-20 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 sm:p-8"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Profile Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ background: "#FF6B00" }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "#030712" }}
              >
                {user?.username}
              </h2>
              <p style={{ color: "#6b7280" }} className="text-sm">
                Member Account
              </p>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{ background: "rgba(255,107,0,0.1)" }}
              >
                <Mail width={18} height={18} style={{ color: "#FF6B00" }} />
              </div>
              <div className="min-w-0">
                <p
                  className="text-xs uppercase font-bold"
                  style={{ color: "#6b7280" }}
                >
                  Email
                </p>
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: "#030712" }}
                >
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{ background: "rgba(255,107,0,0.1)" }}
              >
                <Calendar width={18} height={18} style={{ color: "#FF6B00" }} />
              </div>
              <div className="min-w-0">
                <p
                  className="text-xs uppercase font-bold"
                  style={{ color: "#6b7280" }}
                >
                  Member Since
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#030712" }}
                >
                  {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>

            {/* Referral Code */}
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{ background: "rgba(255,107,0,0.1)" }}
              >
                <BadgeCheck
                  width={18}
                  height={18}
                  style={{ color: "#FF6B00" }}
                />
              </div>
              <div className="min-w-0">
                <p
                  className="text-xs uppercase font-bold"
                  style={{ color: "#6b7280" }}
                >
                  Referral Code
                </p>
                <p
                  className="text-sm font-semibold font-mono"
                  style={{ color: "#030712" }}
                >
                  {user?.referralCode || "N/A"}
                </p>
              </div>
            </div>

            {/* Account Status */}
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{ background: "rgba(34,197,94,0.1)" }}
              >
                <BadgeCheck
                  width={18}
                  height={18}
                  style={{ color: "#22c55e" }}
                />
              </div>
              <div className="min-w-0">
                <p
                  className="text-xs uppercase font-bold"
                  style={{ color: "#6b7280" }}
                >
                  Account Status
                </p>
                <div
                  className="text-sm font-semibold px-2 py-1 rounded inline-block mt-1"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    color: "#22c55e",
                  }}
                >
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Stats */}
        <div className="w-full md:w-auto grid grid-cols-3 md:flex md:flex-col gap-3 md:min-w-max">
          {[
            {
              label: "Wallet",
              value: `$${user?.wallet || 0}`,
              color: "#FF6B00",
            },
            { label: "Balance", value: user?.creds || 0, color: "#FF6B00" },
            {
              label: "Total Tasks",
              value: user?.tasksCompleted || 0,
              color: "#FF6B00",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-xl p-4 text-center md:text-left"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <p
                className="text-xs uppercase font-bold mb-1"
                style={{ color: "#6b7280" }}
              >
                {stat.label}
              </p>
              <p
                className="text-lg md:text-xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileOverview;
