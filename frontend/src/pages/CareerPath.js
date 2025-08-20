import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBriefcase, 
  FaRoute, 
  FaHistory, 
  FaRocket, 
  FaLightbulb, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaClock, 
  FaCrosshairs, 
  FaChartLine, 
  FaUserTie, 
  FaGraduationCap,
  FaPlay,
  FaDownload,
  FaShare,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';
import '../styles/learning-common.css';
import Chatbot from "../components/Chatbot";

const CareerPath = () => {
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [activeSection, setActiveSection] = useState('generate');
  const [animatedResponse, setAnimatedResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Enhanced response formatting
  const formatResponse = (text) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '')
               .replace(/#/g, '')
               .replace(/- /g, '• ');
  };

  // Typing effect for response
  useEffect(() => {
    if (response) {
      setAnimatedResponse("");
      const formattedResponse = formatResponse(response);
      let i = 0;
      const typingEffect = setInterval(() => {
        if (i < formattedResponse.length) {
          setAnimatedResponse((prev) => prev + formattedResponse.charAt(i));
          i++;
        } else {
          clearInterval(typingEffect);
          setAnimatedResponse(formattedResponse);
        }
      }, 10);

      return () => clearInterval(typingEffect);
    }
  }, [response]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setActiveSection('generate');
    setSelectedHistoryItem(null);
    setCurrentStep(2);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("❌ Error: No authentication token found");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/career/generate`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setResponse(data.response);
      setCurrentStep(3);
    } catch (error) {
      console.error("❌ Error fetching career path:", error);
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
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/career/history`,
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

  const steps = [
    { id: 1, title: 'Generate', description: 'Create your career path', icon: FaRocket },
    { id: 2, title: 'Processing', description: 'AI analyzing your profile', icon: FaLightbulb },
    { id: 3, title: 'Complete', description: 'Your path is ready', icon: FaCheckCircle }
  ];

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
            <FaBriefcase style={{ marginRight: '20px', fontSize: '3rem' }} />
            Career Path Generator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover your ideal career path with AI-powered guidance and personalized insights
          </motion.p>
        </div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="progress-steps"
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`step-item ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
            >
              <div className="step-icon">
                <step.icon />
              </div>
              <div className="step-content">
                <div className="step-title">{step.title}</div>
                <div className="step-description">{step.description}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Content Section */}
        <div className="learning-content">
          <div className="learning-sidebar">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: 'var(--gray-800)' }}>
                <FaUserTie style={{ marginRight: '10px', color: 'var(--primary-blue)' }} />
                Career Guidance
              </h2>
              
              <div className="career-actions">
                <motion.button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="btn btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ marginBottom: '16px', width: '100%' }}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner" style={{ width: '20px', height: '20px', margin: '0' }}></div>
                      Generating Career Path...
                    </>
                  ) : (
                    <>
                      <FaRocket style={{ marginRight: '8px' }} />
                      Generate Career Path
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={fetchHistory}
                  className="btn btn-outline"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: '100%' }}
                >
                  <FaHistory style={{ marginRight: '8px' }} />
                  View History
                </motion.button>
              </div>

              {/* Career Tips */}
              <div className="career-tips" style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: 'var(--gray-700)' }}>
                  <FaLightbulb style={{ marginRight: '8px', color: 'var(--accent-orange)' }} />
                  Career Tips
                </h3>
                <div className="tip-item">
                  <FaCheckCircle style={{ color: 'var(--accent-green)', marginRight: '8px' }} />
                  <span>Consider your skills and interests</span>
                </div>
                <div className="tip-item">
                  <FaCheckCircle style={{ color: 'var(--accent-green)', marginRight: '8px' }} />
                  <span>Research market demand</span>
                </div>
                <div className="tip-item">
                  <FaCheckCircle style={{ color: 'var(--accent-green)', marginRight: '8px' }} />
                  <span>Plan for continuous learning</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="learning-main">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {activeSection === 'generate' && (
                <div className="response-content">
                  {isLoading ? (
                    <div className="loading-container">
                      <div className="spinner"></div>
                      <div className="loading-text">Analyzing your profile and generating career insights...</div>
                    </div>
                  ) : response ? (
                    <div className="response-box">
                      <div className="response-title">
                        <FaRoute style={{ marginRight: '10px', color: 'var(--accent-orange)' }} />
                        Your Personalized Career Path
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
                          Start Journey
                        </motion.button>
                        
                        <motion.button
                          className="btn btn-outline"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaDownload style={{ marginRight: '8px' }} />
                          Download PDF
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
                      <div className="placeholder-icon">🚀</div>
                      <div className="placeholder-text">Ready to discover your career path?</div>
                      <div className="placeholder-subtext">
                        Click "Generate Career Path" to get started with AI-powered career guidance
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'history' && (
                <div className="history-content">
                  <div className="history-header">
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px', color: 'var(--gray-800)' }}>
                      <FaHistory style={{ marginRight: '10px', color: 'var(--primary-blue)' }} />
                      Career Path History
                    </h3>
                    <motion.button
                      onClick={() => setActiveSection('generate')}
                      className="btn btn-outline"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaArrowLeft style={{ marginRight: '8px' }} />
                      Back to Generator
                    </motion.button>
                  </div>

                  {selectedHistoryItem ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="history-detail-view"
                    >
                      <div className="card">
                        <div className="card-header">
                          <div className="card-title">Career Path Details</div>
                          <motion.button
                            onClick={() => setSelectedHistoryItem(null)}
                            className="btn btn-outline"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaArrowLeft style={{ marginRight: '8px' }} />
                            Back to List
                          </motion.button>
                        </div>
                        
                        <div className="history-details">
                          <div className="detail-item">
                            <strong>Skills:</strong> {selectedHistoryItem.skills?.join(", ") || "Not specified"}
                          </div>
                          <div className="detail-item">
                            <strong>Interests:</strong> {selectedHistoryItem.interests?.join(", ") || "Not specified"}
                          </div>
                          <div className="detail-item">
                            <strong>Achievements:</strong> {selectedHistoryItem.achievements?.join(", ") || "None"}
                          </div>
                        </div>
                        
                        <div className="history-response">
                          <h4>Generated Career Path:</h4>
                          <pre>{formatResponse(selectedHistoryItem.responseText || "No data available")}</pre>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="history-list">
                      {history.length > 0 ? (
                        <AnimatePresence>
                          {history.map((entry, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="history-item"
                              onClick={() => handleHistoryItemClick(entry)}
                            >
                              <div className="history-item-content">
                                <div className="history-item-summary">
                                  {entry.skills?.slice(0, 3).join(", ") || "No skills specified"}...
                                </div>
                                <div className="history-item-date">
                                  <FaClock style={{ marginRight: '4px', fontSize: '0.75rem' }} />
                                  {new Date(entry.createdAt || Date.now()).toLocaleDateString()}
                                </div>
                              </div>
                              <FaArrowRight style={{ color: 'var(--gray-400)' }} />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      ) : (
                        <div className="placeholder-container">
                          <div className="placeholder-icon">📚</div>
                          <div className="placeholder-text">No career history available</div>
                          <div className="placeholder-subtext">
                            Generate your first career path to see it here
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default CareerPath;