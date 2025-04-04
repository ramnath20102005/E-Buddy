import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      // Store userId in sessionStorage for tracking progress
      sessionStorage.setItem("userId", data.userId);

      // Update authentication state
      setIsAuthenticated(true);

      // Redirect to Home Page
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h2 className="auth-title">Welcome Back</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin} className="auth-form">
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
              Login
            </button>
          </form>
          <p>
            <a href="/signup">Don't have an account? Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;