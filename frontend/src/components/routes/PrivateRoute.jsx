import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Загрузка...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  return children;
}
