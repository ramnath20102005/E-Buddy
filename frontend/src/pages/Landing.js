import React from 'react';
import { Link } from 'react-router-dom';
import '../Landing.css';
import { FaRobot, FaGraduationCap, FaChartLine, FaQuoteLeft } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Hero Section with background style */}
      <section 
        className="landing-hero"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${process.env.PUBLIC_URL}/hero-bg.jpg)` }}
      >
        <h1>Transform Your Learning Journey</h1>
        <p>E-Buddy combines AI-powered guidance with personalized learning paths to help you achieve your educational and career goals.</p>
        <div className="cta-buttons">
          <Link to="/signup" className="cta-button cta-primary">Get Started</Link>
          <Link to="/login" className="cta-button cta-secondary">Login</Link>
        </div>
      </section>

      {/* Rest of your component remains exactly the same */}
      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose E-Buddy?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaRobot />
            </div>
            <h3>AI-Powered Guidance</h3>
            <p>Our intelligent chatbot provides 24/7 support and personalized recommendations based on your learning style.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaGraduationCap />
            </div>
            <h3>Personalized Learning</h3>
            <p>Customized study plans and resources tailored to your goals, skills, and progress.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Career Roadmaps</h3>
            <p>Detailed career paths with skill requirements, salary expectations, and job market trends.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonial-card">
          <FaQuoteLeft style={{ fontSize: '2rem', color: '#4a6bff', marginBottom: '1rem' }} />
          <p className="testimonial-text">
            E-Buddy completely transformed how I approach learning. The personalized recommendations helped me focus on exactly what I needed to advance my career.
          </p>
          <p className="testimonial-author">- Sarah J., Software Developer</p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="features-section" style={{ paddingBottom: '7rem' }}>
        <h2 className="section-title">Ready to Begin Your Journey?</h2>
        <div style={{ textAlign: 'center' }}>
          <Link to="/signup" className="cta-button cta-primary" style={{ fontSize: '1.3rem', padding: '1rem 3rem' }}>
            Start Learning for Free
          </Link>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} E-Buddy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;