import React, { useEffect, useState } from "react";
import "./MyRequest.css";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/loggedInUser", {
          method: "GET",
          credentials: "include", 
        });

        if (res.ok) {
          const user = await res.json();
          setUserId(user.id);
        } else if (res.status === 401) {
          setError("You are not logged in.");
        } else {
          setError("Failed to fetch user.");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

 
  useEffect(() => {
    if (!userId) return;

    const fetchRequests = async () => {
      try {
        const res = await fetch(`http://localhost:8080/getRequestsByUser/${userId}`, {
          method: "GET",
          credentials: "include", 
        });

        if (!res.ok) throw new Error("Failed to fetch requests");

        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message || "Error fetching requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  if (loading) return <p className="loading-msg">Loading your requests...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="my-requests-container">
      <div className="requests-box">
        <h2 className="requests-heading">My Certificate Requests</h2>
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/cute-student-with-pencil-9639941-7866555.png"
          alt=""
          className="corner-imagee"
        />
        {requests.length === 0 ? (
          <p className="no-requests-msg">You haven’t made any requests yet.</p>
        ) : (
          <div className="requests-cards">
            {requests.map((req) => (
              <div className="request-card" key={req.id}>
                <h3 className="card-course">{req.course}</h3>
                <p>
                  <strong>Completion Date:</strong> {req.completionDate}
                </p>
                <p
                  className={`card-status ${
                    req.status === "APPROVED"
                      ? "approved"
                      : req.status === "REJECTED"
                      ? "rejected"
                      : "pending"
                  }`}
                >
                  <strong>Status:</strong> {req.status || "PENDING"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
