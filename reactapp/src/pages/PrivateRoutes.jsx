import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ role }) => {
  const { authUser } = useAuth();


  if (!authUser) return <Navigate to="/login" replace />;


  if (authUser.role !== role) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default PrivateRoute;
