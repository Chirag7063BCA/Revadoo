import React, { useEffect, useMemo, useState } from "react";
import { FiActivity, FiAward, FiBookOpen, FiCalendar, FiDollarSign, FiShield, FiUsers } from "react-icons/fi";

const API_BASE = "http://localhost:5000";
const RANGES = ["daily", "weekly", "monthly", "yearly", "overall"];

const palette = {
  bg: "#edf0f5",
  panel: "#101b2d",
  panel2: "#0c1526",
  text: "#eef4ff",
  muted: "#feffff",
  border: "rgba(255, 255, 255, 0.08)",
  orange: "#ff7a18",
  teal: "#2dd4bf",
  blue: "#38bdf8",
  purple: "#8b5cf6",
  green: "#22c55e",
  gold: "#f59e0b",
};

const toNumber = (value) => Number(value || 0);
const formatNumber = (value) => toNumber(value).toLocaleString();

const safeDate = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString();
};

const resolveLabel = (range) => range.charAt(0).toUpperCase() + range.slice(1);

const StatCard = ({ label, value, hint, Icon, tone }) => (
  <div className="relative overflow-hidden rounded-[28px] border p-5 shadow-2xl" style={{ background: `linear-gradient(135deg, ${palette.panel}, ${palette.panel2})`, borderColor: palette.border }}>
    <div className="absolute inset-0 opacity-25" style={{ background: `radial-gradient(circle at top right, ${tone} 0%, transparent 36%)` }} />
    <div className="relative flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.28em]" style={{ color: palette.muted }}>{label}</p>
        <div className="mt-2 text-3xl font-semibold" style={{ color: palette.text }}>{value}</div>
        <p className="mt-2 text-sm" style={{ color: palette.muted }}>{hint}</p>
      </div>
      <div className="rounded-2xl p-3" style={{ background: `${tone}22`, color: tone }}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const Panel = ({ title, subtitle, children }) => (
  <section className="rounded-[30px] border p-5 shadow-2xl" style={{ background: "rgba(255,255,255,0.96)", borderColor: "rgba(226,232,240,0.9)" }}>
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const chartPoints = (series, width, height, padding) => {
  const values = series.map((item) => toNumber(item.value ?? item.count ?? item.earned));
  const max = Math.max(1, ...values);
  const step = series.length > 1 ? (width - padding * 2) / (series.length - 1) : 0;
  return series.map((item, index) => {
    const x = padding + step * index;
    const y = height - padding - (toNumber(item.value ?? item.count ?? item.earned) / max) * (height - padding * 2);
    return { x, y, label: item.label || item.day || String(index), value: toNumber(item.value ?? item.count ?? item.earned) };
  });
};

const LineChart = ({ title, series, color }) => {
  const width = 560;
  const height = 220;
  const padding = 28;
  const points = chartPoints(series, width, height, padding);
  const polyline = points.map(({ x, y }) => `${x},${y}`).join(" ");

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d1728] p-5 shadow-2xl shadow-black/20">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: palette.muted }}>Trend</p>
          <h3 className="text-lg font-semibold" style={{ color: palette.text }}>{title}</h3>
        </div>
        <div className="text-xs" style={{ color: palette.muted }}>Live from MongoDB</div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full">
        {[0.25, 0.5, 0.75, 1].map((tick) => (
          <line key={tick} x1={padding} x2={width - padding} y1={height - padding - tick * (height - padding * 2)} y2={height - padding - tick * (height - padding * 2)} stroke="rgba(255,255,255,0.07)" />
        ))}
        {points.length > 0 && (
          <>
            <polyline fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" points={polyline} />
            <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={polyline} />
            {points.map(({ x, y, label }) => (
              <circle key={label + x} cx={x} cy={y} r="4.5" fill={color} stroke="#09111d" strokeWidth="2" />
            ))}
          </>
        )}
      </svg>
      <div className="mt-2 flex flex-wrap gap-2 text-xs" style={{ color: palette.muted }}>
        {points.map((item) => (
          <span key={item.label} className="rounded-full bg-white/5 px-2 py-1">{item.label}</span>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ title, items, color }) => {
  const width = 560;
  const height = 240;
  const padding = 28;
  const max = Math.max(1, ...items.map((item) => toNumber(item.value)));
  const barWidth = items.length ? (width - padding * 2) / items.length - 10 : 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d1728] p-5 shadow-2xl shadow-black/20">
      <p className="text-xs uppercase tracking-[0.25em]" style={{ color: palette.muted }}>Breakdown</p>
      <h3 className="mb-3 text-lg font-semibold" style={{ color: palette.text }}>{title}</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[240px] w-full">
        {items.map((item, index) => {
          const barHeight = (toNumber(item.value) / max) * (height - padding * 2);
          const x = padding + index * ((width - padding * 2) / items.length);
          const y = height - padding - barHeight;
          return (
            <g key={item.label}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="10" fill={color} />
              <text x={x + barWidth / 2} y={height - 8} fill={palette.muted} fontSize="10" textAnchor="middle">
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [range, setRange] = useState("overall");
  const [data, setData] = useState({ loading: true, stats: {} });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/admin/dashboard/overview?range=${range}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (!active) return;
        setData({ loading: false, ...json });
      } catch (error) {
        if (active) setData((prev) => ({ ...prev, loading: false, error: "Failed to load admin dashboard data." }));
        console.error(error);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [range]);

  const stats = useMemo(() => ([
    { label: "Total Users", value: formatNumber(data.stats?.totalUsers), hint: "Accounts in the system", Icon: FiUsers, tone: palette.blue },
    { label: "Active Users", value: formatNumber(data.stats?.activeUsers), hint: "Currently active", Icon: FiActivity, tone: palette.teal },
    { label: "Quizzes", value: formatNumber(data.stats?.totalQuizzes), hint: "Quiz records", Icon: FiBookOpen, tone: palette.purple },
    { label: "Tasks", value: formatNumber(data.stats?.totalTasks), hint: `${formatNumber(data.stats?.activeTasks)} active`, Icon: FiAward, tone: palette.orange },
    { label: "Surveys", value: formatNumber(data.stats?.totalSurveys), hint: "Survey records", Icon: FiShield, tone: palette.green },
    { label: "Total Earned", value: formatNumber(data.stats?.totalEarned), hint: "All credits", Icon: FiDollarSign, tone: palette.gold },
  ]), [data.stats]);

  const activitySeries = useMemo(() => (data.creditsByDay || []).map((item) => ({ label: item.day, value: item.earned || item.count || 0 })), [data.creditsByDay]);
  const earningsSeries = useMemo(() => (data.creditsByDay || []).map((item) => ({ label: item.day, value: item.earned || 0 })), [data.creditsByDay]);
  const distribution = useMemo(() => ([
    { label: "Users", value: data.stats?.totalUsers || 0 },
    { label: "Quizzes", value: data.stats?.totalQuizzes || 0 },
    { label: "Tasks", value: data.stats?.totalTasks || 0 },
    { label: "Surveys", value: data.stats?.totalSurveys || 0 },
  ]), [data.stats]);

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(circle at top left, rgba(255,122,24,0.18), transparent 25%), radial-gradient(circle at top right, rgba(45,212,191,0.16), transparent 20%), linear-gradient(180deg, ${palette.bg}, #0d1728 55%, #f8fafc 55%, #f8fafc 100%)` }}>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <header className="mb-6 rounded-[34px] border p-6 shadow-2xl" style={{ background: "linear-gradient(135deg, rgba(9,17,29,0.92), rgba(17,32,54,0.94))", borderColor: palette.border }}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em]" style={{ color: palette.teal }}>Admin Analytics</p>
              <h1 className="mt-2 text-3xl font-bold text-white md:text-5xl">Admin control center</h1>
              <p className="mt-3 max-w-3xl text-sm md:text-base" style={{ color: palette.muted }}>
                Track users, auth health, quizzes, tasks, surveys, leaderboard points, and earnings across daily, weekly, monthly, yearly, and overall views.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {RANGES.map((item) => (
                <button
                  key={item}
                  onClick={() => setRange(item)}
                  className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
                  style={{
                    background: range === item ? `linear-gradient(135deg, ${palette.orange}, #ffb02e)` : "rgba(255,255,255,0.06)",
                    color: "#fff",
                    border: `1px solid ${range === item ? "transparent" : palette.border}`,
                  }}
                >
                  {resolveLabel(item)}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm" style={{ color: palette.muted }}>
            <FiCalendar />
            Showing {resolveLabel(range)} data
          </div>
        </header>

        {data.loading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-slate-600">Loading live admin analytics...</div>
        ) : data.error ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-red-700">{data.error}</div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {stats.map((item) => <StatCard key={item.label} {...item} />)}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <LineChart title={`${resolveLabel(range)} activity`} series={activitySeries} color={palette.teal} />
              <LineChart title={`${resolveLabel(range)} earnings`} series={earningsSeries} color={palette.orange} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <BarChart title="Core platform totals" items={distribution} color={palette.purple} />
              <Panel title="Account Health" subtitle="Status and password reset visibility">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Banned users</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900">{formatNumber(data.stats?.bannedUsers)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Password resets pending</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900">{formatNumber(data.stats?.passwordResetPendingUsers)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Leaderboard users</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900">{formatNumber(data.stats?.totalLeaderboardUsers)}</div>
                  </div>
                </div>
              </Panel>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <Panel title="Recent Users" subtitle="Latest registrations in the selected range">
                <div className="space-y-3">
                  {(data.recentUsers || []).map((user) => (
                    <div key={user._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <div>
                        <div className="font-semibold text-slate-900">{user.username || "User"}</div>
                        <div className="text-sm text-slate-500">{user.email || ""}</div>
                      </div>
                      <div className="text-right text-sm text-slate-600">
                        <div>Wallet {formatNumber(user.wallet)}</div>
                        <div>Creds {formatNumber(user.creds)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Recent Quizzes">
                <div className="space-y-2">
                  {(data.recentQuizzes || []).map((item) => (
                    <div key={item._id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <div className="font-medium text-slate-900">{item.title || "Quiz"}</div>
                      <div className="text-slate-500">Reward {formatNumber(item.reward)}</div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Recent Attempts">
                <div className="space-y-2">
                  {(data.recentAttempts || []).map((attempt) => (
                    <div key={attempt._id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <div className="font-medium text-slate-900">Score {formatNumber(attempt.score)} / Earned {formatNumber(attempt.earnedCoins)}</div>
                      <div className="text-slate-500">{safeDate(attempt.createdAt)}</div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Panel title="Recent Tasks">
                <div className="space-y-2">
                  {(data.recentTasks || []).map((item) => (
                    <div key={item._id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <div className="font-medium text-slate-900">{item.title || "Task"}</div>
                      <div className="text-slate-500">Reward {formatNumber(item.reward)}</div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Recent Surveys">
                <div className="space-y-2">
                  {(data.recentSurveys || []).map((item) => (
                    <div key={item._id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <div className="font-medium text-slate-900">{item.title || "Survey"}</div>
                      <div className="text-slate-500">Reward {formatNumber(item.reward)}</div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
