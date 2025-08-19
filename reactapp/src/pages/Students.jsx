import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Students.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", phoneNumber: "" });

  const fetchStudents = async () => {
    try {
      const res = await api.get("/api/user/role/STUDENT");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrEdit = async () => {
    try {
      if (editingStudent) {
        await api.put(`/api/user/${editingStudent.id}`, { ...form, role: "STUDENT" });
        setEditingStudent(null);
      } else {
        await api.post("/api/user/register", { ...form, role: "STUDENT" });
      }
      setForm({ name: "", email: "", password: "", phoneNumber: "" });
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.response?.data || err.message);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setForm({ name: student.name, email: student.email, password: "", phoneNumber: student.phoneNumber });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/api/user/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Error deleting student.");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="stu-container">
      <h2 className="stu-title">Student Management</h2>

      <div className="stu-search-container">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="stu-search-input"
        />
        <img
            src="https://www.svgrepo.com/show/448837/search.svg"
            alt="search"
            className="search-i"
          />
      </div>

      <div className="stu-form-container">
        <h3>{editingStudent ? "Edit Student" : "Add New Student"}</h3>
        <div className="stu-form-fields">
          <label>Name : </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleInputChange}
            />
            <label>Email : </label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={form.email}
            onChange={handleInputChange}
            />
           
            <label>Password : </label>
          <input
            type="password"
            name="password"
            placeholder="*******"
            value={form.password}
            onChange={handleInputChange}
          />
          <label>Phone Number :</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="stu-form-buttons">
          <button onClick={handleAddOrEdit} className="stu-btn stu-primary-btn">
            {editingStudent ? "Update" : "Add"}
          </button>
          {editingStudent && (
            <button
              onClick={() => {
                setEditingStudent(null);
                setForm({ name: "", email: "", password: "", phoneNumber: "" });
              }}
              className="stu-btn stu-secondary-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <table className="stu-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phoneNumber}</td>
                <td className="stu-actions">
                  <button onClick={() => handleEdit(s)} className="stu-btn stu-edit-btn">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="stu-btn stu-delete-btn">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="stu-no-data">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
