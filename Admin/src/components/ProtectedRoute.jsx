import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/adminAuth";

const ProtectedRoute = ({ children }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
