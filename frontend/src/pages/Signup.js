import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Auth.css";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaRocket,
  FaShieldAlt,
  FaCheckCircle,
  FaUserPlus,
  FaGraduationCap,
  FaLightbulb
} from "react-icons/fa";

const Signup = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    interests: "",
    educationLevel: ""
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateConfirmPassword = (confirmPassword) => {
    return confirmPassword === formData.password && confirmPassword.length > 0;
  };

  const validateName = (name) => {
    return name.length >= 2;
  };

  const getFieldStatus = (fieldName) => {
    switch (fieldName) {
      case 'name':
        if (!formData.name) return null;
        return validateName(formData.name) ? 'valid' : 'invalid';
      case 'email':
        if (!formData.email) return null;
        return validateEmail(formData.email) ? 'valid' : 'invalid';
      case 'password':
        if (!formData.password) return null;
        return validatePassword(formData.password) ? 'valid' : 'invalid';
      case 'confirmPassword':
        if (!formData.confirmPassword) return null;
        return validateConfirmPassword(formData.confirmPassword) ? 'valid' : 'invalid';
      default:
        return null;
    }
  };

  const getFieldMessage = (fieldName) => {
    switch (fieldName) {
      case 'name':
        if (getFieldStatus('name') === 'invalid') return 'Name must be at least 2 characters';
        return null;
      case 'email':
        if (getFieldStatus('email') === 'invalid') return 'Please enter a valid email address';
        return null;
      case 'password':
        if (getFieldStatus('password') === 'invalid') return 'Password must be at least 6 characters';
        return null;
      case 'confirmPassword':
        if (getFieldStatus('confirmPassword') === 'invalid') return 'Passwords do not match';
        return null;
      default:
        return null;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    if (!validateName(formData.name) || !validateEmail(formData.email) || 
        !validatePassword(formData.password) || !validateConfirmPassword(formData.confirmPassword)) {
      setError("Please fill all fields correctly");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        interests: formData.interests,
        educationLevel: formData.educationLevel
      });

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      // Store userId in sessionStorage for tracking progress
      sessionStorage.setItem("userId", data.userId);

      // Update authentication state
      setIsAuthenticated(true);

      // Redirect to Profile Setup
      navigate("/profile-setup");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return validateName(formData.name) && 
           validateEmail(formData.email) && 
           validatePassword(formData.password) && 
           validateConfirmPassword(formData.confirmPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box enhanced signup">
          <div className="auth-header">
            <div className="auth-logo">
              <FaRocket className="logo-icon" />
            </div>
            <h2 className="auth-title">Join E-Buddy Today!</h2>
            <p className="auth-subtitle">Start your personalized learning journey</p>
          </div>

          {error && (
            <div className="error-message enhanced">
              <FaShieldAlt className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="auth-form enhanced">
            <div className="input-group enhanced">
              <div className="input-wrapper">
                <FaUser className={`input-icon ${nameFocused ? 'focused' : ''}`} />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  required
                  className={`enhanced-input ${getFieldStatus('name')}`}
                />
                {getFieldStatus('name') === 'valid' && (
                  <FaCheckCircle className="status-icon valid" />
                )}
                {getFieldStatus('name') === 'invalid' && (
                  <div className="status-icon invalid">!</div>
                )}
              </div>
              {getFieldMessage('name') && (
                <span className="validation-message">{getFieldMessage('name')}</span>
              )}
            </div>

            <div className="input-group enhanced">
              <div className="input-wrapper">
                <FaEnvelope className={`input-icon ${emailFocused ? 'focused' : ''}`} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                  className={`enhanced-input ${getFieldStatus('email')}`}
                />
                {getFieldStatus('email') === 'valid' && (
                  <FaCheckCircle className="status-icon valid" />
                )}
                {getFieldStatus('email') === 'invalid' && (
                  <div className="status-icon invalid">!</div>
                )}
              </div>
              {getFieldMessage('email') && (
                <span className="validation-message">{getFieldMessage('email')}</span>
              )}
            </div>

            <div className="input-group enhanced">
              <div className="input-wrapper">
                <FaLock className={`input-icon ${passwordFocused ? 'focused' : ''}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  className={`enhanced-input ${getFieldStatus('password')}`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {getFieldStatus('password') === 'valid' && (
                  <FaCheckCircle className="status-icon valid" />
                )}
                {getFieldStatus('password') === 'invalid' && formData.password && (
                  <div className="status-icon invalid">!</div>
                )}
              </div>
              {getFieldMessage('password') && (
                <span className="validation-message">{getFieldMessage('password')}</span>
              )}
            </div>

            <div className="input-group enhanced">
              <div className="input-wrapper">
                <FaLock className={`input-icon ${confirmPasswordFocused ? 'focused' : ''}`} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                  required
                  className={`enhanced-input ${getFieldStatus('confirmPassword')}`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {getFieldStatus('confirmPassword') === 'valid' && (
                  <FaCheckCircle className="status-icon valid" />
                )}
                {getFieldStatus('confirmPassword') === 'invalid' && formData.confirmPassword && (
                  <div className="status-icon invalid">!</div>
                )}
              </div>
              {getFieldMessage('confirmPassword') && (
                <span className="validation-message">{getFieldMessage('confirmPassword')}</span>
              )}
            </div>

            <div className="input-group enhanced">
              <div className="input-wrapper">
                <FaLightbulb className="input-icon" />
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleInputChange}
                  className="enhanced-select"
                >
                  <option value="">Select your education level</option>
                  <option value="high-school">High School</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="professional">Professional</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="input-group enhanced">
              <div className="input-wrapper">
                <FaGraduationCap className="input-icon textarea-icon" />
                <textarea
                  name="interests"
                  placeholder="Tell us about your interests and career goals (optional)"
                  value={formData.interests}
                  onChange={handleInputChange}
                  rows="3"
                  className="enhanced-textarea"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`auth-button enhanced ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <FaUserPlus className="btn-icon" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="signup-prompt">
              Already have an account? 
              <a href="/login" className="signup-link">
                <FaUser className="link-icon" />
                Sign In
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
              <span>Start Learning</span>
            </div>
            <div className="feature-item">
              <FaCheckCircle className="feature-icon" />
              <span>Free Forever</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;