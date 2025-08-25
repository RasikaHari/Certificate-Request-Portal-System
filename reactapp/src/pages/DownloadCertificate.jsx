import React, { useEffect, useState } from "react";
import "./DownloadCertificate.css";

const DownloadCertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const userId = storedUser?.id;

  useEffect(() => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    // fetch(`http://localhost:8080/getDownloadedCertificates/${userId}`)
    fetch(`https://certificate-request-portal-system-e01i.onrender.com/getDownloadedCertificates/${userId}`, {
  credentials: 'include' // <-- include cookies
})

    
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch certificates");
        return res.json();
      })
      .then((data) => {
        setCertificates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching certificates:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  
  const filteredCertificates = certificates.filter((cert) =>
    cert.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-msg">Loading...</div>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="certificates-container">
      <div className="certificates-box">
        <h2 className="certificates-heading">Approved Certificates</h2>

        
          <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search by course name..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
         <img
            src="https://www.svgrepo.com/show/448837/search.svg"
            alt="search"
            className="search-icon"
          />
        </div>
        {filteredCertificates.length === 0 ? (
          <p className="no-certificates-msg">No certificates found.</p>
        ) : (
          <table className="certificates-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Course</th>
                <th>Completion Date</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map((cert) => (
                <tr key={cert.id}>
                  <td>{cert.name}</td>
                  <td>{cert.course}</td>
                  <td>{cert.completionDate}</td>
                  <td>
                    <a
                      // href={`http://localhost:8080/generateCertificate/${cert.id}`}
                      href={`https://certificate-request-portal-system-e01i.onrender.com/generateCertificate/${cert.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-btn"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DownloadCertificate;
