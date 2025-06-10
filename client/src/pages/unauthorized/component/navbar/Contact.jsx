import React from 'react';
import './Contact.scss';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from './Navbar.jsx';
import Footer from '../footer/Footer.jsx';


const Contact = () => {
  return (
    <>
    <Navbar/>
  
    <section className="contact-section">
      <div className="contact-hero">
        <h1>Contact Us</h1>
       
        <p>We're here to help you! Reach out to us anytime, and we’ll happily answer your questions.</p>
         <div className="styled-separator"></div>
      </div>

      <div className="contact-container">
        <div className="contact-form fade-in">
          <h2>Send a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="text" placeholder="Subject" required />
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className="contact-details fade-in">
          <h2>Get in Touch</h2>
          <div className="info">
            <div><FaEnvelope className="icon" /><span>support@placeme.com</span></div>
            <div><FaPhoneAlt className="icon" /><span>+91 9876543210</span></div>
            <div><FaMapMarkerAlt className="icon" /><span>Pune, Maharashtra, India</span></div>
          </div>

          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.460419368433!2d73.84769321489085!3d18.523545187403033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06933c9aebb%3A0x1a6c5d97f2c83c!2sPune!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
    <Footer/>
      </>
  );
};

export default Contact;
