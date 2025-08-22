import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ role }) => {
  const { authUser, loading } = useAuth();

  // Show nothing or loader while authUser is loading
  if (loading) return null; // You can replace null with a spinner if you want

  // Redirect to login if not logged in
  if (!authUser) return <Navigate to="/login" replace />;

  // Redirect if user role does not match
  if (role && authUser.role !== role) return <Navigate to="/login" replace />;

  // Render the protected component
  return <Outlet />;
};

export default PrivateRoute;
