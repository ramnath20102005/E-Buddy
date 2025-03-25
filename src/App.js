import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfilePage from "./pages/ProfilePage";
import './App.css';

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 3); // 3 = number of slides
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + 3) % 3); // 3 = number of slides
  };

  return (
    <Router>
    <div className="app-container">
      <Navbar />
      <Routes>
      <Route path="/" element={
        <>
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to E-Buddy</h1>
          <p>Your ultimate companion for learning and career growth. Explore courses, get career guidance, and build your future with us.</p>
        </div>
      </div>

      {/* Carousel Section */}
  <div className="carousel-section">
    <div className="carousel">
      <div
        className="carousel-inner"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        <div className="carousel-item">
          <img src="/carousel_images/car_image1.jpg" alt="Slide 1" />
        </div>
        <div className="carousel-item">
          <img src="/carousel_images/car_image2.jpg" alt="Slide 2" />
        </div>
        <div className="carousel-item">
          <img src="/carousel_images/car_image3.jpg" alt="Slide 3" />
        </div>
      </div>
      <button className="carousel-control prev" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="carousel-control next" onClick={nextSlide}>
        &#10095;
      </button>
      </div>
    </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="outer-rectangle">
          <h2 className="section-header">Features</h2>
          <div className="features-mini-grid">
            <div className="feature-card feature-1">
              <h3>Interactive Learning</h3>
              <p>Engage with interactive courses designed to make learning fun and effective.</p>
            </div>
            <div className="feature-card feature-2">
              <h3>Personalized Career Guidance</h3>
              <p>Get tailored advice to help you choose the right career path.</p>
            </div>
            <div className="feature-card feature-3">
              <h3>Chatbot Aided</h3>
              <p>Get instant help and guidance from our AI-powered chatbot.</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Sections */}
      <div className="about-sections">
        <div className="outer-rectangle">
          <h2 className="section-header">Abouts</h2>
          <div className="about-grid">
            <div className="about-card about-1">
              <h2>About Learning Path</h2>
              <p>Our Learning Path feature helps you navigate through courses in a structured manner. Whether you're a beginner or an advanced learner, we have a path for you.</p>
            </div>
            <div className="about-card about-2">
              <h2>About Career Guidance</h2>
              <p>Not sure which career to pursue? Our Career Guidance feature provides personalized recommendations based on your skills, interests, and goals.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Chatbot />
      </>
      } />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        </div>
    </Router>
  );
};

export default App;