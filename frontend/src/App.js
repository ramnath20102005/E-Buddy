import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SessionExpiryNotification from './components/SessionExpiryNotification';
import Navbar from "./components/Navbar";
import Chatbot from './components/Chatbot';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ProfileSetup from './pages/ProfileSetup';
import LearningPath from "./pages/LearningPath";
import StudyMaterials from "./pages/StudyMaterials";
import CareerPath from "./pages/CareerPath";
import Landing from './pages/Landing';
import Home from './pages/Home';
import QuizPage from './pages/QuizPage';
import LearningActivity from './pages/LearningActivity';
import LearningPage from './pages/LearningPage';
import CareerInsights from './pages/CareerInsights';
import CourseRecommendation from './pages/CourseRecommendation';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, logout } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuresRef = useRef(null);
  const carouselImages = [
    `${process.env.PUBLIC_URL}/carousel_images/learning1.jpg`,
    `${process.env.PUBLIC_URL}/carousel_images/learning2.jpg`,
    `${process.env.PUBLIC_URL}/carousel_images/learning3.jpg`
  ];



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
    <div className="app-container">
      <SessionExpiryNotification />
      <Navbar />
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
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/learning-path" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
        <Route path="/study-materials" element={<ProtectedRoute><StudyMaterials /></ProtectedRoute>} />
        <Route path="/careerpath" element={<ProtectedRoute><CareerPath /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/learning-activity" element={<ProtectedRoute><LearningActivity /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />
        <Route path="/career-insights" element={<ProtectedRoute><CareerInsights /></ProtectedRoute>} />
        <Route path="/course-recommendation" element={<ProtectedRoute><CourseRecommendation /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;