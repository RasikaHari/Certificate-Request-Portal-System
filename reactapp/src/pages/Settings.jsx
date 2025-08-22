import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    if (!storedUser?.id) {
      setMessage("No logged-in user found.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/user/${storedUser.id}`);
        setUserData(res.data);
      } catch (err) {
        setMessage("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    try {
      await api.put(`/api/user/${storedUser.id}`, userData);
      setMessage("Profile updated successfully!");
    } catch (err) {
      const backendMessage = err.response?.data?.message || "Failed to update profile.";
      setMessage(backendMessage);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    try {
      await api.post(`/api/user/${storedUser.id}/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setMessage("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const backendMessage =
        err.response?.data?.message || "Failed to change password. Please try again.";
      setMessage(backendMessage);
    }
  };

  if (loading) return <div className="settings-container">Loading...</div>;

  return (
    <div className="settings-page">
      {/* Sidebar */}
      <div className="settings-sidebar">
        <h2 className="sidebar-title">Settings</h2>
        <br />
        <ul>
          <li
            className={activeTab === "appearance" ? "active" : ""}
            onClick={() => setActiveTab("appearance")}
          >
            Appearance
          </li>
          <li
            className={activeTab === "personal" ? "active" : ""}
            onClick={() => setActiveTab("personal")}
          >
            Personal Information
          </li>
          <li
            className={activeTab === "password" ? "active" : ""}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </li>
        </ul>
      </div>

      <img
        src="https://cdn3d.iconscout.com/3d/premium/thumb/cute-student-flying-with-pencil-9639940-7866556.png"
        alt=""
        className="corner-imageee"
      />

      {/* Content */}
      <div className="settings-content">
        {message && <div className="settings-message">{message}</div>}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div>
            <h3>Appearance</h3>
            <p>Theme customization options will go here...</p>
          </div>
        )}

        {/* Personal Info Tab */}
        {activeTab === "personal" && (
          <div>
            <h3>Personal Information</h3>
            <p>Update your Personal Information here!</p>
            <br />
            <div className="settings-form">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                disabled
                style={{ background: "#e0e0e0" }}
              />

              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleChange}
              />

              <label>Role</label>
              <input
                type="text"
                name="role"
                value={userData.role}
                disabled
                style={{ background: "#e0e0e0" }}
              />

              <div className="button-group">
                <br />
                <br />
                <button className="save-btn" onClick={handleUpdate}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === "password" && (
          <div>
            <h3>Change Password</h3>
            <p>Update your account password here.</p>
            <br />
            <div className="settings-form">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
              />

              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
              />

              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
              />

              <div className="button-group">
                <br />
                <br />
                <button className="save-btn" onClick={handlePasswordChange}>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
