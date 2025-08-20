import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../Auth.css";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaRocket,
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        email,
        password,
      });

      // Use the login function from AuthContext
      login(data.token, data.user);

      // Store userId in sessionStorage for tracking progress
      sessionStorage.setItem("userId", data.userId);

      // Redirect to Home Page
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getEmailStatus = () => {
    if (!email) return null;
    if (validateEmail(email)) return 'valid';
    return 'invalid';
  };

  const getPasswordStatus = () => {
    if (!password) return null;
    if (password.length >= 6) return 'valid';
    return 'invalid';
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box enhanced">
          <div className="auth-header">
            <div className="auth-logo">
              <FaRocket className="logo-icon" />
            </div>
            <h2 className="auth-title">Welcome Back!</h2>
            <p className="auth-subtitle">Sign in to continue your learning journey</p>
          </div>

          {error && (
            <div className="error-message enhanced">
              <FaShieldAlt className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form enhanced">
            <div className="input-group enhanced">
              <div className="input-wrapper">
                <FaEnvelope className={`input-icon ${emailFocused ? 'focused' : ''}`} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                  className={`enhanced-input ${getEmailStatus()}`}
                />
                {getEmailStatus() === 'valid' && (
                  <FaCheckCircle className="status-icon valid" />
                )}
                {getEmailStatus() === 'invalid' && (
                  <div className="status-icon invalid">!</div>
                )}
              </div>
              {getEmailStatus() === 'invalid' && email && (
                <span className="validation-message">Please enter a valid email address</span>
              )}
            </div>

            <div className="input-group enhanced">
              <div className="input-wrapper">
                <FaLock className={`input-icon ${passwordFocused ? 'focused' : ''}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  className={`enhanced-input ${getPasswordStatus()}`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {getPasswordStatus() === 'valid' && (
                  <FaCheckCircle className="status-icon valid" />
                )}
                {getPasswordStatus() === 'invalid' && password && (
                  <div className="status-icon invalid">!</div>
                )}
              </div>
              {getPasswordStatus() === 'invalid' && password && (
                <span className="validation-message">Password must be at least 6 characters</span>
              )}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <button 
              type="submit" 
              className={`auth-button enhanced ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <FaUser className="btn-icon" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="signup-prompt">
              Don't have an account? 
              <a href="/signup" className="signup-link">
                <FaRocket className="link-icon" />
                Sign Up
              </a>
            </p>
          </div>

          <div className="auth-features">
            <div className="feature-item">
              <FaShieldAlt className="feature-icon" />
              <span>Secure & Private</span>
            </div>
            <div className="feature-item">
              <FaRocket className="feature-icon" />
              <span>Fast & Reliable</span>
            </div>
            <div className="feature-item">
              <FaCheckCircle className="feature-icon" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;