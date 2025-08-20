import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGraduationCap, 
  FaRoute, 
  FaClock, 
  FaHistory, 
  FaLightbulb,
  FaRocket,
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaDownload,
  FaShare
} from 'react-icons/fa';
import '../styles/learning-common.css';
import Chatbot from "../components/Chatbot";

const LearningPath = () => {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [activeSection, setActiveSection] = useState('generate');
  const [animatedResponse, setAnimatedResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();

  const levels = [
    { value: "Beginner", label: "Beginner", icon: "🌱", description: "New to the topic" },
    { value: "Intermediate", label: "Intermediate", icon: "🚀", description: "Some experience" },
    { value: "Advanced", label: "Advanced", icon: "🎯", description: "Deep knowledge" }
  ];

  const steps = [
    { title: "Define Topic", description: "What do you want to learn?" },
    { title: "Choose Level", description: "Select your experience level" },
    { title: "Set Duration", description: "How much time do you have?" },
    { title: "Generate Path", description: "AI creates your roadmap" }
  ];

  // Clean response text by removing ** symbols and formatting
  const cleanResponseText = (text) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '');
  };

  // Typing effect for response
  useEffect(() => {
    if (response) {
      setAnimatedResponse("");
      const cleanedResponse = cleanResponseText(response);
      let i = 0;
      const typingEffect = setInterval(() => {
        if (i < cleanedResponse.length) {
          setAnimatedResponse((prev) => prev + cleanedResponse.charAt(i));
          i++;
        } else {
          clearInterval(typingEffect);
          setAnimatedResponse(cleanedResponse);
        }
      }, 10);

      return () => clearInterval(typingEffect);
    }
  }, [response]);

  // Pre-fill from query params when navigated from LearningActivity
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qpTopic = params.get('topic');
    const qpLevel = params.get('level');
    const qpDuration = params.get('duration');
    if (qpTopic) setTopic(qpTopic);
    if (qpLevel) setLevel(qpLevel);
    if (qpDuration) setDuration(qpDuration);
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setActiveSection('generate');
    setSelectedHistoryItem(null);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("❌ Error: No authentication token found");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/ai/learning-path`,
        { topic, level, duration },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setResponse(data.response);
      setTopic("");
      setDuration("");
    } catch (error) {
      console.error("❌ Error fetching learning path:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("❌ Error: No authentication token found");
      return;
    }

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/ai/learning-path/history`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setHistory(data);
      setActiveSection('history');
      setSelectedHistoryItem(null);
    } catch (error) {
      console.error("❌ Error fetching history:", error);
    }
  };

  const handleHistoryItemClick = (item) => {
    setSelectedHistoryItem(item);
  };

  const handleInputChange = (field, value) => {
    if (field === 'topic') setTopic(value);
    if (field === 'level') setLevel(value);
    if (field === 'duration') setDuration(value);
    
    // Update current step based on input
    if (topic && level && duration) {
      setCurrentStep(3);
    } else if (topic && level) {
      setCurrentStep(2);
    } else if (topic) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  };

  return (
    <div className="learning-page-container">
      <div className="learning-page-wrapper">
        {/* Header Section */}
        <div className="learning-header">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaGraduationCap style={{ marginRight: '20px', fontSize: '3rem' }} />
            Learning Path Generator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Create personalized learning journeys with AI-powered guidance
          </motion.p>
        </div>

        {/* Progress Steps */}
        <div style={{ padding: '20px', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '800px', margin: '0 auto' }}>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  position: 'relative'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: index <= currentStep ? 'var(--primary-blue)' : 'var(--gray-300)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {index < currentStep ? <FaCheckCircle /> : index + 1}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '2px' }}>
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '-50%',
                      width: '100%',
                      height: '2px',
                      background: index < currentStep ? 'var(--primary-blue)' : 'var(--gray-300)',
                      zIndex: -1
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="learning-content">
          {/* Left Sidebar */}
          <div className="learning-sidebar">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: 'var(--gray-800)' }}>
                <FaRoute style={{ marginRight: '10px', color: 'var(--primary-blue)' }} />
                Generate Your Path
              </h2>
              
              <form onSubmit={handleSubmit} className="learning-form">
                <div className="form-group">
                  <label>What do you want to learn?</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Machine Learning, Web Development, Data Science"
                    value={topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>What's your experience level?</label>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {levels.map((levelOption) => (
                      <motion.div
                        key={levelOption.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          padding: '12px',
                          border: `2px solid ${level === levelOption.value ? 'var(--primary-blue)' : 'var(--gray-200)'}`,
                          borderRadius: 'var(--radius-lg)',
                          background: level === levelOption.value ? 'rgba(37, 99, 235, 0.05)' : 'var(--white)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => handleInputChange('level', levelOption.value)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '1.5rem' }}>{levelOption.icon}</span>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                              {levelOption.label}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                              {levelOption.description}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>How much time do you have?</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., 2 weeks, 3 months, 100 hours"
                    value={duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || !topic || !duration}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ marginTop: '20px' }}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner" style={{ width: '20px', height: '20px', margin: '0' }}></div>
                      Generating Path...
                    </>
                  ) : (
                    <>
                      <FaRocket style={{ marginRight: '8px' }} />
                      Generate Learning Path
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={fetchHistory}
                  className="btn btn-outline"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaHistory style={{ marginRight: '8px' }} />
                  View History
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Right Main Content */}
          <div className="learning-main">
            <AnimatePresence mode="wait">
              {activeSection === 'generate' && (
                <motion.div
                  key="generate"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="response-content"
                >
                  {isLoading ? (
                    <div className="loading-container">
                      <div className="spinner"></div>
                      <div className="loading-text">Creating your personalized learning path...</div>
                      <div style={{ marginTop: '20px', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                        This may take a few moments
                      </div>
                    </div>
                  ) : response ? (
                    <div className="response-box">
                      <div className="response-title">
                        <FaLightbulb style={{ marginRight: '10px', color: 'var(--accent-orange)' }} />
                        Your Learning Path
                      </div>
                      <div className="response-text">
                        {animatedResponse}
                      </div>
                      
                      {/* Action Buttons */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        marginTop: '24px', 
                        flexWrap: 'wrap' 
                      }}>
                        <motion.button
                          className="btn btn-success"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaPlay style={{ marginRight: '8px' }} />
                          Start Learning
                        </motion.button>
                        
                        <motion.button
                          className="btn btn-outline"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaDownload style={{ marginRight: '8px' }} />
                          Save Path
                        </motion.button>
                        
                        <motion.button
                          className="btn btn-outline"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaShare style={{ marginRight: '8px' }} />
                          Share
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="placeholder-container">
                      <div className="placeholder-icon">🎯</div>
                      <div className="placeholder-text">Ready to create your learning path?</div>
                      <div className="placeholder-subtext">
                        Fill out the form on the left to get started
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeSection === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="response-content"
                >
                  <div className="response-box">
                    <div className="response-title">
                      <FaHistory style={{ marginRight: '10px', color: 'var(--secondary-purple)' }} />
                      Learning History
                    </div>
                    
                    {selectedHistoryItem ? (
                      <div>
                        <motion.button
                          className="btn btn-outline"
                          onClick={() => setSelectedHistoryItem(null)}
                          style={{ marginBottom: '20px' }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          ← Back to History
                        </motion.button>
                        
                        <div className="card">
                          <div className="card-header">
                            <div>
                              <div className="card-title">{selectedHistoryItem.topic}</div>
                              <div className="card-subtitle">
                                {selectedHistoryItem.level} • {selectedHistoryItem.duration}
                              </div>
                            </div>
                            <div className="badge badge-info">Completed</div>
                          </div>
                          
                          <div className="response-text">
                            {cleanResponseText(selectedHistoryItem.responseText)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {history.length > 0 ? (
                          <div style={{ display: 'grid', gap: '16px' }}>
                            {history.map((entry, index) => (
                              <motion.div
                                key={index}
                                className="card"
                                onClick={() => handleHistoryItemClick(entry)}
                                style={{ cursor: 'pointer' }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="card-header">
                                  <div>
                                    <div className="card-title">{entry.topic}</div>
                                    <div className="card-subtitle">
                                      {entry.level} • {entry.duration}
                                    </div>
                                  </div>
                                  <FaArrowRight style={{ color: 'var(--gray-400)' }} />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="placeholder-container">
                            <div className="placeholder-icon">📚</div>
                            <div className="placeholder-text">No learning history yet</div>
                            <div className="placeholder-subtext">
                              Generate your first learning path to see it here
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default LearningPath;