import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBook, FaChartLine, FaGraduationCap, FaQuestionCircle } from 'react-icons/fa';

const Navbar = ({ isAuthenticated, logout }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo" onClick={() => handleLinkClick('')}>
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="E-Buddy Logo" />
      </Link>

      <div className="nav-links-container">
        <ul className="nav-links">
          {isAuthenticated ? (
            <>
              <li>
                <Link 
                  to="/quiz" 
                  className={activeLink === 'quiz' ? 'active' : ''}
                  onClick={() => handleLinkClick('quiz')}
                >
                  <FaQuestionCircle className="nav-icon" />
                  <span>Attend Quiz</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/learning-path" 
                  className={activeLink === 'learning' ? 'active' : ''}
                  onClick={() => handleLinkClick('learning')}
                >
                  <FaBook className="nav-icon" />
                  <span>Learning Path</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/study-materials" 
                  className={activeLink === 'study' ? 'active' : ''}
                  onClick={() => handleLinkClick('study')}
                >
                  <FaGraduationCap className="nav-icon" />
                  <span>Study Materials</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/careerpath" 
                  className={activeLink === 'career' ? 'active' : ''}
                  onClick={() => handleLinkClick('career')}
                >
                  <FaChartLine className="nav-icon" />
                  <span>Career Guidance</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className={activeLink === 'profile' ? 'active' : ''}
                  onClick={() => handleLinkClick('profile')}
                >
                  <FaUser className="nav-icon" />
                  <span>Profile</span>
                </Link>
              </li>
              <li className="logout-item" onClick={handleLogout}>
                    <FaSignOutAlt className="nav-icon" />
                <span>Logout</span>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/signup" 
                  className={activeLink === 'signup' ? 'active' : ''}
                  onClick={() => handleLinkClick('signup')}
                >
                  <FaUserPlus className="nav-icon" />
                  <span>Signup</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className={activeLink === 'login' ? 'active' : ''}
                  onClick={() => handleLinkClick('login')}
                >
                  <FaSignInAlt className="nav-icon" />
                  <span>Login</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;