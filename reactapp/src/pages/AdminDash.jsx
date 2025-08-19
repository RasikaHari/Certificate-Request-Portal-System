import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,BarElement,Title,Tooltip,Legend,} from "chart.js";
import api from "../services/api";
import "./AdminDash.css";

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,BarElement,Title,Tooltip,Legend);

const AdminDash = () => {
  const [stats, setStats] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestsTrend, setRequestsTrend] = useState({ labels: [], datasets: [] });
 

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const userRes = await api.get("/loggedInUser");
        const userId = userRes.data.id;

       
        const statsRes = await api.get(`/users/${userId}/stats`);
        const s = statsRes.data;

        setStats({
          totalStudents: s.totalStudents || 0,
          totalStaff: s.totalStaff || 0,
          pendingRequests: s.pendingCount || 0,
          approvedToday: s.approvedToday || 0,
          rejectedToday: s.rejectedToday || 0,
        });

        
        const pendingRes = await api.get("/getAllRequests");
        const pending = pendingRes.data
          .filter((r) => r.status?.toUpperCase()  === "PENDING")
          .slice(0, 5);
        setPendingRequests(pending);

       
        const trendRes = await api.get("/requests/trend");
        const trend = trendRes.data;
        setRequestsTrend({
          labels: trend.dates,
          datasets: [
            {
              label: "Pending",
              data: trend.pendingCounts,
              borderColor: "orange",
              backgroundColor: "rgba(255,165,0,0.2)",
            },
            {
              label: "Approved",
              data: trend.approvedCounts,
              borderColor: "green",
              backgroundColor: "rgba(0,255,0,0.2)",
            },
            {
              label: "Rejected",
              data: trend.rejectedCounts,
              borderColor: "red",
              backgroundColor: "rgba(255,0,0,0.2)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
   
      <header className="admin-dash-header">
        <div className="header-left"></div>
        <div className="header-right">
         
          <div className="profile-dropdown">
            👤
            <div className="dropdown-menu">
              <button>My Profile</button>
              <button>Settings</button>
              <button onClick={() => {localStorage.removeItem("token");window.location.href = "/";}}>Logout</button>
            </div>
          </div>
        </div>
      </header>

     
      <main className="admin-dash-main">
        <section className="admin-dash-stats">
          <div className="dash-card">
            👩‍🎓<h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
          <div className="dash-card">
            👨‍🏫<h3>{stats.totalStaff}</h3>
            <p>Total Staff</p>
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

       
        <section className="admin-dash-charts">
          <div className="chart-card">
            <h4>Certificate Requests Trend</h4>
            <Line
              data={{
                labels: requestsTrend.labels || [],
                datasets: requestsTrend.datasets || [],
              }}
            />
          </div>
        </section>

       
        <section className="admin-dash-pending">
          <h3>Recent Pending Approvals Request</h3>
          <ul>
            {pendingRequests.map((r) => (
              <li key={r.id}>
                <div className="request-text">
                  {r.name} requested {r.course}
                </div>
                <div className="request-actions">
                  <button onClick={() => handleApprove(r.id)}>Approve</button>
                  <button onClick={() => handleReject(r.id)}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

       
        <footer className="admin-dash-footer">v1.0.0 | © 2025 OCRPS</footer>
      </main>
    </div>
  );
};

export default AdminDash;
