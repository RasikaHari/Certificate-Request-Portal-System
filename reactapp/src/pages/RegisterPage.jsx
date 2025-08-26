import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import api from "../services/api";
import "./RegisterPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "STUDENT",
  });

  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [strength, setStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill("")); // OTP array
  const [acceptedTerms, setAcceptedTerms] = useState(false); // Terms checkbox
  const [showTerms, setShowTerms] = useState(false); // Terms modal
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");


  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}]).{8,}$/;
    return regex.test(password);
  };

  const getStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&#^()[\]{}]/.test(password)) score++;
    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return "Strong";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setStrength(getStrength(value));
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value)
          ? ""
          : "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character.",
      }));
    }

    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === formData.password ? "" : "Passwords do not match!",
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      alert("You must accept the Terms and Conditions to register.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character.",
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match!",
      }));
      return;
    }

    try {
      setLoading(true);
      // setLoadingMessage("OTP is being sent... Please check your email!");

        toast.info("OTP is being sent... Please check your email!", {
           borderRadius: "0px",   // removes corner radius
    width: "700px", 
    position: "top-center",
    autoClose: 5000, // auto close in 5 sec
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
      const response = await api.post("/api/user/register", formData);
      if (response.status === 200) 
      {setOtpSent(true);
        setLoadingMessage("");
      }
    } catch (e) {
      alert(e.response?.data || "Registration failed. Please try again.");
      setLoadingMessage("");
    }
    finally {
    setLoading(false); // 🔹 Stop loading
  }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    try {
      await api.post(`/api/user/verify-otp?otp=${otpString}`, formData);
      // alert("User registered successfully!");
      toast.success("User registered successfully!", {
  style: {
    borderRadius: "0px",  // no rounded corners
    width: "400px",       // wider toast
    textAlign: "center"
  },
});

      navigate("/login");
    } catch (e) {
      alert(e.response?.data || "OTP verification failed. Try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await api.post(
        `/api/user/resend-otp?email=${formData.email}&name=${formData.name}`
      );
      alert(response.data || "OTP resent!");
    } catch (e) {
      alert(e.response?.data || "Failed to resend OTP. Try again.");
    }
  };

  // OTP Page
  if (otpSent) {
    return (
      <div className="otp-page">
        <div className="otp-container">
          <div className="otp-left">
            <img
              src="https://static.vecteezy.com/system/resources/previews/011/344/364/original/teenager-working-in-group-3d-character-illustration-png.png"
              alt="Illustration"
            />
          </div>
          <div className="otp-right">
            <h2>Enter 6 digits verification code</h2>
            <p>sent to your Registered mobile number</p>

            <div className="otp-inputs">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  value={digit}
                  id={`otp-${i}`}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, "");
                    setOtp((prev) =>
                      prev.map((c, idx) => (idx === i ? val : c))
                    );
                    if (val && i < otp.length - 1) {
                      document.getElementById(`otp-${i + 1}`).focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      if (otp[i] === "") {
                        if (i > 0)
                          document.getElementById(`otp-${i - 1}`).focus();
                      } else {
                        setOtp((prev) =>
                          prev.map((c, idx) => (idx === i ? "" : c))
                        );
                      }
                    }
                  }}
                />
              ))}
            </div>

            <button className="otp-btn" onClick={handleVerifyOtp}>
              Confirm
            </button>

            <p className="resend-otp" onClick={handleResendOtp}>
              Resend OTP
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default Register Page
  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="register-left">
          <div className="register-logo">OCRPS</div>
          <p style={{fontSize:"20px",fontWeight:"bold"}}> Register</p><br/>
          <p className="register-welcome">Create your account</p>

          <form onSubmit={handleRegister} className="register-form">
            <label>Email :</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Name :</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Password :</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "invalid" : ""}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            {formData.password && (
              <div className={`strength-meter ${strength.toLowerCase()}`}>
                {strength} Password
              </div>
            )}
            {errors.password && (
              <div className="input-error">{errors.password}</div>
            )}

            <label>Confirm Password :</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "invalid" : ""}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            {errors.confirmPassword && (
              <div className="input-error">{errors.confirmPassword}</div>
            )}

            <label>Phone Number :</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              pattern="[0-9]{10}"
              placeholder="Enter a 10-digit phone number"
              onChange={handleChange}
              required
            />

            {/* <label>Role:</label>
<input type="text" value="STUDENT" disabled />
<input type="hidden" name="role" value="STUDENT" /> */}
<label>Role:</label>
<select name="role" defaultValue="STUDENT">
  <option value="STUDENT">STUDENT</option>
  <option value="ADMIN">ADMIN</option>
</select>


            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "10px",
                fontSize: "14px",
              }}
            >
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                required
                style={{ width: "16px", height: "16px" }}
              />
              <span style={{ marginTop: "8px", display: "inline-block" }}>
                I accept the{" "}
                <span
                  onClick={() => setShowTerms(true)}
                  style={{
                    textDecoration: "underline",
                    color: "gray",
                    cursor: "pointer",
                  }}
                >
                  Terms and Conditions
                </span>
              </span>
            </label>
                  {loading && (
  <p style={{ color: "green", margin: "10px 0", fontWeight: "bold" }}>
    {loadingMessage}
  </p>
)}

            <button type="submit" className="register-btn" disabled={loading}>
  {loading ? (
    <div className="spinner"></div>  // 🔹 Spinner inside button
  ) : (
    "Register"
  )}
</button>

          </form>

          <p className="register-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>

        <div className="register-right">
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/cute-student-with-pencil-9639941-7866555.png"
            alt="Register Illustration"
            className="register-img"
          />
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "40px",
        width: "500px",
        maxHeight: "70%",
        overflowY: "auto",
        position: "relative",
        borderRadius: "0px", // removed border radius
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)", // subtle shadow for neat look
      }}
    >
      <h3 style={{ marginTop: 0 }}>Terms and Conditions</h3><br/>
      <p style={{ fontSize: "12px", lineHeight: "1.5" }}>
       By accessing and using this Online Certificate Request Portal, you acknowledge and agree to comply with the following terms and conditions.
        The Portal is intended solely for use by registered and authorized users for the purpose of requesting certificates.
        Users are required to provide complete, accurate, and up-to-date information; any inaccurate, incomplete, or misleading information may result in delays, rejection, or the need for resubmission of requests.
        Certificates issued through the Portal are for personal, academic, or official use only, and any unauthorized reproduction, distribution, alteration, or misrepresentation is strictly prohibited and may result in legal action.
        Users are responsible for maintaining the confidentiality of their login credentials and for all activities conducted under their account.
        Personal data collected via the Portal will be used exclusively for processing requests, maintaining records, and communicating with users, and will not be disclosed to unauthorized third parties except as required by law. The Portal administrators shall not be liable for any direct, indirect, 
        or consequential losses arising from the use of the Portal, including delays, technical errors, or temporary unavailability due to maintenance.
        The Portal reserves the right to modify, update, or revise these terms and conditions at any time, with continued use of the Portal constituting acceptance of such modifications. By using the Portal, you confirm that you have read, understood, and agreed to be bound by these terms and conditions.
        
      </p>
      <button
        onClick={() => setShowTerms(false)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          // background: "red",
          color: "#100f0fff",
          border: "none",
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        X
      </button>
    </div>
  </div>
)}
<ToastContainer />
    </div>
  );
};
