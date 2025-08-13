import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Landing.css';
import { 
  FaRobot, 
  FaGraduationCap, 
  FaChartLine, 
  FaQuoteLeft, 
  FaPlay,
  FaUsers,
  FaAward,
  FaRocket,
  FaArrowRight,
  FaStar,
  FaCheckCircle,
  FaLightbulb,
  FaBookOpen,
  FaHeadset,
  FaUser
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Landing = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    {
      icon: <FaRobot />,
      title: "AI-Powered Guidance",
      description: "Our intelligent chatbot provides 24/7 support and personalized recommendations based on your learning style.",
      color: "#4a6bff",
      benefits: ["24/7 Availability", "Personalized Learning", "Smart Recommendations"]
    },
    {
      icon: <FaGraduationCap />,
      title: "Personalized Learning",
      description: "Customized study plans and resources tailored to your goals, skills, and progress.",
      color: "#6c5ce7",
      benefits: ["Custom Study Plans", "Progress Tracking", "Adaptive Content"]
    },
    {
      icon: <FaChartLine />,
      title: "Career Roadmaps",
      description: "Detailed career paths with skill requirements, salary expectations, and job market trends.",
      color: "#00b894",
      benefits: ["Career Paths", "Skill Mapping", "Market Insights"]
    }
  ];

  const testimonials = [
    {
      text: "E-Buddy completely transformed how I approach learning. The personalized recommendations helped me focus on exactly what I needed to advance my career.",
      author: "Sarah J.",
      role: "Software Developer",
      rating: 5,
      avatar: "👩‍💻"
    },
    {
      text: "The AI guidance is incredible! It's like having a personal tutor available 24/7. My learning efficiency has improved dramatically.",
      author: "Michael R.",
      role: "Data Scientist",
      rating: 5,
      avatar: "👨‍💻"
    },
    {
      text: "E-Buddy helped me discover the perfect career path. The insights and recommendations were spot-on and very practical.",
      author: "Priya S.",
      role: "UX Designer",
      rating: 5,
      avatar: "👩‍🎨"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Learners", icon: <FaUsers /> },
    { number: "95%", label: "Success Rate", icon: <FaAward /> },
    { number: "24/7", label: "AI Support", icon: <FaRobot /> },
    { number: "500+", label: "Courses", icon: <FaBookOpen /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

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
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${process.env.PUBLIC_URL}/hero-bg.jpg)` }}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Transform Your Learning Journey
            <span className="gradient-text"> with AI</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-description"
          >
            E-Buddy combines AI-powered guidance with personalized learning paths to help you achieve your educational and career goals.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-stats"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="stat-item"
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="cta-buttons"
          >
            <Link to="/signup" className="cta-button cta-primary">
              <FaRocket className="btn-icon" />
              Get Started Free
            </Link>
            <Link to="/login" className="cta-button cta-secondary">
              <FaHeadset className="btn-icon" />
              Login
            </Link>
            <button 
              className="cta-button cta-video"
              onClick={() => setIsVideoPlaying(true)}
            >
              <FaPlay className="btn-icon" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="floating-icon floating-1"
          >
            <FaRobot />
          </motion.div>
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="floating-icon floating-2"
          >
            <FaGraduationCap />
          </motion.div>
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            className="floating-icon floating-3"
          >
            <FaChartLine />
          </motion.div>
        </div>
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

        <div className="features-container">
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
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <ul className="feature-benefits">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx}>
                      <FaCheckCircle className="benefit-icon" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <div className="feature-action">
                  <FaArrowRight className="action-icon" />
                </div>
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
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">How E-Buddy Works</h2>
          <p className="section-subtitle">Your journey to success in 4 simple steps</p>
        </motion.div>

        <div className="steps-container">
          {[
            { icon: <FaUser />, title: "Sign Up", description: "Create your account and tell us about your goals" },
            { icon: <FaLightbulb />, title: "Get Assessed", description: "Our AI analyzes your skills and interests" },
            { icon: <FaBookOpen />, title: "Learn", description: "Access personalized courses and materials" },
            { icon: <FaAward />, title: "Succeed", description: "Track progress and achieve your goals" }
          ].map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="step-item"
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
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
              className="testimonial-card"
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar">{testimonial.avatar}</div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>
              </div>
              <FaQuoteLeft className="quote-icon" />
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <strong>{testimonial.author}</strong>
                <span>{testimonial.role}</span>
              </div>
            </motion.div>
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
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="cta-button-wrapper"
          >
            <Link to="/signup" className="cta-button cta-primary large">
              <FaRocket className="btn-icon" />
              Start Learning for Free
            </Link>
          </motion.div>
          <p className="cta-note">No credit card required • Start immediately</p>
        </motion.div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="video-modal"
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="video-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="close-button"
                onClick={() => setIsVideoPlaying(false)}
              >
                ×
              </button>
              <div className="video-placeholder">
                <FaPlay className="play-icon" />
                <p>Demo Video Coming Soon</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Landing;