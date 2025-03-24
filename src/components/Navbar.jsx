import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="E-Buddy Logo" />
      </div>

      {/* Nav Links */}
      <ul className="nav-links">
        <li><a href="#">Learning Path</a></li>
        <li><a href="#">Career Guidance</a></li>
        <li><a href="#">Signup</a></li>
        <li><a href="#">Login</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;