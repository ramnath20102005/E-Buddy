import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from './components/Chatbot';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ProfileSetup from './pages/ProfileSetup';
import LearningPath from "./pages/LearningPath";
import StudyMaterials from "./pages/StudyMaterials";
import CareerPath from "./pages/CareerPath";
import Landing from './pages/Landing';
import QuizPage from './pages/QuizPage';
import LearningActivity from './pages/LearningActivity';
import CareerInsights from './pages/CareerInsights';
import CourseRecommendation from './pages/CourseRecommendation';
import './App.css';

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const featuresRef = useRef(null);
  const carouselImages = [
    `${process.env.PUBLIC_URL}/carousel_images/learning1.jpg`,
    `${process.env.PUBLIC_URL}/carousel_images/learning2.jpg`,
    `${process.env.PUBLIC_URL}/carousel_images/learning3.jpg`
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const progress = document.querySelector('.carousel-progress');
    if (progress) {
      progress.style.transform = `translateX(${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  const features = [
    {
      icon: '📚',
      title: 'Personalized Learning',
      description: 'Customized learning paths tailored to your skills and goals'
    },
    {
      icon: '💼',
      title: 'AI Career Counseling',
      description: 'Smart career recommendations based on your profile'
    },
    {
      icon: '🤖',
      title: 'Interactive Chatbot',
      description: 'virtual assistant for your questions'
    }
  ];

  const letterAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const titleText = "Welcome to E-Buddy";
  const subtitleText = "Your intelligent learning companion";

  return (
    <Router>
      <div className="app-container">
        <Navbar isAuthenticated={isAuthenticated} logout={logout} />
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/home" : "/landing"} />}
          />

          <Route
            path="/landing"
            element={isAuthenticated ? <Navigate to="/home" /> : <Landing />}
          />

          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <>
                  <motion.section
                    className="hero-section"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{
                      backgroundImage: "url('/hero-bg.jpg')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <div className="hero-content">
                      <motion.h1 initial="hidden" animate="visible">
                        {titleText.split("").map((char, i) => (
                          <motion.span
                            key={i}
                            custom={i}
                            variants={letterAnimation}
                          >
                            {char}
                          </motion.span>
                        ))}
                      </motion.h1>
                      
                      <motion.p initial="hidden" animate="visible">
                        {subtitleText.split("").map((char, i) => (
                          <motion.span
                            key={i}
                            custom={i + titleText.length}
                            variants={letterAnimation}
                          >
                            {char}
                          </motion.span>
                        ))}
                      </motion.p>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <button 
                          className="cta-button"
                          onClick={scrollToFeatures}
                        >
                          Explore Features
                        </button>
                      </motion.div>
                    </div>
                  </motion.section>

                  <section className="carousel-section">
                    <div className="carousel-container">
                      <div className="carousel">
                        <div 
                          className="carousel-inner" 
                          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                          {carouselImages.map((imgSrc, index) => (
                            <div 
                              className={`carousel-item ${index === currentIndex ? 'active' : ''}`} 
                              key={index}
                            >
                              <img 
                                src={imgSrc} 
                                alt={`Learning resource ${index + 1}`}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://source.unsplash.com/random/800x400?learning,education${index}`;
                                }}
                              />
                              <div className="carousel-caption">
                                <h3>Educational Resource {index + 1}</h3>
                                <p>Enhance your learning journey with our curated materials</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="carousel-progress"></div>
                        <button 
                          className="carousel-control prev"
                          onClick={prevSlide}
                        >
                          ❮
                        </button>
                        <button 
                          className="carousel-control next"
                          onClick={nextSlide}
                        >
                          ❯
                        </button>
                        <div className="carousel-indicators">
                          {carouselImages.map((_, index) => (
                            <button
                              key={index}
                              className={index === currentIndex ? 'active' : ''}
                              onClick={() => goToSlide(index)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="features-section" ref={featuresRef}>
                    <div className="section-container">
                      <motion.h2
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Our Key Features
                      </motion.h2>
                      
                      <div className="features-grid">
                        {features.map((feature, index) => (
                          <motion.div
                            key={index}
                            className="feature-card"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ y: -5 }}
                          >
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <Chatbot />
                </>
              ) : (
                <Navigate to="/landing" />
              )
            }
          />

          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/profile-setup" element={isAuthenticated ? <ProfileSetup /> : <Navigate to="/landing" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/landing" />} />
          <Route path="/learning-path" element={isAuthenticated ? <LearningPath /> : <Navigate to="/landing" />} />
          <Route path="/study-materials" element={isAuthenticated ? <StudyMaterials /> : <Navigate to="/landing" />} />
          <Route path="/careerpath" element={isAuthenticated ? <CareerPath /> : <Navigate to="/landing" />} />
          <Route path="/quiz" element={isAuthenticated ? <QuizPage /> : <Navigate to="/landing" />} />
          <Route path="/learning-activity" element={isAuthenticated ? <LearningActivity /> : <Navigate to="/landing" />} />
          <Route path="/career-insights" element={isAuthenticated ? <CareerInsights /> : <Navigate to="/landing" />} />
          <Route path="/course-recommendation" element={isAuthenticated ? <CourseRecommendation /> : <Navigate to="/landing" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;