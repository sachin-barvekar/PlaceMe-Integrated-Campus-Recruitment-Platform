import React from 'react';
import './About.scss';
import { FaGraduationCap, FaUniversity, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import Navbar from './Navbar.jsx';
import Footer from '../footer/Footer.jsx';

const features = [
  "Smart Resume Management",
  "Real-Time Placement Updates",
  "Interview Scheduling & Notifications",
  "Company-Wise Job Listings",
  "Student Performance Dashboard",
  "Admin & Recruiter Panel Access",
  "Email Notifications & Reminders",
  "Secure Login and Role-Based Access"
];

const About = () => {
   
  return (
    <>
    <Navbar />
    <section className="about-section">
      <div className="about-hero">
        <h1>About Us</h1>
        <p>
          PlaceMe is an innovative campus recruitment platform designed to connect students,
          colleges, and top recruiters on one seamless platform.
        </p>
      <div className="styled-separator"></div>

      </div>

      <div className="container">
        {/* Mission */}
        <div className="mission fade-in">
          <h2>Our Mission</h2>
          <p>
            To bridge the gap between academic institutions, students, and recruiters by offering a
            centralized digital platform that enhances efficiency and accessibility in campus placements.
          </p>
        </div>

        {/* Who We Serve */}
        <div className="serve-section fade-in">
          <h2>Who We Serve</h2>
          <div className="roles">
            <div className="role-card">
              <FaGraduationCap className="icon" />
              <h3>Students</h3>
              <p>Apply for jobs, get updates, and track your placement journey easily.</p>
            </div>
            <div className="role-card">
              <FaUniversity className="icon" />
              <h3>Colleges</h3>
              <p>Manage placement data, schedule interviews, and analyze performance.</p>
            </div>
            <div className="role-card">
              <FaBuilding className="icon" />
              <h3>Recruiters</h3>
              <p>Find top talent quickly with access to verified student profiles.</p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="features fade-in">
          <h2>Key Features</h2>
          <div className="feature-visual">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <FaCheckCircle className="check-icon" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="why-us fade-in">
          <h2>Why Choose PlaceMe?</h2>
          <p>
            PlaceMe isn’t just a platform – it’s a smarter future for students and recruiters alike. With a focus
            on automation, results, and usability, we simplify every step of the campus recruitment process.
          </p>
        </div>
      </div>
    </section>
    <Footer/>
     </>
  );
};

export default About;
