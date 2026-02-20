import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isLoggedIn, loading } = useUser();
  const location = useLocation();

  if (loading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
