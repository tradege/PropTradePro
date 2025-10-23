import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ADMIN_ROLES } from '../constants/roles';

export default function RoleBasedDashboard() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (ADMIN_ROLES.includes(user.role)) {
    return <Navigate to="/admin" replace />;
  }
  
  if (user.role === 'agent') {
    return <Navigate to="/agent" replace />;
  }
  
  // Regular users stay on /dashboard or redirect to home
  return <Navigate to="/" replace />;
}

