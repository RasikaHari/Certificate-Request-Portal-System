import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./RegisterPage.css"; 

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    phoneNumber: "",
    role:"STUDENT"
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
      await api.post("/api/user/register", formData);
      navigate("/login");
    } catch (e) {
      setError(e.response?.data || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-wrapper">
      {/* Left Side - Form */}
      <div className="register-left">
        <div className="register-logo">Certara</div>
        <p className="register-welcome">Create your account</p>
        <h2>Register</h2>

        {error && <div className="register-error">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
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
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required 
          />

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
            <label>Role :</label>
            <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="STUDENT">STUDENT</option>
            <option value="STAFF">STAFF</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button type="submit" className="register-btn" >
            Register 
          </button>

          <p className="register-text">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </form>
      </div>

      
      <div className="register-right">
        <img
          src="https://sites.glos.ac.uk/library/wp-content/uploads/sites/159/sites/265/2021/07/main-img-949x1024.png"
          alt="Register Illustration"
          className="register-img"
        />
      </div>
    </div>
  );
};
