import React, { useState, useEffect } from "react";
import "./RequestCertificate.css";

const RequestCertificate = () => {
  const [form, setForm] = useState({
    name: "",
    course: "",
    email: "",
    completionDate: "",
    userId: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
       
        const res = await fetch("http://localhost:8080/loggedInUser", {
        method: "GET",
        credentials: "include", 
});

        if (res.ok) {
          const user = await res.json();
          setForm({
            name: user.name,
            email: user.email,
            userId: user.id,
            course: "",
            completionDate: "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const res = await fetch("http://localhost:8080/addRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          course: form.course,
          email: form.email,
          completionDate: form.completionDate,
          user: { id: form.userId },
        }),
         credentials: "include"
      });

      if (res.ok) {
        setSuccess("Certificate request submitted successfully!");
        setForm((prev) => ({ ...prev, course: "", completionDate: "" }));
      } else {
        const errText = await res.text();
        setError(` ${errText || "Failed to submit request"}`);
      }

      setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
    } catch {
      setError(" Network error. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="request-wrapper">
      <img src="https://cdn3d.iconscout.com/3d/premium/thumb/student-studying-on-laptop-while-sitting-on-big-books-5711045-4779537.png"alt="Certificate"className="corner-image"/>
    <div className="request-container">
      {success && <div className="popup-msg success-popup">{success}</div>}
      {error && <div className="popup-msg error-popup">{error}</div>}

      <div className="request-box">
        <h2 className="request-heading">Request Certificate</h2><br/><br/>
        <form className="request-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input type="text" name="name" value={form.name} readOnly />
          </label>
          <label>
            Course
            <input
              type="text"
              name="course"
              value={form.course}
              onChange={handleChange}
              required
              placeholder="Enter course name"
            />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} readOnly />
          </label>
          <label>
            Completion Date
            <input
              type="date"
              name="completionDate"
              value={form.completionDate}
              onChange={handleChange}
              required
               max={new Date().toISOString().split("T")[0]}
            />
          </label>
          <br/>
          <button type="submit">Request Certificate</button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default RequestCertificate;
