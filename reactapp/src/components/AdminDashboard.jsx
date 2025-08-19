import React from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import Students from "../pages/Students";
import Staff from "../pages/Staff";
import Requests from "../pages/Requests";
import Settings from "../pages/Settings";
import AdminDash from "../pages/AdminDash";
import "./AdminDashboard.css";


const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
    <div className="admin-sidebar">

      <div className="admin-sidebar-header">
      <span className="accent-gold">OCRPS</span> Admin Panel</div>

      <nav className="admin-sidebar-menu">
        <NavLink to="admin-dashboard" className={({ isActive }) => `admin-menu-item ${isActive ? "admin-menu-item-active" : ""}`}>🏠 Dashboard</NavLink>
        <NavLink to="students" className={({ isActive }) => `admin-menu-item ${isActive ? "admin-menu-item-active" : ""}`}>👩‍🎓 Students</NavLink>
        <NavLink to="staff" className={({ isActive }) => `admin-menu-item ${isActive ? "admin-menu-item-active" : ""}`}>👨‍🏫 Staff</NavLink>
        <NavLink to="requests" className={({ isActive }) => `admin-menu-item ${isActive ? "admin-menu-item-active" : ""}`}>📜 Certificate Requests</NavLink>
      </nav>

      <div className="admin-sidebar-bottom">
        <NavLink to="settings" className={({ isActive }) => `admin-menu-item ${isActive ? "admin-menu-item-active" : ""}`}>⚙️ Settings</NavLink>
        
            <NavLink to="/user/logout" className="admin-menu-item">
              <span className="icon">👋</span> Logout
            </NavLink>
      </div>
      </div>

      <div className="admin-main-content">
        <Routes>
          <Route path="/" element={<Navigate to="admin-dashboard" />} />
          <Route path="admin-dashboard" element={<AdminDash />} />
          <Route path="students" element={<Students />} />
          <Route path="staff" element={<Staff />} />
          <Route path="requests" element={<Requests />} />
          <Route path="settings" element={<Settings/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
