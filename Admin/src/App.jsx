import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin dashboard pages
import AdminDashboardPage from "./pages/admin_dashboard/AdminDashboardPage";
import AdminWallet from "./pages/admin_dashboard/AdminWallet";
import AdminGames from "./pages/admin_dashboard/AdminGames";
import AdminUsers from "./pages/admin_dashboard/AdminUsers";
import AdminSurveys from "./pages/admin_dashboard/AdminSurveys";
// import AdminSettings from "./pages/admin_dashboard/AdminSettings";
// import AdminProfile from "./pages/admin_dashboard/AdminProfile";
import AdminQuizzes from "./pages/admin_dashboard/AdminQuizzes";
import AdminReports from "./pages/admin_dashboard/AdminReports";
import Adminleaderboard from "./pages/admin_dashboard/Adminleaderboard";
import AdminReferrals from "./pages/admin_dashboard/AdminReferrals";
import AdminTask from "./pages/admin_dashboard/AdminTask";
import LotteryManagement from "./components/admin_dashboard/admin_local_comp/lottery_comp/LotteryManagement";

import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* ✅ Admin Dashboard (Protected Area) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="wallet" element={<AdminWallet />} />
          <Route path="games" element={<AdminGames />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="surveys" element={<AdminSurveys />} />
          {/* <Route path="settings" element={<AdminSettings />} /> */}
          {/* <Route path="profile" element={<AdminProfile />} /> */}
          <Route path="quizzes" element={<AdminQuizzes />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="leaderboard" element={<Adminleaderboard />} />
          <Route path="referrals" element={<AdminReferrals />} />
          <Route path="tasks" element={<AdminTask />} />
          <Route path="lottery" element={<LotteryManagement />} />
        </Route>

        {/* ✅ 404 Page */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
