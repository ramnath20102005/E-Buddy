import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../Home.css';
import {
  FaRobot, FaGraduationCap, FaChartLine, FaAward, FaRocket, FaUsers, FaBookOpen, FaArrowRight, FaStar, FaCheckCircle, FaUser, FaLightbulb, FaHeadset
} from 'react-icons/fa';

const Home = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: <FaRobot />, title: 'AI-Powered Guidance', description: '24/7 support and personalized recommendations based on your learning style.', color: '#4a6bff', benefits: ['24/7 Availability', 'Personalized Learning', 'Smart Recommendations']
    },
    {
      icon: <FaGraduationCap />, title: 'Personalized Learning', description: 'Customized study plans and resources tailored to your goals, skills, and progress.', color: '#6c5ce7', benefits: ['Custom Study Plans', 'Progress Tracking', 'Adaptive Content']
    },
    {
      icon: <FaChartLine />, title: 'Career Roadmaps', description: 'Detailed career paths with skill requirements, salary expectations, and job market trends.', color: '#00b894', benefits: ['Career Paths', 'Skill Mapping', 'Market Insights']
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Learners', icon: <FaUsers /> },
    { number: '95%', label: 'Success Rate', icon: <FaAward /> },
    { number: '24/7', label: 'AI Support', icon: <FaRobot /> },
    { number: '500+', label: 'Courses', icon: <FaBookOpen /> }
  ];

  const testimonials = [
    {
      text: 'E-Buddy completely transformed how I approach learning. The personalized recommendations helped me focus on exactly what I needed to advance my career.',
      author: 'Sarah J.',
      role: 'Software Developer',
      rating: 5,
      avatar: '👩‍💻'
    },
    {
      text: 'The AI guidance is incredible! It\'s like having a personal tutor available 24/7. My learning efficiency has improved dramatically.',
      author: 'Michael R.',
      role: 'Data Scientist',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      text: 'E-Buddy helped me discover the perfect career path. The insights and recommendations were spot-on and very practical.',
      author: 'Priya S.',
      role: 'UX Designer',
      rating: 5,
      avatar: '👩‍🎨'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [features.length, testimonials.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="home-container"
    >
      {/* Hero Section */}
      <section className="home-hero"
        style={{ backgroundImage: `linear-gradient(rgba(11,18,32,0.85), rgba(11,18,32,0.85)), url(${process.env.PUBLIC_URL}/hero-bg.jpg)` }}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Welcome back to <span className="gradient-text">E-Buddy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-description"
          >
            Your intelligent learning companion. Level up your skills with AI-powered guidance, personalized learning paths, and real-time insights.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-cta"
          >
            <Link to="/learning-path" className="cta-btn primary">
              <FaRocket className="btn-icon" /> Start Learning
            </Link>
            <Link to="/careerpath" className="cta-btn ghost">Explore Careers</Link>
          </motion.div>
        </div>
        <div className="floating-elements">
          <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity }} className="floating-icon floating-1"><FaRobot /></motion.div>
          <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 4, repeat: Infinity }} className="floating-icon floating-2"><FaGraduationCap /></motion.div>
          <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 3.5, repeat: Infinity }} className="floating-icon floating-3"><FaChartLine /></motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-strip">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            className="stat"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="num">{stat.number}</div>
            <div className="label">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">Why Choose E-Buddy?</h2>
          <p className="section-subtitle">Discover the power of AI-driven education</p>
        </motion.div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="feature-card"
              style={{ '--feature-color': feature.color }}
            >
              <div className="feature-icon" style={{ color: feature.color }}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul className="feature-benefits">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx}><FaCheckCircle className="benefit-icon" />{benefit}</li>
                ))}
              </ul>
              <div className="feature-action"><FaArrowRight className="action-icon" /></div>
            </motion.div>
          ))}
        </div>
        {/* Interactive Feature Showcase */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="feature-showcase"
        >
          <div className="showcase-content">
            <h3>{features[currentFeature].title}</h3>
            <p>{features[currentFeature].description}</p>
            <div className="showcase-indicators">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentFeature ? 'active' : ''}`}
                  onClick={() => setCurrentFeature(index)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">Join thousands of satisfied learners</p>
        </motion.div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className={`testimonial-card${index === currentTestimonial ? ' active' : ''}`}
              style={{ display: index === currentTestimonial ? 'block' : 'none' }}
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar">{testimonial.avatar}</div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <strong>{testimonial.author}</strong>
                <span>{testimonial.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="testimonial-indicators">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${idx === currentTestimonial ? 'active' : ''}`}
              onClick={() => setCurrentTestimonial(idx)}
            />
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="cta-content"
        >
          <h2 className="cta-title">Ready to Begin Your Journey?</h2>
          <p className="cta-description">
            Join thousands of learners who have already transformed their careers with E-Buddy
          </p>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
            className="cta-button-wrapper"
          >
            <Link to="/learning-path" className="cta-btn primary large">
              <FaRocket className="btn-icon" /> Start Learning for Free
            </Link>
          </motion.div>
          <p className="cta-note">No credit card required • Start immediately</p>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Home;