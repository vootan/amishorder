import { Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.status !== 'active') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
}
