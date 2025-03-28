import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="E-Buddy Logo" />
      </div>
      <ul className="nav-links">
        {isAuthenticated ? (
          <>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/learning-path">Learning Path</Link></li>
            <li><Link to="/study-materials">Study Materials</Link></li>
            <li><Link to="/careerpath">Career Guidance</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;