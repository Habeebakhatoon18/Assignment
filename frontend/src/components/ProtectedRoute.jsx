import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from './Spinner.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, admin, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user && !admin) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;

