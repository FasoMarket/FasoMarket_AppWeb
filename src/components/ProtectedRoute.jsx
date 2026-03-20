import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const user = authService.getUser();

  if (!authService.isLoggedIn())
    return <Navigate to="/login" state={{ from: location }} replace />;

  if (roles.length > 0 && !roles.includes(user?.role))
    return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
