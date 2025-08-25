import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink,Link } from "react-router-dom";
import "./StudentDashboard.css";

import RequestCertificate from "../pages/RequestCertificate";
import MyRequests from "../pages/MyRequest";
import DownloadCertificate from "../pages/DownloadCertificate";
import Settings from "../pages/Settings";
import Logout from "../pages/Logout";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { format, subDays } from "date-fns";

const ACCENT_BLUE = "#2563eb";
const ACCENT_GOLD = "#fbbf24";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({
    requested: 0,
    pending: 0,
    approved: 0,
    downloaded: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [allActivity, setAllActivity] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState({
    date: "",
    count: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (authUser && authUser.id) {
      setStudent({ name: authUser.name });

      // fetch(`http://localhost:8080/users/${authUser.id}/stats`)
      fetch(`https://certificate-request-portal-system-e01i.onrender.com/users/${authUser.id}/stats`)
        .then((res) => res.json())
        .then((data) => {
          setStats({
            requested: data.requestedCount || 0,
            pending: data.pendingCount || 0,
            approved: data.approvedCount || 0,
            downloaded: data.downloadedCount || 0,
          });
          setRecentActivity(data.recentActivity || []);
          setAllActivity(data.allActivity || []);
        });
    }
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

 
  const heatmapData = [];
  if (allActivity.length > 0) {
    const countByDate = allActivity.reduce((acc, activity) => {
      const dateStr = format(new Date(activity.date), "yyyy-MM-dd");
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {});
    for (let i = 0; i <= 365; i++) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, "yyyy-MM-dd");
      heatmapData.push({ date: dateStr, count: countByDate[dateStr] || 0 });
    }
  }

  return (
    <div className="dashboard-container">
    
<aside className="sidebar">
  <div className="sidebar-header">
    <span className="accent-gold">OCRPS</span> Portal
  </div>

 
  <div className="menu top-menu">
    <NavLink to="/user" end className="menu-item">
      <span className="icon">🏠</span> Dashboard
    </NavLink>
    <NavLink to="/user/request" className="menu-item">
      <span className="icon">📝</span> Request Certificate
    </NavLink>
    <NavLink to="/user/my-requests" className="menu-item">
      <span className="icon">📄</span> My Requests
    </NavLink>
    <NavLink to="/user/downloaded" className="menu-item">
      <span className="icon">⬇️</span> Downloaded Certificates
    </NavLink>
  </div>


  <div className="menu bottom-menu">
    <NavLink to="/user/settings" className="menu-item">
      <span className="icon">⚙️</span> Settings
    </NavLink>
    <NavLink to="/user/logout" className="menu-item">
      <span className="icon">👋</span> Logout
    </NavLink>
  </div>
</aside>

      <main className="main-content">
        <Routes>
          
          <Route
            path="/"
            element={
              <>
                <div className="header">
                  <div>
                    <div className="welcome-text">
                      Welcome back,{" "}
                      <span>{student ? student.name : "Student"}</span>!
                    </div>
                    <div className="date-text">{today}</div>
                  </div>
                  <Link to="/user/request" className="request-button">
                    + Request Certificate
                  </Link>
                </div>

               
                <div className="stats-container">
                  <div
                    className="stat-card"
                    style={{ borderTopColor: ACCENT_BLUE }}
                  >
                    <div className="stat-value">{stats.requested}</div>
                    <div className="stat-label">Requested</div>
                  </div>
                  <div
                    className="stat-card"
                    style={{ borderTopColor: "#f59e42" }}
                  >
                    <div className="stat-value">{stats.pending}</div>
                    <div className="stat-label">Pending</div>
                  </div>
                  <div
                    className="stat-card"
                    style={{ borderTopColor: ACCENT_GOLD }}
                  >
                    <div className="stat-value">{stats.approved}</div>
                    <div className="stat-label">Approved</div>
                  </div>
                  <div
                    className="stat-card"
                    style={{ borderTopColor: "#10b981" }}
                  >
                    <div className="stat-value">{stats.downloaded}</div>
                    <div className="stat-label">Downloaded</div>
                  </div>
                </div>

               
                <div
                  className="stat-card"
                  style={{ padding: "20px", marginBottom: "24px" }}
                >
                  <div style={{ fontWeight: 500, marginBottom: 12 }}>
                    Requests in the past one year
                  </div>
                  <CalendarHeatmap
                    startDate={subDays(new Date(), 364)}
                    endDate={new Date()}
                    values={heatmapData}
                    classForValue={(value) => {
                      if (!value || value.count === 0) return "color-empty";
                      if (value.count < 2) return "color-scale-1";
                      if (value.count < 4) return "color-scale-2";
                      return "color-scale-3";
                    }}
                    showWeekdayLabels={false}
                    gutterSize={3}
                    horizontal={true}
                    transformDayElement={(rect, value) => {
                      if (!value) return rect;
                      const date = new Date(value.date);
                      const dayOfMonth = date.getDate();
                      let style = {};
                      if (dayOfMonth === 1) style.marginLeft = "6px";
                      return React.cloneElement(rect, {
                        ...rect.props,
                        style: { ...rect.props.style, ...style },
                        onMouseEnter: (e) => {
                          setTooltipData({
                            date: value.date,
                            count: value.count,
                            x: e.clientX,
                            y: e.clientY,
                          });
                          setShowTooltip(true);
                        },
                        onMouseLeave: () => setShowTooltip(false),
                      });
                    }}
                  />
                  {showTooltip && (
                    <div
                      style={{
                        position: "fixed",
                        top: tooltipData.y + 10,
                        left: tooltipData.x + 10,
                        background: "#111",
                        color: "#fff",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        pointerEvents: "none",
                        zIndex: 1000,
                      }}
                    >
                      {tooltipData.count} request(s) on {tooltipData.date}
                    </div>
                  )}
                </div>

               
                <div className="recent-activity">
                  <div className="activity-header">Recent Activity</div>
                  <div className="activity-list">
                    {recentActivity.length === 0 ? (
                      <div className="no-activity">No recent activity.</div>
                    ) : (
                      <ul>
                        {recentActivity.map((activity, idx) => (
                          <li key={idx}>
                            <span className="activity-type">
                              {activity.type}
                            </span>{" "}
                            - {activity.description}{" "}
                            <span className="activity-date">
                              ({new Date(activity.date).toLocaleString()})
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            }
          />

          <Route path="request" element={<RequestCertificate />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="downloaded" element={<DownloadCertificate />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;
