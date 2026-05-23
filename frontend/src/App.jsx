// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import PublicLayout from "./layouts/PublicLayout";
// import DashboardLayout from "./layouts/DashboardLayout";


// // Public pages
// import LandingPage from "./pages/LandingPage";
// import AboutPage from "./pages/AboutPage";
// import ContactPage from "./pages/ContactPage";
// import BlogPage from "./pages/BlogPage";
// import AuthPage from "./pages/AuthPage";
// import Infopage from "./pages/Infopage";
// import NotFoundPage from "./pages/NotFoundPage";

// // Blog
// import { BlogInit } from "./components/blogcomp/Blog";        // ← adjust path to match your folder
// import BlogPostPage from "./pages/Blogpostpage";

// // User dashboard pages
// import DashboardPage from "./pages/userdashboard/DashboardPage";
// import DashboardWallet from "./pages/userdashboard/DashboardWallet";
// import DashboardGames from "./pages/userdashboard/DashboardGames";

// // 👇 Dashboard Surveys (Correct Folder Path)
// import DashboardSurveys from "./components/user_dashboard/user_local_comp/dashboard_surveys_comp/DashboardSurveys";

// import DashboardTasks from "./pages/userdashboard/DashboardTasks";
// import DashboardLeaderboard from "./pages/userdashboard/DashboardLeaderboard";
// import DashboardReferrals from "./pages/userdashboard/DashboardReferrals";
// import DashboardQuizzes from "./pages/userdashboard/DashboardQuizzes";
// import DashboardSettings from "./pages/userdashboard/DashboardSettings";
// import DashboardProfile from "./pages/userdashboard/DashboardProfile";

// function App() {
//   return (
//     <BrowserRouter>
//       {/* ── Blog Initialization ── */}
//       <BlogInit />

//       <Routes>
//         {/* ── Public Routes ── */}
//         <Route path="/" element={<PublicLayout />}>
//           <Route index element={<LandingPage />} />
//           <Route path="about" element={<AboutPage />} />
//           <Route path="contact" element={<ContactPage />} />
//           <Route path="blog" element={<BlogPage />} />
//           <Route path="blog/:slug" element={<BlogPostPage />} />
//           <Route path="Infopage" element={<Infopage />} />
//           <Route path="authpage" element={<AuthPage />} />
//           <Route path="AuthPage" element={<AuthPage />} />
//         </Route>

//         {/* ── User Dashboard Routes ── */}
//         <Route path="/dashboard" element={<DashboardLayout />}>
//           <Route index element={<DashboardPage />} />
//           <Route path="wallet" element={<DashboardWallet />} />
//           <Route path="games" element={<DashboardGames />} />
//           <Route path="surveys" element={<DashboardSurveys />} />
//           <Route path="tasks" element={<DashboardTasks />} />
//           <Route path="tasks/:category" element={<DashboardTasks />} />
//           <Route path="leaderboard" element={<DashboardLeaderboard />} />
//           <Route path="referrals" element={<DashboardReferrals />} />
//           <Route path="quizzes" element={<DashboardQuizzes />} />
//           <Route path="quizes" element={<DashboardQuizzes />} />
//           <Route path="settings" element={<DashboardSettings />} />
//           <Route path="profile" element={<DashboardProfile />} />
//         </Route>

//         {/* ── 404 — must be last ── */}
//         <Route path="*" element={<NotFoundPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;














import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// ✅ Route Protection
import UserProtectedRoute from "./routes/UserProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

// Public pages
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import AuthPage from "./pages/AuthPage";
import Infopage from "./pages/Infopage";
import NotFoundPage from "./pages/NotFoundPage";

// Blog
import { BlogInit } from "./components/blogcomp/Blog";
import BlogPostPage from "./pages/Blogpostpage";

// Dashboard pages
import DashboardPage from "./pages/userdashboard/DashboardPage";
import DashboardWallet from "./pages/userdashboard/DashboardWallet";
import DashboardGames from "./pages/userdashboard/DashboardGames";
import DashboardSurveys from "./components/user_dashboard/user_local_comp/dashboard_surveys_comp/DashboardSurveys";
import DashboardTasks from "./pages/userdashboard/DashboardTasks";
import DashboardLeaderboard from "./pages/userdashboard/DashboardLeaderboard";
import DashboardReferrals from "./pages/userdashboard/DashboardReferrals";
import DashboardQuizzes from "./pages/userdashboard/DashboardQuizzes";
import DashboardLottery from "./pages/userdashboard/DashboardLottery";
import DashboardSettings from "./pages/userdashboard/DashboardSettings";
import DashboardProfile from "./pages/userdashboard/DashboardProfile";
import ShortLinkEntryPage from "./pages/ShortLinkEntryPage";
import ShortLinkVisitPage from "./pages/ShortLinkVisitPage";
import ShortLinkVerifyPage from "./pages/ShortLinkVerifyPage";

function App() {
  return (
    <BrowserRouter>
      {/* Blog Init */}
      <BlogInit />

      <Routes>

        {/* ───────── PUBLIC ROUTES ───────── */}
        <Route path="/" element={<PublicLayout />}>

          <Route index element={<LandingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="infopage" element={<Infopage />} />
          <Route path="s/:code" element={<ShortLinkEntryPage />} />
          <Route path="visit/:code" element={<ShortLinkVisitPage />} />
          <Route path="verify" element={<ShortLinkVerifyPage />} />

          {/* ✅ Auth Protected (if logged in → dashboard) */}
          <Route
            path="authpage"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

        </Route>

        {/* ───────── USER DASHBOARD (PROTECTED) ───────── */}
        <Route
          path="/dashboard"
          element={
            <UserProtectedRoute>
              <DashboardLayout />
            </UserProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="wallet" element={<DashboardWallet />} />
          <Route path="games" element={<DashboardGames />} />
          <Route path="surveys" element={<DashboardSurveys />} />
          <Route path="tasks" element={<DashboardTasks />} />
          <Route path="tasks/:category" element={<DashboardTasks />} />
          <Route path="leaderboard" element={<DashboardLeaderboard />} />
          <Route path="referrals" element={<DashboardReferrals />} />
          <Route path="quizzes" element={<DashboardQuizzes />} />
          <Route path="lottery" element={<DashboardLottery />} />
          <Route path="quizes" element={<DashboardQuizzes />} /> 
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="profile" element={<DashboardProfile />} />
        </Route>

        {/* ───────── 404 ───────── */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;