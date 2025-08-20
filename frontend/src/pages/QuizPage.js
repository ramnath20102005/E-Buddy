import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaQuestionCircle, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaTrophy,
  FaRocket,
  FaArrowLeft,
  FaArrowRight,
  FaPlay,
  FaGraduationCap,
  FaLightbulb,
  FaCrosshairs,
  FaChartLine,
  FaExclamationTriangle
} from 'react-icons/fa';
import '../styles/learning-common.css';
import Chatbot from "../components/Chatbot";

const QuizPage = () => {
  const [topic, setTopic] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5); // Default to 5 questions
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    // Validate inputs
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }
    
    if (numberOfQuestions < 1 || numberOfQuestions > 10) {
      setError("Number of questions must be between 1 and 10");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
              const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/quiz`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          topic,
          numberOfQuestions // Send the number of questions to the backend
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch questions");
      }
      
      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions generated");
      }
      
      // Limit questions to user-specified number
      const limitedQuestions = data.questions.slice(0, numberOfQuestions);
      setQuestions(limitedQuestions);
      
      // Set timer: 1.5 minutes per question
      setTimeRemaining(limitedQuestions.length * 90);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      if (err.message.includes("401")) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (questions.length > 0 && timeRemaining > 0 && score === null) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [questions, timeRemaining, score]);

  const handleAnswer = (qIndex, answer) => {
    setUserAnswers((prev) => ({ ...prev, [qIndex]: answer }));
    
    // Auto-move to next question if all answered
    if (qIndex < questions.length - 1) {
      setCurrentQuestion(qIndex + 1);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    setError(null);
    
    try {
              const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/quiz/submit`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          userAnswers, 
          topic,
          numberOfQuestions // Send number of questions to backend
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit quiz");
      }
  
      // Ensure score is non-negative and not greater than total questions
      const calculatedScore = Math.max(0, Math.min(data.score, questions.length));
      setScore(calculatedScore);
      
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
      
      if (err.message.includes("401") || err.message.includes("token")) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const resetQuiz = () => {
    setQuestions([]);
    setUserAnswers({});
    setScore(null);
    setCurrentQuestion(0);
    setTopic("");
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
            <FaQuestionCircle style={{ marginRight: '20px', fontSize: '3rem' }} />
            Quiz Generator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Test your knowledge with AI-generated quizzes
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
                <FaCrosshairs style={{ marginRight: '10px', color: 'var(--primary-blue)' }} />
                Quiz Setup
              </h2>
      
                    <div className="learning-form">
                <div className="form-group">
                  <label>What topic do you want to quiz on?</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Machine Learning, Web Development, History"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Number of Questions</label>
                  <select
                    className="form-select"
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>
                        {num} Questions
                      </option>
                    ))}
                  </select>
                </div>

                <motion.button 
                  onClick={fetchQuestions} 
                  disabled={loading}
                  className="btn btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ marginTop: '20px' }}
                >
                  {loading ? (
                    <>
                      <div className="spinner" style={{ width: '20px', height: '20px', margin: '0' }}></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaRocket style={{ marginRight: '8px' }} />
                      Generate Quiz
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div className="learning-main">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >

                    {questions.length === 0 && (
                <div className="placeholder-container">
                  <div className="placeholder-icon">❓</div>
                  <div className="placeholder-text">Ready to test your knowledge?</div>
                  <div className="placeholder-subtext">
                    Fill out the form on the left to generate a quiz
                  </div>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid var(--accent-red)',
                    color: 'var(--accent-red)'
                  }}
                >
                  <FaExclamationTriangle style={{ marginRight: '8px' }} />
                  {error}
                </motion.div>
              )}

              {/* Questions Display */}
              {questions.length > 0 && score === null && (
        <motion.div 
          className="quiz-active"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
                <div className="card" style={{ marginBottom: '24px' }}>
                  {/* Timer */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaClock style={{ color: 'var(--accent-orange)' }} />
                      <span style={{ fontWeight: '600' }}>Time Remaining:</span>
                    </div>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '800', 
                      color: 'var(--accent-orange)',
                      fontFamily: 'monospace'
                    }}>
                      {formatTime(timeRemaining)}
                    </div>
                  </div>

                  {/* Question Navigation */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {questions.map((_, index) => (
                      <motion.div 
                        key={index} 
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: currentQuestion === index 
                            ? 'var(--primary-blue)' 
                            : userAnswers[index] 
                              ? 'var(--accent-green)' 
                              : 'var(--gray-300)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => setCurrentQuestion(index)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Current Question */}
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentQuestion}
                    className="card"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="card-header">
                      <div className="card-title">
                        Question {currentQuestion + 1} of {questions.length}
                      </div>
                      <div className="badge badge-info">
                        {userAnswers[currentQuestion] ? 'Answered' : 'Unanswered'}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '600', 
                        color: 'var(--gray-800)',
                        lineHeight: '1.6',
                        marginBottom: '20px'
                      }}>
                        {questions[currentQuestion].question}
                      </h3>
                      
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {questions[currentQuestion].options.map((option, i) => (
                          <motion.button 
                            key={i} 
                            onClick={() => handleAnswer(currentQuestion, option)}
                            style={{
                              padding: '16px',
                              border: `2px solid ${userAnswers[currentQuestion] === option ? 'var(--primary-blue)' : 'var(--gray-200)'}`,
                              borderRadius: 'var(--radius-lg)',
                              background: userAnswers[currentQuestion] === option ? 'rgba(37, 99, 235, 0.05)' : 'var(--white)',
                              color: 'var(--gray-800)',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              fontSize: '1rem',
                              lineHeight: '1.5'
                            }}
                            whileHover={{ 
                              scale: 1.02, 
                              borderColor: 'var(--primary-blue)',
                              background: 'rgba(37, 99, 235, 0.05)'
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

          {/* Quiz Control Buttons */}
          <div className="quiz-controls">
                  <motion.button 
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="btn btn-outline"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaArrowLeft style={{ marginRight: '8px' }} />
                    Previous
                  </motion.button>
            <motion.button 
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === questions.length - 1}
              className="btn btn-outline"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next
              <FaArrowRight style={{ marginLeft: '8px' }} />
            </motion.button>
                  <motion.button 
                    onClick={submitQuiz} 
                    disabled={loading || Object.keys(userAnswers).length !== questions.length}
                    className="btn btn-success"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <div className="spinner" style={{ width: '20px', height: '20px', margin: '0' }}></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle style={{ marginRight: '8px' }} />
                        Submit Quiz
                      </>
                    )}
                  </motion.button>
          </div>
        </motion.div>
      )}

                    {/* Score Display */}
              {score !== null && (
                <motion.div 
                  className="card"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20 
                  }}
                  style={{ textAlign: 'center' }}
                >
                  <div className="card-header" style={{ justifyContent: 'center' }}>
                    <div className="card-title">
                      <FaTrophy style={{ marginRight: '10px', color: 'var(--accent-orange)' }} />
                      Quiz Performance
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '24px',
                    marginBottom: '32px'
                  }}>
                    <div>
                      <div style={{ 
                        fontSize: '3rem', 
                        fontWeight: '800', 
                        color: 'var(--accent-green)',
                        marginBottom: '8px'
                      }}>
                        {score}
                      </div>
                      <div style={{ color: 'var(--gray-600)', fontWeight: '500' }}>
                        Correct Answers
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ 
                        fontSize: '3rem', 
                        fontWeight: '800', 
                        color: 'var(--accent-red)',
                        marginBottom: '8px'
                      }}>
                        {questions.length - score}
                      </div>
                      <div style={{ color: 'var(--gray-600)', fontWeight: '500' }}>
                        Incorrect Answers
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ 
                        fontSize: '3rem', 
                        fontWeight: '800', 
                        color: 'var(--primary-blue)',
                        marginBottom: '8px'
                      }}>
                        {((score / questions.length) * 100).toFixed(1)}%
                      </div>
                      <div style={{ color: 'var(--gray-600)', fontWeight: '500' }}>
                        Total Score
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <motion.button 
                      onClick={() => navigate('/learning-path')} 
                      className="btn btn-outline"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaArrowLeft style={{ marginRight: '8px' }} />
                      Back to Learning Path
                    </motion.button>
                    
                    <motion.button 
                      onClick={resetQuiz} 
                      className="btn btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaRocket style={{ marginRight: '8px' }} />
                      Retake Quiz
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default QuizPage;