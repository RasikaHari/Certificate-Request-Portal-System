import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="landing-wrapper">
     
      <nav className="landing-navbar">
        <div className="logo">OCRPS</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#process">Process</a>
          <a href="#about">About</a>
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/register" className="btn-register">Register</Link>
        </div>
      </nav>

      
      <header className="landing-hero">
        <div className="hero-text">
          <h1>Online Certificate Request Portal System</h1>
          <p>
            Request, manage, and track certificates effortlessly with our secure
            and user-friendly platform.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/male-student-getting-graduation-degree-10255682-8382381.png"
            alt="Certificate Illustration"
          />
        </div>
      </header>

    
      <section id="features" className="features-section">
        <h2>Why Choose OCRPS?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>⚡ Fast Requests</h3>
            <p>Submit certificate requests online in just a few clicks.</p>
          </div>
          <div className="feature-card">
            <h3>🔒 Secure Data</h3>
            <p>Your information is protected with enterprise-grade security.</p>
          </div>
          <div className="feature-card">
            <h3>⏳ Real-time Tracking</h3>
            <p>Check the status of your certificate anytime, anywhere.</p>
          </div>
          <div className="feature-card">
            <h3>👩‍💼 Admin & Staff Access</h3>
            <p>Admins and staff can verify, approve, and manage requests seamlessly.</p>
          </div>
        </div>
      </section>

     
      <section id="process" className="process-section">
        <h2>How It Works</h2>
        <div className="process-grid">
          <div className="process-step">
            <div className="process-icon">📝</div>
            <h3>Request</h3>
            <p>Students submit certificate requests online with ease.</p>
          </div>
          <div className="process-step">
            <div className="process-icon">👨‍💼</div>
            <h3>Review</h3>
            <p>Staff verifies and processes the request efficiently.</p>
          </div>
          <div className="process-step">
            <div className="process-icon">✅</div>
            <h3>Approve & Issue</h3>
            <p>Admin approves and issues the certificate digitally.</p>
          </div>
        </div>
      </section>

      
      <section id="about" className="about-section">
        <h2>About OCRPS</h2>
        <p>
          OCRPS is a modern web-based solution designed to streamline the
          certificate request process for students, staff, and administrators.
          With automated workflows and real-time updates, we aim to reduce
          manual paperwork and improve efficiency.
        </p>
      </section>

     
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} OCRPS - All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
