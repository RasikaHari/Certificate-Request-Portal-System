import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const doLogout = async () => {
      try {
      
        await api.post("/api/user/logout", {}, { withCredentials: true });
      } catch (err) {
        console.error("Logout API error:", err);
      } finally {
      
        logout();
        navigate("/login", { replace: true });

       
        window.location.reload();
      }
    };

    doLogout();
  }, [logout, navigate]);

  return <h2>Logging out...</h2>;
};

export default Logout;
