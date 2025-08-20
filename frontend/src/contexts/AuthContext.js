import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isTokenExpired, clearAuthData } from '../utils/authUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to handle logout
  const logout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/landing');
  };

  // Function to handle token expiration
  const handleTokenExpiration = () => {
    console.log('Token expired, redirecting to landing page');
    logout();
  };

  // Check token validity on app load
  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        handleTokenExpiration();
        setLoading(false);
        return;
      }

      // Verify token with backend
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setIsAuthenticated(true);
        setUser(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          handleTokenExpiration();
        } else {
          console.error('Error verifying token:', error);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkTokenValidity();
  }, [navigate]);

  // Set up axios interceptor for automatic token expiration handling
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleTokenExpiration();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  // Periodically check token validity (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && isTokenExpired(token)) {
        handleTokenExpiration();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [navigate]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    handleTokenExpiration
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
