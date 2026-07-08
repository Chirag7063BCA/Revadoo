import { useEffect, useMemo, useState } from "react";
import { FiDownload, FiLayers, FiPieChart } from "react-icons/fi";
import { downloadPdf } from "../../utils/pdfReport";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const RANGES = ["daily", "weekly", "monthly", "yearly", "overall"];

const formatNumber = (value) => Number(value || 0).toLocaleString();
const titleCase = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const Card = ({ title, value, hint, color }) => (
  <div className="rounded-3xl border bg-white p-5 shadow-sm">
    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{title}</div>
    <div className="mt-2 text-3xl font-semibold text-slate-950">{value}</div>
    <div className="mt-2 text-sm text-slate-500">{hint}</div>
    <div className="mt-4 h-1.5 rounded-full bg-slate-100">
      <div className="h-1.5 rounded-full" style={{ width: "100%", background: color }} />
    </div>
  </div>
);

const Section = ({ title, children, action }) => (
  <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {action}
      </div>
    </div>
    {children}
  </section>
);

const AdminReports = () => {
  const [range, setRange] = useState("overall");
  const [reportData, setReportData] = useState({ loading: true });

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/admin/dashboard/overview?range=${range}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (!alive) return;
        setReportData({ loading: false, ...json });
      } catch (error) {
        if (alive) setReportData((prev) => ({ ...prev, loading: false, error: "Failed to load reports" }));
        console.error("Failed to load reports", error);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [range]);

  const summarySections = useMemo(() => ([
    {
      heading: "User Summary",
      lines: [
        `Total users: ${formatNumber(reportData.stats?.totalUsers)}`,
        `Active users: ${formatNumber(reportData.stats?.activeUsers)}`,
        `Banned users: ${formatNumber(reportData.stats?.bannedUsers)}`,
        `Password reset pending: ${formatNumber(reportData.stats?.passwordResetPendingUsers)}`,
      ],
      rows: (reportData.recentUsers || []).slice(0, 10).map((user) => [
        user.username || "",
        user.email || "",
        String(user.status || "active"),
        String(user.wallet || 0),
        String(user.creds || 0),
      ]),
    },
    {
      heading: "Content Summary",
      lines: [
        `Quizzes: ${formatNumber(reportData.stats?.totalQuizzes)}`,
        `Tasks: ${formatNumber(reportData.stats?.totalTasks)}`,
        `Active tasks: ${formatNumber(reportData.stats?.activeTasks)}`,
        `Surveys: ${formatNumber(reportData.stats?.totalSurveys)}`,
      ],
      rows: [
        ...(reportData.recentQuizzes || []).slice(0, 8).map((item) => [
          "Quiz",
          item.title || "",
          String(item.reward || 0),
          item.createdAt || "",
        ]),
        ...(reportData.recentTasks || []).slice(0, 8).map((item) => [
          "Task",
          item.title || "",
          String(item.reward || 0),
          item.createdAt || "",
        ]),
        ...(reportData.recentSurveys || []).slice(0, 8).map((item) => [
          "Survey",
          item.title || "",
          String(item.reward || 0),
          item.createdAt || "",
        ]),
      ],
    },
    {
      heading: "Earnings Summary",
      lines: [
        `Total earned: ${formatNumber(reportData.stats?.totalEarned)}`,
        `Referral earnings: ${formatNumber(reportData.stats?.referralEarnings)}`,
        `Total referrals: ${formatNumber(reportData.stats?.totalReferrals)}`,
        `Leaderboard users: ${formatNumber(reportData.stats?.totalLeaderboardUsers)}`,
      ],
      rows: (reportData.topEarners || []).slice(0, 10).map((user, index) => [
        `#${index + 1}`,
        user.username || "",
        user.email || "",
        String(user.creds || 0),
      ]),
    },
    {
      heading: "Recent Attempts",
      lines: [
        `Attempt count: ${formatNumber(reportData.stats?.totalAttempts)}`,
      ],
      rows: (reportData.recentAttempts || []).slice(0, 10).map((attempt) => [
        String(attempt.score || 0),
        String(attempt.earnedCoins || 0),
        attempt.createdAt || "",
      ]),
    },
  ]), [reportData]);

  const exportAllPdf = () => {
    downloadPdf({
      filename: `admin-reports-${range}.pdf`,
      title: `Admin Reports - ${titleCase(range)}`,
      sections: summarySections,
      footer: [
        `Range: ${titleCase(range)}`,
        "Source: live MongoDB overview endpoint",
      ],
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-orange-500">Live Admin Reports</div>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">All sections, one report</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-500">
                This page pulls live backend data and turns it into report-ready summaries you can export as PDF.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {RANGES.map((item) => (
                <button
                  key={item}
                  onClick={() => setRange(item)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    range === item ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {titleCase(item)}
                </button>
              ))}
              <button
                onClick={exportAllPdf}
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <FiDownload />
                Export PDF
              </button>
            </div>
          </div>
        </section>

        {reportData.loading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-slate-600">Loading live reports...</div>
        ) : reportData.error ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-red-700">{reportData.error}</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card title="Users" value={formatNumber(reportData.stats?.totalUsers)} hint={`Active ${formatNumber(reportData.stats?.activeUsers)}`} color="#38bdf8" />
              <Card title="Content" value={formatNumber((reportData.stats?.totalQuizzes || 0) + (reportData.stats?.totalTasks || 0) + (reportData.stats?.totalSurveys || 0))} hint="Quizzes + tasks + surveys" color="#8b5cf6" />
              <Card title="Earnings" value={formatNumber(reportData.stats?.totalEarned)} hint="Total credited amount" color="#ff7a18" />
              <Card title="Leaderboard" value={formatNumber(reportData.stats?.totalLeaderboardUsers)} hint="Users with ranks" color="#22c55e" />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Section title="User Reports" action={<div className="mt-1 text-sm text-slate-500">Total users, status, wallets, creds</div>}>
                <div className="grid gap-3 md:grid-cols-2">
                  {(reportData.recentUsers || []).map((user) => (
                    <div key={user._id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="font-semibold text-slate-950">{user.username || "User"}</div>
                      <div className="text-sm text-slate-500">{user.email || ""}</div>
                      <div className="mt-2 text-sm text-slate-600">Wallet: {formatNumber(user.wallet)} | Creds: {formatNumber(user.creds)}</div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Financial Report" action={<div className="mt-1 text-sm text-slate-500">Live from dashboard overview</div>}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Referral earnings</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-950">{formatNumber(reportData.stats?.referralEarnings)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Total referrals</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-950">{formatNumber(reportData.stats?.totalReferrals)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Total earned</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-950">{formatNumber(reportData.stats?.totalEarned)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Pending reviews</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-950">{formatNumber(reportData.stats?.pendingReview)}</div>
                  </div>
                </div>
              </Section>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Section title="Content Reports" action={<div className="mt-1 text-sm text-slate-500">Quizzes, tasks, surveys, leaderboard</div>}>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-slate-500"><FiLayers /> Quizzes</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-950">{formatNumber(reportData.stats?.totalQuizzes)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-slate-500"><FiLayers /> Tasks</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-950">{formatNumber(reportData.stats?.totalTasks)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-slate-500"><FiPieChart /> Surveys</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-950">{formatNumber(reportData.stats?.totalSurveys)}</div>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-700">Top earners in current range</div>
                  <div className="mt-3 space-y-2">
                    {(reportData.topEarners || []).slice(0, 5).map((user, index) => (
                      <div key={user._id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                        <span className="text-sm text-slate-700">#{index + 1} {user.username || "User"}</span>
                        <span className="text-sm font-semibold text-emerald-600">{formatNumber(user.creds)} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>

              <Section title="Recent Attempts" action={<div className="mt-1 text-sm text-slate-500">Score and earned coins by attempt</div>}>
                <div className="space-y-3">
                  {(reportData.recentAttempts || []).map((attempt) => (
                    <div key={attempt._id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="font-semibold text-slate-950">Score {formatNumber(attempt.score)} | Earned {formatNumber(attempt.earnedCoins)}</div>
                      <div className="text-sm text-slate-500">{attempt.createdAt}</div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            <Section title="Downloadable PDF Sections" action={<div className="mt-1 text-sm text-slate-500">Everything exported together</div>}>
              <div className="grid gap-3 md:grid-cols-2">
                {summarySections.map((section) => (
                  <div key={section.heading} className="rounded-2xl border border-slate-200 p-4">
                    <div className="font-semibold text-slate-950">{section.heading}</div>
                    <div className="mt-2 text-sm text-slate-500">{section.lines.join(" • ")}</div>
                  </div>
                ))}
              </div>
            </Section>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={exportAllPdf} className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600">
                <FiDownload />
                Download full report PDF
              </button>
              <div className="text-sm text-slate-500">Range: {titleCase(range)} | Data source: live backend overview</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
