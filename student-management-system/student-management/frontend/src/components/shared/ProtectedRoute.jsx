import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * ProtectedRoute — wraps any route that needs:
 *  1. User to be logged in
 *  2. (optionally) User to have a specific role
 *
 * Usage:
 *   <ProtectedRoute>               — just needs login
 *   <ProtectedRoute roles={["admin"]}> — needs admin role
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
