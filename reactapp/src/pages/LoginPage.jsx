import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/user/login", formData);
      const data = response.data;

      if (data.role === "ADMIN") {
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
      <div className="login-left">
        <div className="logo">Certara</div>
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
            LOGIN IN
          </button>

          <p className="or-text">or continue with</p>

          <div className="social-login">
            <button type="button" className="google-btn">G</button>
            <button type="button" className="github-btn">GitHub</button>
            <button type="button" className="fb-btn">Facebook</button>
          </div>

          <p className="signup-text">
            Don’t have an account yet?{" "}
            <Link to="/register" className="signup-link">
              Sign up for free
            </Link>
          </p>
        </form>
      </div>

      <div className="login-right">
        <img
        src="https://static.vecteezy.com/system/resources/previews/011/381/947/original/young-man-studying-for-university-test-3d-character-illustration-png.png"
        
        // src="https://png.pngtree.com/png-clipart/20230914/original/pngtree-student-at-desk-clipart-boy-sitting-at-computer-desk-isolated-vector-png-image_12148013.png"
        alt="Illustration"
          className="login-img"
        />
      </div>
    </div>
  );
};

export default LoginPage;
