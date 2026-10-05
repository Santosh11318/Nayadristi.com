import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return currentUser ? <Outlet /> : <Navigate to="/admin/login" />;
}
