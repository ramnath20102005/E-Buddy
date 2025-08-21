import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';
import { 
  FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBook, FaChartLine, FaGraduationCap, 
  FaQuestionCircle, FaUniversity, FaBars, FaTimes, FaSearch, FaChevronDown, FaSun, FaMoon
} from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'learn' | 'career' | 'me' | null
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('navTheme') || 'light');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/home') setActiveLink('home');
    if (path.startsWith('/quiz')) setActiveLink('quiz');
    else if (path.startsWith('/learning-path')) setActiveLink('learning');
    else if (path.startsWith('/study-materials')) setActiveLink('study');
    else if (path.startsWith('/careerpath')) setActiveLink('career');
    else if (path.startsWith('/course-recommendation')) setActiveLink('course-recommendation');
    else if (path.startsWith('/career-insights')) setActiveLink('career-insights');
    else if (path.startsWith('/learning-activity')) setActiveLink('learning-activity');
    else if (path.startsWith('/profile')) setActiveLink('profile');
    else if (path.startsWith('/signup')) setActiveLink('signup');
    else if (path.startsWith('/login')) setActiveLink('login');
    else setActiveLink('');
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem('navTheme', theme);
    // Apply theme to body for global consistency
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/study-materials?search=${encodeURIComponent(q)}`);
  };

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${theme === 'dark' ? 'theme-dark' : ''}`}>
      <div className="nav-inner">
        {/* Brand */}
        <Link to="/home" className="logo" onClick={closeAllMenus} aria-label="E-Buddy Home">
          <div className="brand-mark">
            <FaGraduationCap className="brand-icon" />
          </div>
          <span className="brand-text">E‑Buddy</span>
        </Link>

        {/* Search (desktop) */}
        <form className="nav-search desktop-only" onSubmit={handleSearchSubmit} role="search">
          <FaSearch className="search-icon" />
          <input 
            type="search" 
            placeholder="Search study materials..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search study materials"
          />
        </form>

        {/* Right controls */}
        <div className="right-controls">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            title="Toggle theme"
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          <button
            className="menu-toggle"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Links container */}
        <div className={`nav-links-container ${isMenuOpen ? 'open' : ''}`}>
          {/* Search (mobile) */}
          <form className="nav-search mobile-only" onSubmit={handleSearchSubmit} role="search">
            <FaSearch className="search-icon" />
            <input 
              type="search" 
              placeholder="Search study materials..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search study materials"
            />
          </form>

          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    to="/home" 
                    className={activeLink === 'home' ? 'active' : ''}
                    onClick={closeAllMenus}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://news-curator-deployed-1.onrender.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="external-link"
                    onClick={closeAllMenus}
                  >
                    News
                  </a>
                </li>
                {/* Learn dropdown */}
                <li className={`dropdown ${openDropdown === 'learn' ? 'open' : ''}`}>
                  <button className="dropdown-toggle" onClick={() => toggleDropdown('learn')}>
                    Learn <FaChevronDown className="chevron" />
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/quiz" className={activeLink === 'quiz' ? 'active' : ''} onClick={closeAllMenus}>
                      <FaQuestionCircle className="nav-icon" /> Attend Quiz
                    </Link>
                    <Link to="/learning-path" className={activeLink === 'learning' ? 'active' : ''} onClick={closeAllMenus}>
                      <FaBook className="nav-icon" /> Learning Path
                    </Link>
                    <Link to="/study-materials" className={activeLink === 'study' ? 'active' : ''} onClick={closeAllMenus}>
                      <FaGraduationCap className="nav-icon" /> Study Materials
                    </Link>
                  </div>
                </li>

                {/* Career dropdown */}
                <li className={`dropdown ${openDropdown === 'career' ? 'open' : ''}`}>
                  <button className="dropdown-toggle" onClick={() => toggleDropdown('career')}>
                    Career <FaChevronDown className="chevron" />
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/careerpath" className={activeLink === 'career' ? 'active' : ''} onClick={closeAllMenus}>
                      <FaChartLine className="nav-icon" /> Career Guidance
                    </Link>
                    <Link to="/course-recommendation" className={activeLink === 'course-recommendation' ? 'active' : ''} onClick={closeAllMenus}>
                      <FaUniversity className="nav-icon" /> Course Recommendations
                    </Link>
                    <Link to="/career-insights" className={activeLink === 'career-insights' ? 'active' : ''} onClick={closeAllMenus}>
                      <FaChartLine className="nav-icon" /> Career Insights
                    </Link>
                  </div>
                </li>

                {/* Me dropdown */}
                <li className={`dropdown ${openDropdown === 'me' ? 'open' : ''}`}>
                  <button className="dropdown-toggle" onClick={() => toggleDropdown('me')}>
                    Me <FaChevronDown className="chevron" />
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile" className={activeLink === 'profile' ? 'active' : ''} onClick={closeAllMenus}>
                      <FaUser className="nav-icon" /> Profile
                    </Link>
                    <Link to="/learning-activity" className={activeLink === 'learning-activity' ? 'active' : ''} onClick={closeAllMenus}>
                      <FaBook className="nav-icon" /> Learning Activity
                    </Link>
                    <button className="logout-item" onClick={handleLogout}>
                      <FaSignOutAlt className="nav-icon" /> Logout
                    </button>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/signup" 
                    className={`cta ${activeLink === 'signup' ? 'active' : ''}`}
                    onClick={closeAllMenus}
                  >
                    <FaUserPlus className="nav-icon" />
                    <span>Signup</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className={`cta ghost ${activeLink === 'login' ? 'active' : ''}`}
                    onClick={closeAllMenus}
                  >
                    <FaSignInAlt className="nav-icon" />
                    <span>Login</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      {isMenuOpen && <div className="mobile-overlay" onClick={closeAllMenus}></div>}
    </nav>
  );
};

export default Navbar;