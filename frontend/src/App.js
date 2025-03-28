import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

import './App.css';

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + 3) % 3);
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

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
                  <div className="hero-section" style={{
                    padding: '5rem 2rem',
                    textAlign: 'center',
                    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${process.env.PUBLIC_URL}/hero-bg.jpg) center/cover no-repeat`,
                    color: 'white',
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <div className="hero-content">
                      <h1 style={{
                        fontSize: '3.5rem',
                        marginBottom: '1.5rem',
                        fontWeight: '700',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                      }}>Welcome to E-Buddy</h1>
                      <p style={{
                        fontSize: '1.5rem',
                        maxWidth: '800px',
                        margin: '0 auto 2rem',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
                      }}>Your ultimate companion for learning and career growth.</p>
                    </div>
                  </div>
                  <div className="carousel-section">
                    <div className="carousel">
                      <div
                        className="carousel-inner"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                      >
                        <div className="carousel-item">
                          <img src={`${process.env.PUBLIC_URL}/carousel_images/car_image1.jpg`} alt="Slide 1" />
                        </div>
                        <div className="carousel-item">
                          <img src={`${process.env.PUBLIC_URL}/carousel_images/car_image2.jpg`} alt="Slide 2" />
                        </div>
                        <div className="carousel-item">
                          <img src={`${process.env.PUBLIC_URL}/carousel_images/car_image3.jpg`} alt="Slide 3" />
                        </div>
                      </div>
                      <button className="carousel-control prev" onClick={prevSlide}>
                        ❮
                      </button>
                      <button className="carousel-control next" onClick={nextSlide}>
                        ❯
                      </button>
                    </div>
                  </div>
                  <div className="features-section">
                    <div className="outer-rectangle">
                      <h2 className="section-header">Features</h2>
                      <div className="features-grid">
                        <div className="feature-box">Personalized Learning</div>
                        <div className="feature-box">AI Career Counseling</div>
                        <div className="feature-box">Interactive Chatbot</div>
                      </div>
                    </div>
                  </div>
                  <Chatbot />
                </>
              ) : (
                <Navigate to="/landing" />
              )
            }
          />

          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route 
            path="/signup" 
            element={<Signup setIsAuthenticated={setIsAuthenticated} />} 
          />

          <Route
            path="/profile-setup"
            element={isAuthenticated ? <ProfileSetup /> : <Navigate to="/landing" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/landing" />}
          />
          <Route
            path="/learning-path"
            element={isAuthenticated ? <LearningPath /> : <Navigate to="/landing" />}
          />
          <Route
            path="/study-materials"
            element={isAuthenticated ? <StudyMaterials /> : <Navigate to="/landing" />}
          />
          <Route
            path="/careerpath"
            element={isAuthenticated ? <CareerPath /> : <Navigate to="/landing" />}
          />
          <Route
            path="/quiz"
            element={isAuthenticated ? <QuizPage /> : <Navigate to="/landing" />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;