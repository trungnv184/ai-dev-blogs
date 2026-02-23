import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function ProtectedRoute() {
  const { isAuthenticated, checkAuth } = useAuth();

  if (!isAuthenticated || !checkAuth()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
