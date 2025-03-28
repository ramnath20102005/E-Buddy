import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Auth.css"; // Common CSS for both Signup & Login

const Signup = ({ setIsAuthenticated }) => {  // Add setIsAuthenticated prop
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });
      
      if (data.token && data.userId) {
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("userId", data.userId);
        setIsAuthenticated(true);  // Update authentication state
        navigate("/profile-setup", { replace: true });
      } else {
        throw new Error("Missing token or userId in response");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h2 className="auth-title">Create Account</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSignup} className="auth-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter UserName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-button">
              Sign Up
            </button>
          </form>
          <p className="auth-link">
            <a href="/login">Already have an account? Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;