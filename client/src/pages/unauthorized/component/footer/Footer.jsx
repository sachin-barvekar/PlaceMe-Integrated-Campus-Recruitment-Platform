import React from 'react';
import './Footer.scss';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="place-footer">
      <div className="footer-content">
        <div className="footer-box">
          <img
            src="http://localhost:5173/src/assets/images/logo.png"
            alt="PlaceMe Logo"
            className="logo"
          />
          <p>
            A smart campus recruitment solution connecting students, colleges, and recruiters in one platform.
          </p>
        </div>

        <div className="footer-box">
          <h4>Explore</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-box">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <hr />
        <p>© {new Date().getFullYear()} PlaceMe. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
