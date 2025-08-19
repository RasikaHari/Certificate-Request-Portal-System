import React, { useEffect, useState } from "react";
import api from "../services/api";

const AdminSettings = () => {
  const [profile, setProfile] = useState({ name: "", email: "", phoneNumber: "" });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/loggedInUser"); // Get logged-in admin
      setProfile({
        name: res.data.name,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put(`/api/user/${profile.id}`, profile);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      <div className="border p-4 rounded bg-white max-w-md">
        <h3 className="font-semibold mb-2">Admin Profile</h3>
        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={profile.name}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={profile.phoneNumber}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>

      {/* Optional: System Preferences / Certificate Categories */}
      <div className="border p-4 rounded bg-white mt-6 max-w-md">
        <h3 className="font-semibold mb-2">System Preferences</h3>
        <p className="text-gray-600">You can add certificate categories or other settings here.</p>
        {/* Example input for categories (optional) */}
        {/* <input type="text" placeholder="Add Category" className="border p-2 rounded mt-2 w-full" /> */}
      </div>
    </div>
  );
};

export default AdminSettings;
