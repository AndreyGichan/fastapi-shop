import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function AdminRoute({ children }) {
    const { isAuthenticated, userRole, loading } = useAuth();

    if (loading) return <div>Загрузка...</div>;

    if (!isAuthenticated || userRole !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}
