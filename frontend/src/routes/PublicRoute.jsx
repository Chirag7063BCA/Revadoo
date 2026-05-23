import { Navigate } from "react-router-dom";

const clearAuthState = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("jwt");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
  localStorage.removeItem("userAvatar");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("authToken");
};

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    if (!payload?.exp) return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const PublicRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken");

  if (token && isTokenExpired(token)) {
    clearAuthState();
  }

  if (user && token && !isTokenExpired(token)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;