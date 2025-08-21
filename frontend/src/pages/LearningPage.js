import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBook, 
  FaClock, 
  FaCheckCircle, 
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaStop,
  FaLightbulb,
  FaGraduationCap,
  FaBookOpen,
  FaChevronRight,
  FaDownload,
  FaPrint,
  FaYoutube,
  FaExternalLinkAlt,
  FaTasks
} from 'react-icons/fa';
import '../styles/learning-common.css';
import Chatbot from "../components/Chatbot";

const LearningPage = () => {
  const [learningMaterial, setLearningMaterial] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [activityId, setActivityId] = useState(null);
  const [learningData, setLearningData] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [sections, setSections] = useState([]);
  const [progress, setProgress] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  // Extract learning data from URL params or state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stateData = location.state || {};
    
    const data = {
      topic: params.get('topic') || stateData.topic || '',
      level: params.get('level') || stateData.level || 'Beginner',
      duration: params.get('duration') || stateData.duration || '30 min',
      learningPath: params.get('learningPath') || stateData.learningPath || '',
      category: params.get('category') || stateData.category || 'General Learning'
    };
    
    // Don't proceed if no valid topic
    if (!data.topic || data.topic.trim() === '') {
      setError('No topic provided. Please go back to Learning Path and select a topic.');
      setIsLoading(false);
      return;
    }
    
    setLearningData(data);
    
    // Debug logging to track topic issue
    console.log('🔍 Learning Page - Extracted data:', data);
    console.log('🔍 Learning Page - URL params:', Object.fromEntries(params));
    console.log('🔍 Learning Page - State data:', stateData);
    console.log('🔍 Learning Page - Final topic being used:', data.topic);
    
    // Always generate new detailed learning material with videos and exercises
    // The learning path from previous page is just a basic outline
    generateLearningMaterial(data);
  }, [location]);

  // Timer functionality
  useEffect(() => {
    if (isActive && startTime) {
      intervalRef.current = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, startTime]);

  // Start learning session
  const startLearning = async () => {
    const now = Date.now();
    setStartTime(now);
    setIsActive(true);
    
    // Create learning activity record
    await createLearningActivity();
  };

  // Pause learning session
  const pauseLearning = () => {
    setIsActive(false);
    if (activityId) {
      updateLearningActivity();
    }
  };

  // Complete learning session
  const completeLearning = async () => {
    setIsActive(false);
    setProgress(100);
    if (activityId) {
      await updateLearningActivity(true);
    }
    
    // Navigate back to learning activity page
    setTimeout(() => {
      navigate('/learning-activity');
    }, 2000);
  };

  // Generate learning material
  const generateLearningMaterial = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      // Debug logging for API call
      console.log('🔍 Generating learning material for topic:', data.topic);
      console.log('🔍 Full request data:', {
        topic: data.topic,
        level: data.level,
        duration: data.duration
      });
      console.log('🔍 Topic type:', typeof data.topic, 'Length:', data.topic?.length);
      console.log('🔍 Topic value:', JSON.stringify(data.topic));

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/ai/learning-material`,
        {
          topic: data.topic,
          level: data.level,
          duration: data.duration,
          format: 'detailed'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('🔍 API Response received for topic:', data.topic);
      console.log('🔍 Response data:', response.data);

      const material = response.data.response || response.data.material;
      setLearningMaterial(material);
      processMaterial(material);
    } catch (err) {
      console.error('🔴 Error generating learning material:', err);
      console.error('🔴 Error response data:', err.response?.data);
      console.error('🔴 Error status:', err.response?.status);
      setError(`Failed to generate learning material: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Process material into sections
  const processMaterial = (material) => {
    // Split material into sections based on headers or line breaks
    const lines = material.split('\n').filter(line => line.trim());
    const processedSections = [];
    let currentSection = { title: '', content: [], videos: [], resources: [], exercises: [] };
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check for video suggestions
      if (trimmedLine.startsWith('VIDEOS:')) {
        const videoTerms = trimmedLine.replace('VIDEOS:', '').split(',').map(term => term.trim());
        currentSection.videos = videoTerms;
        return;
      }
      
      // Check for external resources
      if (trimmedLine.startsWith('RESOURCES:')) {
        const resourceTerms = trimmedLine.replace('RESOURCES:', '').split(',').map(term => term.trim());
        currentSection.resources = resourceTerms;
        return;
      }
      
      // Check for exercises
      if (trimmedLine.startsWith('EXERCISE:')) {
        const exercise = trimmedLine.replace('EXERCISE:', '').trim();
        currentSection.exercises.push(exercise);
        return;
      }
      
      // Check if line is a header (starts with #, **, or is in caps)
      if (trimmedLine.match(/^#+\s/) || 
          trimmedLine.match(/^\*\*.*\*\*$/) || 
          (trimmedLine.length < 50 && trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 5)) {
        if (currentSection.content.length > 0) {
          processedSections.push(currentSection);
        }
        currentSection = { 
          title: trimmedLine.replace(/^#+\s*|\*\*/g, ''), 
          content: [],
          videos: [],
          resources: [],
          exercises: []
        };
      } else if (trimmedLine) {
        currentSection.content.push(trimmedLine);
      }
    });
    
    if (currentSection.content.length > 0) {
      processedSections.push(currentSection);
    }
    
    // If no sections found, create a single section
    if (processedSections.length === 0) {
      processedSections.push({
        title: learningData.topic || 'Learning Material',
        content: lines,
        videos: [],
        resources: [],
        exercises: []
      });
    }
    
    setSections(processedSections);
  };

  // Create learning activity record
  const createLearningActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/learning-activities`,
        {
          activityType: 'study-material',
          topic: learningData.topic,
          title: `${learningData.topic} - Study Session`,
          level: learningData.level,
          category: learningData.category,
          difficulty: learningData.level === 'Beginner' ? 'Easy' : 
                     learningData.level === 'Intermediate' ? 'Medium' : 'Hard',
          duration: learningData.duration,
          description: `Learning session for ${learningData.topic}`,
          status: 'in-progress'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setActivityId(response.data._id);
    } catch (err) {
      console.error('Error creating learning activity:', err);
    }
  };

  // Update learning activity with time spent and progress
  const updateLearningActivity = async (completed = false) => {
    if (!activityId) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const timeSpentMinutes = Math.floor(timeSpent / 60);
      const timeSpentStr = timeSpentMinutes > 0 ? `${timeSpentMinutes} min` : '< 1 min';

      await axios.patch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/learning-activities/${activityId}/progress`,
        {
          progress: completed ? 100 : Math.min(95, Math.floor((currentSection + 1) / sections.length * 100)),
          timeSpent: timeSpentStr
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (err) {
      console.error('Error updating learning activity:', err);
    }
  };

  // Navigate between sections
  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setProgress(Math.floor((currentSection + 2) / sections.length * 100));
      updateLearningActivity();
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setProgress(Math.floor((currentSection) / sections.length * 100));
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="learning-page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">Preparing your learning material...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learning-page-container">
        <div className="card" style={{ textAlign: 'center', color: 'var(--accent-red)', margin: '50px auto', maxWidth: '500px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
          <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
            Error Loading Learning Material
          </div>
          <div>{error}</div>
          <motion.button
            className="btn btn-primary"
            onClick={() => navigate('/learning-path')}
            style={{ marginTop: '20px' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Back to Learning Path
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-page-container">
      <div className="learning-page-wrapper">
        {/* Header */}
        <div className="learning-header" style={{ background: 'var(--primary-blue)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ color: 'white', marginBottom: '8px' }}
              >
                <FaBook style={{ marginRight: '15px', fontSize: '2.5rem' }} />
                {learningData.topic}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}
              >
                {learningData.level} Level • {learningData.category}
              </motion.p>
            </div>
            
            <motion.button
              className="btn"
              onClick={() => navigate('/learning-path')}
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
              whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              <FaArrowLeft style={{ marginRight: '8px' }} />
              Back
            </motion.button>
          </div>
        </div>

        {/* Progress and Controls */}
        <div style={{ padding: '20px', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Progress Bar */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Progress: Section {currentSection + 1} of {sections.length}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary-blue)' }}>
                  {progress}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: '8px' }}>
                <motion.div 
                  className="progress-fill" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                {!isActive && !startTime && (
                  <motion.button
                    className="btn btn-success"
                    onClick={startLearning}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPlay style={{ marginRight: '8px' }} />
                    Start Learning
                  </motion.button>
                )}
                
                {isActive && (
                  <motion.button
                    className="btn btn-warning"
                    onClick={pauseLearning}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPause style={{ marginRight: '8px' }} />
                    Pause
                  </motion.button>
                )}
                
                {!isActive && startTime && (
                  <motion.button
                    className="btn btn-success"
                    onClick={() => setIsActive(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPlay style={{ marginRight: '8px' }} />
                    Resume
                  </motion.button>
                )}
                
                {startTime && (
                  <motion.button
                    className="btn btn-primary"
                    onClick={completeLearning}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaCheckCircle style={{ marginRight: '8px' }} />
                    Complete
                  </motion.button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-600)' }}>
                  <FaClock />
                  <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                    {formatTime(timeSpent)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Content */}
        <div className="learning-content" style={{ padding: '20px', minHeight: 'calc(100vh - 200px)', width: '100vw', margin: '0', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', maxWidth: 'none', padding: '0 20px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="card"
                style={{ padding: '30px', width: '100%', margin: '0', minHeight: '70vh' }}
              >
                {sections[currentSection] && (
                  <>
                    <div style={{ marginBottom: '30px' }}>
                      <h2 style={{ 
                        fontSize: '2rem', 
                        fontWeight: '700', 
                        color: 'var(--gray-800)', 
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <FaLightbulb style={{ marginRight: '15px', color: 'var(--accent-orange)' }} />
                        {sections[currentSection].title}
                      </h2>
                    </div>

                    <div style={{ 
                      fontSize: '1.1rem', 
                      lineHeight: '1.8', 
                      color: 'var(--gray-700)',
                      marginBottom: '40px'
                    }}>
                      {sections[currentSection].content.map((paragraph, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          style={{ marginBottom: '20px' }}
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>

                    {/* Video Suggestions */}
                    {sections[currentSection].videos && sections[currentSection].videos.length > 0 && (
                      <div style={{ 
                        marginBottom: '30px', 
                        padding: '20px', 
                        background: 'var(--gray-50)', 
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--gray-200)'
                      }}>
                        <h3 style={{ 
                          fontSize: '1.2rem', 
                          fontWeight: '600', 
                          color: 'var(--gray-800)', 
                          marginBottom: '15px',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <FaYoutube style={{ marginRight: '10px', color: '#FF0000' }} />
                          Recommended Videos
                        </h3>
                        <div style={{ display: 'grid', gap: '10px' }}>
                          {sections[currentSection].videos.map((videoTerm, index) => (
                            <motion.a
                              key={index}
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(videoTerm)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline"
                              style={{ 
                                textAlign: 'left', 
                                justifyContent: 'flex-start',
                                padding: '12px 16px',
                                color: 'var(--gray-700)',
                                textDecoration: 'none'
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FaExternalLinkAlt style={{ marginRight: '8px', fontSize: '0.9rem' }} />
                              {videoTerm}
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* External Resources */}
                    {sections[currentSection].resources && sections[currentSection].resources.length > 0 && (
                      <div style={{ 
                        marginBottom: '30px', 
                        padding: '20px', 
                        background: 'rgba(147, 51, 234, 0.05)', 
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(147, 51, 234, 0.2)'
                      }}>
                        <h3 style={{ 
                          fontSize: '1.2rem', 
                          fontWeight: '600', 
                          color: 'var(--primary-purple)', 
                          marginBottom: '15px',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <FaExternalLinkAlt style={{ marginRight: '10px' }} />
                          External Learning Resources
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {sections[currentSection].resources.map((resource, index) => {
                            const [resourceName, description] = resource.includes(' - ') 
                              ? resource.split(' - ') 
                              : [resource, 'Additional learning resource'];
                            
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                style={{ 
                                  padding: '15px',
                                  background: 'white',
                                  borderRadius: 'var(--radius-md)',
                                  border: '1px solid var(--gray-200)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                whileHover={{ 
                                  scale: 1.02,
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                              >
                                <div style={{ 
                                  fontWeight: '600', 
                                  color: 'var(--primary-purple)', 
                                  marginBottom: '4px',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}>
                                  <FaBookOpen style={{ marginRight: '8px', fontSize: '0.9rem' }} />
                                  {resourceName.trim()}
                                </div>
                                <div style={{ 
                                  fontSize: '0.9rem', 
                                  color: 'var(--gray-600)',
                                  lineHeight: '1.4'
                                }}>
                                  {description.trim()}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Exercises */}
                    {sections[currentSection].exercises && sections[currentSection].exercises.length > 0 && (
                      <div style={{ 
                        marginBottom: '30px', 
                        padding: '20px', 
                        background: 'rgba(37, 99, 235, 0.05)', 
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(37, 99, 235, 0.2)'
                      }}>
                        <h3 style={{ 
                          fontSize: '1.2rem', 
                          fontWeight: '600', 
                          color: 'var(--primary-blue)', 
                          marginBottom: '15px',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <FaLightbulb style={{ marginRight: '10px' }} />
                          Practice Exercises
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {sections[currentSection].exercises.map((exercise, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              style={{ 
                                padding: '15px',
                                background: 'white',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--gray-200)',
                                fontSize: '1rem',
                                lineHeight: '1.6'
                              }}
                            >
                              <strong>Exercise {index + 1}:</strong> {exercise}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingTop: '30px',
                      borderTop: '1px solid var(--gray-200)'
                    }}>
                      <motion.button
                        className="btn btn-outline"
                        onClick={prevSection}
                        disabled={currentSection === 0}
                        whileHover={{ scale: currentSection === 0 ? 1 : 1.02 }}
                        whileTap={{ scale: currentSection === 0 ? 1 : 0.98 }}
                        style={{ 
                          opacity: currentSection === 0 ? 0.5 : 1,
                          cursor: currentSection === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <FaArrowLeft style={{ marginRight: '8px' }} />
                        Previous
                      </motion.button>

                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                        {currentSection + 1} of {sections.length}
                      </div>

                      {currentSection < sections.length - 1 ? (
                        <motion.button
                          className="btn btn-primary"
                          onClick={nextSection}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Next
                          <FaChevronRight style={{ marginLeft: '8px' }} />
                        </motion.button>
                      ) : (
                        <motion.button
                          className="btn btn-success"
                          onClick={completeLearning}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaCheckCircle style={{ marginRight: '8px' }} />
                          Complete Learning
                        </motion.button>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default LearningPage;
