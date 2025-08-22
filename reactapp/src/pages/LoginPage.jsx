import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import api from "../services/api";
import "./LoginPage.css";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password modal states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // Step 1: send OTP, Step 2: reset password
  const [forgotMsg, setForgotMsg] = useState("");

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

      login(response.data);
      const { role } = response.data;
      if (role === "ADMIN") navigate("/admin");
      else if(role==="STAFF")navigate("/staff");
      else navigate("/user");
    } catch (e) {
      setError(e.response?.data || "Login failed. Please try again.");
    }
  };

  // ----- Forgot Password Handlers -----
  const handleSendOtp = async () => {
    try {
      const res = await api.post(`/api/user/forgot-password?email=${forgotEmail}`);
      setForgotMsg(res.data);
      setForgotStep(2); // move to OTP + new password step
    } catch (e) {
      setForgotMsg(e.response?.data || "Failed to send OTP.");
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await api.post(`/api/user/reset-password?email=${forgotEmail}&otp=${otp}&newPassword=${newPassword}`);
      setForgotMsg(res.data);
      setForgotStep(1);
      setShowForgot(false);
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
    } catch (e) {
      setForgotMsg(e.response?.data || "Failed to reset password.");
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
              <span
                className="forgot-link"
                style={{ cursor: "pointer" }}
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                value={formData.password}
                required
                onChange={handleChange}
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

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

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="forgot-modal">
          <div className="forgot-card">
            <h3>Forgot Password</h3>
            {forgotMsg && <p style={{ color: "green" }}>{forgotMsg}</p>}

            {forgotStep === 1 && (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <button onClick={handleSendOtp}>Send OTP</button>
              </>
            )}

            {forgotStep === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handleResetPassword}>Reset Password</button>
              </>
            )}

            <button
              style={{ marginTop: "10px" }}
              onClick={() => {
                setShowForgot(false);
                setForgotStep(1);
                setForgotEmail("");
                setOtp("");
                setNewPassword("");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
