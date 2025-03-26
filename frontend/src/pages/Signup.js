import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Auth.css"; // Common CSS for both Signup & Login

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        password,
      });

      // Store only the token
      localStorage.setItem("token", data.token);
      
      // Redirect to Profile Setup page after successful signup
      navigate("/profile-setup");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
          <p>
            <a href="/login">Already have an account? Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
