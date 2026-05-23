import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiUrl } from "../services/apiConfig";

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

const UserProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken");

  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let isMounted = true;

    if (!user || !token) {
      setStatus("unauthenticated");
      return () => {
        isMounted = false;
      };
    }

    const validate = async () => {
      try {
        const response = await fetch(apiUrl("/auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!isMounted) return;

        if (response.ok) {
          setStatus("authenticated");
          return;
        }

        clearAuthState();
        setStatus("unauthenticated");
      } catch {
        if (!isMounted) return;
        clearAuthState();
        setStatus("unauthenticated");
      }
    };

    validate();

    return () => {
      isMounted = false;
    };
  }, [token, user]);

  if (status === "checking") {
    return null;
  }

  if (status !== "authenticated") {
    return <Navigate to="/authpage" replace />;
  }

  return children;
};

export default UserProtectedRoute;