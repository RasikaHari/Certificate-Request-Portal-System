import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Staff.css";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [editingStaff, setEditingStaff] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", phoneNumber: "" });

  const fetchStaff = async () => {
    try {
      const res = await api.get("/api/user/role/STAFF");
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrEdit = async () => {
    try {
      if (editingStaff) {
        await api.put(`/api/user/${editingStaff.id}`, { ...form, role: "STAFF" });
        setEditingStaff(null);
      } else {
        await api.post("/api/user/register", { ...form, role: "STAFF" });
      }
      setForm({ name: "", email: "", password: "", phoneNumber: "" });
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.response?.data || err.message);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setForm({ name: staffMember.name, email: staffMember.email, phoneNumber: staffMember.phoneNumber });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await api.delete(`/api/user/${id}`);
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert("Error deleting staff.");
    }
  };

  const filteredStaff = staff.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="staff-container">
      <p className="staff-title">Staff Management</p>

      <div className="staff-search-container">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="staff-search-input"
        />
      </div>

      <div className="staff-form-container">
        <h3 className="staff-form-title">{editingStaff ? "Edit Staff" : "Add New Staff"}</h3><br/>
        <div className="staff-form-fields">
          <label>Name :</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleInputChange}
            className="staff-input"
            />
            <label>Email :</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            className="staff-input"
            />
            <label>Password :</label>
          <input
            type="password"
            name="password"
            placeholder="******"
            value={form.password}
            onChange={handleInputChange}
            className="staff-input"
            />
            <label>Phone Number :</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleInputChange}
            className="staff-input"
          />
          <br/>
        </div>
        <div className="staff-form-buttons">
         
          <button onClick={handleAddOrEdit} className="staff-btn staff-btn-primary">
            {editingStaff ? "Update" : "Add"}
          </button>
          {editingStaff && (
            <button
              onClick={() => { setEditingStaff(null); setForm({ name: "", email: "", phoneNumber: "" }); }}
              className="staff-btn staff-btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <table className="staff-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredStaff.map((s) => (
      <tr key={s.id}>
        <td>{s.name}</td>
        <td>{s.email}</td>
        <td>{s.phoneNumber}</td>
        <td className="staff-actions">
          <button onClick={() => handleEdit(s)} className="staff-edit-btn">Edit</button>
          <button onClick={() => handleDelete(s.id)} className="staff-delete-btn">Delete</button>
        </td>
      </tr>
    ))}
    {filteredStaff.length === 0 && (
      <tr>
        <td colSpan="4" className="staff-no-data">No staff found.</td>
      </tr>
    )}
  </tbody>
</table>

    </div>
  );
};

export default Staff;
