import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/user/login", formData, {
        withCredentials: true,
      });
      localStorage.setItem("authUser", JSON.stringify(response.data));
      const { role } = response.data;

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (e) {
      setError(e.response?.data || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-left">
          <div className="logo">OCRPS</div>
          <p className="welcome-text">Welcome back !!!</p>
          <h2>Log In</h2>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="login@gmail.com"
              value={formData.email}
              required
              onChange={handleChange}
            />

            <div className="password-row">
              <label>Password</label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              required
              onChange={handleChange}
            />

            <button type="submit" className="login-btn">
              LOGIN
            </button>

            <p className="signup-text">
              Don&apos;t have an account yet?{" "}
              <Link to="/register" className="signup-link">
                Sign up for free
              </Link>
            </p>
          </form>
        </div>

        <div className="login-right">
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/student-studying-on-laptop-while-sitting-on-bean-bag-5711047-4779535.png"
            alt="Students using laptops illustration"
            className="login-img"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
