import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBookOpen, 
  FaLightbulb, 
  FaDownload, 
  FaShare, 
  FaPlay,
  FaGraduationCap,
  FaRocket,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaCrosshairs,
  FaQuestionCircle,
  FaList,
  FaFileAlt
} from 'react-icons/fa';
import '../styles/learning-common.css';
import Chatbot from "../components/Chatbot";

// Define PdfDocument outside StudyMaterials to avoid redefinition issues
const PdfDocument = ({ response, materialType, topic }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>
        {`${materialType.charAt(0).toUpperCase() + materialType.slice(1)}: ${topic}`}
      </Text>
      <Text style={styles.content}>{response}</Text>
    </Page>
  </Document>
);

// PDF Styles - defined outside as well for consistency
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', lineHeight: 1.5 },
  title: { fontSize: 18, marginBottom: 20, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  content: { fontSize: 12, whiteSpace: 'pre-wrap' }
});

const StudyMaterials = () => {
  const [topic, setTopic] = useState('');
  const [materialType, setMaterialType] = useState('summarize');
  const [response, setResponse] = useState('');
  const [animatedResponse, setAnimatedResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [additionalOptions, setAdditionalOptions] = useState({ 
    bullets: 5, 
    count: 5, 
    questions: 5 
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Clean response text by removing ** symbols and ensuring no trimming
  const cleanResponseText = (text) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '');
  };

  // Typing effect for response with full text preservation
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

  // Auto-generate when navigated with topic/type params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qpTopic = params.get('topic');
    const qpType = params.get('type');
    const auto = params.get('auto');
    if (qpTopic) setTopic(qpTopic);
    if (qpType) setMaterialType(qpType);
    if (auto === '1' && qpTopic) {
      // trigger generation silently
      (async () => {
        try {
          setIsLoading(true);
          const token = localStorage.getItem('token');
          if (!token) return;
          const endpoint = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/ai/${qpType || 'summarize'}`;
          const { data } = await axios.post(endpoint, { topic: qpTopic, bullets: 8 }, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
          });
          setResponse(data.summary || data.flashcards || data.quiz || data.response);
        } catch (e) {
          // ignore auto errors; UI will show if manual try
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [location.search]);

  const generateMaterial = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login first');
      }

              const endpoint = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/ai/${materialType}`;
      const requestData = { 
        topic,
        bullets: materialType === 'summarize' ? additionalOptions.bullets : undefined,
        count: materialType === 'flashcards' ? additionalOptions.count : undefined,
        questions: materialType === 'quiz' ? additionalOptions.questions : undefined
      };

      const { data } = await axios.post(endpoint, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setResponse(data.summary || data.flashcards || data.quiz || data.response);
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(error.response?.data?.error || error.message || 'Failed to generate content');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (e) => {
    setAdditionalOptions({
      ...additionalOptions,
      [e.target.name]: parseInt(e.target.value) || 1
    });
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
            <FaBookOpen style={{ marginRight: '20px', fontSize: '3rem' }} />
            Study Material Generator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Create comprehensive study materials with AI-powered assistance
          </motion.p>
        </div>

        {/* Content Section */}
        <div className="learning-content">
          <div className="learning-sidebar">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: 'var(--gray-800)' }}>
                <FaLightbulb style={{ marginRight: '10px', color: 'var(--primary-blue)' }} />
                Generate Materials
              </h2>
                      <form onSubmit={generateMaterial} className="learning-form">
              <div className="form-group">
                <label>What topic do you want to study?</label>
                <input
                  type="text"
                  className="form-input"
                  value={topic}
                  onChange={(e) => { setTopic(e.target.value); setError(''); }}
                  placeholder="e.g., Quantum Physics, Machine Learning, Web Development"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label>Type of Material</label>
                <select
                  className="form-select"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="summarize">📝 Summarized Notes</option>
                  <option value="flashcards">🃏 Flashcards</option>
                  <option value="quiz">❓ MCQs and Answers</option>
                </select>
              </div>

              {materialType === 'summarize' && (
                <div className="form-group">
                  <label>Number of Bullet Points</label>
                  <input
                    type="number"
                    className="form-input"
                    name="bullets"
                    min="1"
                    max="20"
                    value={additionalOptions.bullets}
                    onChange={handleOptionChange}
                    disabled={isLoading}
                    placeholder="How many key points?"
                  />
                </div>
              )}

              {materialType === 'flashcards' && (
                <div className="form-group">
                  <label>Number of Flashcards</label>
                  <input
                    type="number"
                    className="form-input"
                    name="count"
                    min="1"
                    max="20"
                    value={additionalOptions.count}
                    onChange={handleOptionChange}
                    disabled={isLoading}
                    placeholder="How many cards?"
                  />
                </div>
              )}

              {materialType === 'quiz' && (
                <div className="form-group">
                  <label>Number of Questions</label>
                  <input
                    type="number"
                    className="form-input"
                    name="questions"
                    min="1"
                    max="20"
                    value={additionalOptions.questions}
                    onChange={handleOptionChange}
                    disabled={isLoading}
                    placeholder="How many questions?"
                  />
                </div>
              )}

              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ marginTop: '20px' }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px', margin: '0' }}></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FaRocket style={{ marginRight: '8px' }} />
                    Generate Material
                  </>
                )}
              </motion.button>
            </form>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ 
                  marginTop: '20px', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid var(--accent-red)',
                  color: 'var(--accent-red)'
                }}
              >
                <FaExclamationTriangle style={{ marginRight: '8px' }} />
                {error}
              </motion.div>
            )}
            </motion.div>
          </div>

          <div className="learning-main">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="response-content">
                {isLoading ? (
                  <div className="loading-container">
                    <div className="spinner"></div>
                    <div className="loading-text">Generating your study material...</div>
                  </div>
                ) : response ? (
                  <div className="response-box">
                    <div className="response-title">
                      <FaLightbulb style={{ marginRight: '10px', color: 'var(--accent-orange)' }} />
                      Generated {materialType === 'quiz' ? 'Quiz' : 
                               materialType === 'flashcards' ? 'Flashcards' : 'Summary'}
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
                        Start Studying
                      </motion.button>
                      
                      <PDFDownloadLink
                        document={<PdfDocument response={response} materialType={materialType} topic={topic} />}
                        fileName={`${topic}-${materialType}.pdf`}
                      >
                        {({ loading: pdfLoading }) => (
                          <motion.button
                            className="btn btn-outline"
                            disabled={pdfLoading || isLoading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaDownload style={{ marginRight: '8px' }} />
                            {pdfLoading ? 'Creating PDF...' : 'Download PDF'}
                          </motion.button>
                        )}
                      </PDFDownloadLink>
                      
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
                    <div className="placeholder-icon">📚</div>
                    <div className="placeholder-text">Ready to generate study materials?</div>
                    <div className="placeholder-subtext">
                      Fill out the form on the left to get started
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default StudyMaterials;