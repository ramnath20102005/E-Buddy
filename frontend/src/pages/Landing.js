import React from 'react';
import '../App.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h2>Welcome to E-Buddy</h2>
        <p>Your ultimate companion for learning and career growth. Sign up or log in to get started!</p>
        <p className="auth-status">User is not authenticated</p>
        <div className="landing-description">
          <p>Explore personalized learning paths, get career guidance, and unlock your potential.</p>
          <p>Our AI-powered platform is designed to support your educational and professional journey.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;