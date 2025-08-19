import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Requests.css"; 

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchRequests = async () => {
    try {
      const res = await api.get("/getAllRequests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/approveRequest/${id}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Error approving request.");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/rejectRequest/${id}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Error rejecting request.");
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="req-container">
      <p className="req-title">Certificate Requests</p>

      <div className="req-search-container">
        <input
          type="text"
          placeholder="Search by student or course"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="req-search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="req-status-select"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <table className="req-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.course}</td>
              <td
                className={
                  r.status === "APPROVED"
                    ? "req-status-approved"
                    : r.status === "REJECTED"
                    ? "req-status-rejected"
                    : "req-status-pending"
                }
              >
                {r.status}
              </td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              <td className="req-actions">
                {r.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="req-approve-btn"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      className="req-reject-btn"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {filteredRequests.length === 0 && (
            <tr>
              <td colSpan="5" className="req-no-data">
                No requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Requests;
