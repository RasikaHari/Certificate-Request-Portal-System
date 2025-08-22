import React from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import Requests from "../pages/Requests";
import Settings from "../pages/Settings";
import StaffDash from "../pages/StaffDash";
import "./StaffDashboard.css";

const StaffDashboard = () => {
  return (
    <div className="staff-dashboard-container">
      <div className="staff-sidebar">
        <div className="staff-sidebar-header">
          <span className="accent-gold">OCRPS</span> Staff Panel
        </div>

        <nav className="staff-sidebar-menu">
          <NavLink
            to="staff-dashboard"
            className={({ isActive }) =>
              `staff-menu-item ${isActive ? "staff-menu-item-active" : ""}`
            }
          >
            🏠 Dashboard
          </NavLink>
          <NavLink
            to="requests"
            className={({ isActive }) =>
              `staff-menu-item ${isActive ? "staff-menu-item-active" : ""}`
            }
          >
            📜 Approval Management
          </NavLink>
        </nav>

        <div className="staff-sidebar-bottom">
          <NavLink
            to="settings"
            className={({ isActive }) =>
              `staff-menu-item ${isActive ? "staff-menu-item-active" : ""}`
            }
          >
            ⚙️ Settings
          </NavLink>
          <NavLink to="/user/logout" className="staff-menu-item">
            <span className="icon">👋</span> Logout
          </NavLink>
        </div>
      </div>

      <div className="staff-main-content">
        <Routes>
          <Route path="/" element={<Navigate to="staff-dashboard" />} />
          <Route path="staff-dashboard" element={<StaffDash />} />
          <Route path="requests" element={<Requests />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default StaffDashboard;
