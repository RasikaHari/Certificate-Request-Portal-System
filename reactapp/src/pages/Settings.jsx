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
      setMessage(" Failed to update profile.");
    }
  };

  if (loading) return <div className="settings-container">Loading...</div>;

  return (
    <div className="settings-page">
      
      <div className="settings-sidebar">
        <h2 className="sidebar-title">Settings</h2><br/>
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
        </ul>
      </div>
    <img
        src="https://cdn3d.iconscout.com/3d/premium/thumb/cute-student-flying-with-pencil-9639940-7866556.png"
        alt=""
        className="corner-imageee"
      />
     
      <div className="settings-content">
        {message && <div className="settings-message">{message}</div>}

        {activeTab === "appearance" && (
          <div>
            <h3>Appearance</h3>
            <p>Theme customization options will go here...</p>
          </div>
        )}

        {activeTab === "personal" && (
          <div>
            <h3>Personal Information</h3>
            <p>Update your Personal Information here!</p><br/>
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
                onChange={handleChange}
              />

              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleChange}
              />

              <label>Role</label>
              <input type="text" name="role" value={userData.role} disabled />

              <div className="button-group">
                <br/><br/>
                <button className="save-btn" onClick={handleUpdate}>
                  Save
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
