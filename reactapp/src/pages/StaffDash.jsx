import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./StaffDash.css";

const StaffDash = () => {
  const [stats, setStats] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Logged in staff
        const userRes = await api.get("/loggedInUser");
        const userId = userRes.data.id;

        // Fetch stats for staff
        const statsRes = await api.get(`/users/${userId}/stats`);
        const s = statsRes.data;

        setStats({
          totalStudents: s.totalStudents || 0, // staff may see students count only
          pendingRequests: s.pendingCount || 0,
          approvedToday: s.approvedToday || 0,
          rejectedToday: s.rejectedToday || 0,
        });

        // Get pending requests
        const pendingRes = await api.get("/getAllRequests");
        const pending = pendingRes.data
          .filter((r) => r.status?.toUpperCase() === "PENDING")
          .slice(0, 5);
        setPendingRequests(pending);
      } catch (error) {
        console.error("Error fetching staff dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (id) => {
    await api.put(`/approveRequest/${id}`);
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = async (id) => {
    await api.put(`/rejectRequest/${id}`);
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      {/* Header */}
      <header className="staff-dash-header">
        <div className="header-left"></div>
        <div className="header-right">
          <div className="profile-dropdown">
            👤
            <div className="dropdown-menu">
              <button>My Profile</button>
              <button>Settings</button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="staff-dash-main">
        {/* Stats Section */}
        <section className="staff-dash-stats">
          <div className="dash-card">
            👩‍🎓<h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
          <div className="dash-card">
            📜<h3>{stats.pendingRequests}</h3>
            <p>Pending Requests</p>
          </div>
          <div className="dash-card">
            ✅<h3>{stats.approvedToday}</h3>
            <p>Approved Today</p>
          </div>
          <div className="dash-card">
            🔒<h3>{stats.rejectedToday}</h3>
            <p>Rejected Today</p>
          </div>
        </section>

        {/* Pending Requests */}
<section className="staff-dash-pending">
  <h3>Oldest Pending Approval Requests</h3>

  {pendingRequests.length === 0 ? (
    <p className="no-requests">✅ No pending requests!</p>
  ) : (
    <table className="pending-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Course</th>
          <th>Requested On</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {pendingRequests.map((r) => (
          <tr key={r.id}>
            <td>{r.name}</td>
            <td>{r.course}</td>
            <td>{new Date(r.createdAt).toLocaleDateString()}</td>
            <td className="request-actions">
              <button
                className="approve-btn"
                onClick={() => handleApprove(r.id)}
              >
                Approve
              </button>
              <button
                className="reject-btn"
                onClick={() => handleReject(r.id)}
              >
                 Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section>


        {/* Footer */}
        <footer className="staff-dash-footer">v1.0.0 | © 2025 OCRPS</footer>
      </main>
    </div>
  );
};

export default StaffDash;
