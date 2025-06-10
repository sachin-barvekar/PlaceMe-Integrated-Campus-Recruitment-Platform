import React from 'react';
import { Navbar as RsuiteNavbar, Nav } from 'rsuite';

import './Navbar.scss';

const Navbar = () => {
  return (
    <div className="navbar-overlay">
      <RsuiteNavbar className="transparent-navbar">
        <RsuiteNavbar.Brand href="/">
          <img
            src="http://localhost:5173/src/assets/images/logo.png"
            alt="PlaceMe Logo"
            className="logo"
          />
        </RsuiteNavbar.Brand>
        <Nav className="nav-center">
          <Nav.Item href="/auth" className="nav-item">Home</Nav.Item>
          <Nav.Item href="/about" className="nav-item">About Us</Nav.Item>
        <Nav.Item href="/services" className="nav-item">Services</Nav.Item>
          <Nav.Item href="/contact" className="nav-item">Contact Us</Nav.Item>
          <Nav.Item href="/login" className="nav-item">Login</Nav.Item>
      
        </Nav>
      </RsuiteNavbar>
    </div>
  );
};

export default Navbar;
