import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isTokenExpiringSoon } from '../utils/authUtils';
import { 
  FaExclamationTriangle, 
  FaClock, 
  FaSignOutAlt,
  FaTimes 
} from 'react-icons/fa';
import './SessionExpiryNotification.css';

const SessionExpiryNotification = () => {
  const { logout } = useAuth();
  const [showNotification, setShowNotification] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('token');
      if (token && isTokenExpiringSoon(token, 10)) { // Show notification 10 minutes before expiry
        setShowNotification(true);
        
        // Calculate time remaining
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const remaining = Math.max(0, expirationTime - Date.now());
        setTimeRemaining(Math.ceil(remaining / 1000 / 60)); // Convert to minutes
      }
    };

    // Check immediately
    checkTokenExpiry();

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleExtendSession = () => {
    // This could trigger a token refresh if implemented
    setShowNotification(false);
  };

  const handleLogout = () => {
    logout();
    setShowNotification(false);
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification) return null;

  return (
    <div className="session-expiry-notification">
      <div className="notification-content">
        <div className="notification-icon">
          <FaExclamationTriangle />
        </div>
        <div className="notification-text">
          <h4>Session Expiring Soon</h4>
          <p>Your session will expire in approximately {timeRemaining} minutes.</p>
        </div>
        <div className="notification-actions">
          <button 
            className="btn-extend"
            onClick={handleExtendSession}
          >
            <FaClock /> Extend Session
          </button>
          <button 
            className="btn-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout Now
          </button>
          <button 
            className="btn-dismiss"
            onClick={handleDismiss}
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiryNotification;
