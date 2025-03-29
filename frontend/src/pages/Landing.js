import React from 'react';
import { Link } from 'react-router-dom';
import '../Landing.css';
import { FaRobot, FaGraduationCap, FaChartLine, FaQuoteLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Landing = () => {
  const features = [
    {
      icon: <FaRobot />,
      title: "AI-Powered Guidance",
      description: "Our intelligent chatbot provides 24/7 support and personalized recommendations based on your learning style."
    },
    {
      icon: <FaGraduationCap />,
      title: "Personalized Learning",
      description: "Customized study plans and resources tailored to your goals, skills, and progress."
    },
    {
      icon: <FaChartLine />,
      title: "Career Roadmaps",
      description: "Detailed career paths with skill requirements, salary expectations, and job market trends."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="landing-container"
    >
      {/* Hero Section */}
      <section 
        className="landing-hero"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${process.env.PUBLIC_URL}/hero-bg.jpg)` }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Transform Your Learning Journey
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          E-Buddy combines AI-powered guidance with personalized learning paths to help you achieve your educational and career goals.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="cta-buttons"
        >
          <Link to="/signup" className="cta-button cta-primary">Get Started</Link>
          <Link to="/login" className="cta-button cta-secondary">Login</Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose E-Buddy?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="feature-card"
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Users Say</h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="testimonial-card"
        >
          <FaQuoteLeft style={{ fontSize: '2rem', color: '#4a6bff', marginBottom: '1rem' }} />
          <p className="testimonial-text">
            E-Buddy completely transformed how I approach learning. The personalized recommendations helped me focus on exactly what I needed to advance my career.
          </p>
          <p className="testimonial-author">- Sarah J., Software Developer</p>
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <section className="features-section" style={{ paddingBottom: '7rem' }}>
        <h2 className="section-title">Ready to Begin Your Journey?</h2>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ display: 'inline-block' }}
          >
            <Link to="/signup" className="cta-button cta-primary" style={{ fontSize: '1.3rem', padding: '1rem 3rem' }}>
              Start Learning for Free
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Landing;