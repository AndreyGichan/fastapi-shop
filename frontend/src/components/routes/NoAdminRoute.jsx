import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function NoAdminRoute({ children }) {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated && userRole === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
