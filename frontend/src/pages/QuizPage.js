import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import '../QuizPage.css';

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
      const response = await fetch("http://localhost:5000/api/quiz", {
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
      const response = await fetch("http://localhost:5000/api/quiz/submit", {
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
    <motion.div 
      className="quiz-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Quiz Generator</h2>
      
      {/* Quiz Setup */}
      {questions.length === 0 && (
        <motion.div 
          className="quiz-controls"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="text"
            placeholder="Enter quiz topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="quiz-input"
          />
          <select
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
            className="quiz-input"
            style={{ marginRight: '10px' }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>
                {num} Questions
              </option>
            ))}
          </select>
          <button 
            onClick={fetchQuestions} 
            disabled={loading}
            className="quiz-button"
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
        </motion.div>
      )}

      {error && <div className="quiz-error">{error}</div>}

      {/* Questions Display */}
      {questions.length > 0 && score === null && (
        <motion.div 
          className="quiz-active"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Timer */}
          <div className="quiz-timer">
            Time Remaining: {formatTime(timeRemaining)}
          </div>

          {/* Question Navigation */}
          <div className="question-navigation">
            {questions.map((_, index) => (
              <div 
                key={index} 
                className={`nav-dot ${currentQuestion === index ? 'active' : userAnswers[index] ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              />
            ))}
          </div>

          {/* Current Question */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQuestion}
              className="question-card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Question {currentQuestion + 1}: {questions[currentQuestion].question}</h3>
              <div className="options-container">
                {questions[currentQuestion].options.map((option, i) => (
                  <motion.button 
                    key={i} 
                    onClick={() => handleAnswer(currentQuestion, option)}
                    className={`option-button ${
                      userAnswers[currentQuestion] === option ? "selected" : ""
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quiz Control Buttons */}
          <div className="quiz-controls">
            <button 
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="nav-button"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === questions.length - 1}
              className="nav-button"
            >
              Next
            </button>
            <button 
              onClick={submitQuiz} 
              disabled={loading || Object.keys(userAnswers).length !== questions.length}
              className="submit-button"
            >
              {loading ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Score Display */}
      {score !== null && (
        <motion.div 
          className="score-container"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
        >
          <h3>Quiz Performance</h3>
          <div className="score-details">
            <p>
              <span style={{display: 'block', fontSize: '2rem', color: '#2ecc71'}}>
                {score}
              </span>
              Correct Answers
            </p>
            <p>
              <span style={{display: 'block', fontSize: '2rem', color: '#d32f2f'}}>
                {questions.length - score}
              </span>
              Incorrect Answers
            </p>
            <p>
              <span style={{display: 'block', fontSize: '2rem', color: '#4a6fa5'}}>
                {((score / questions.length) * 100).toFixed(1)}%
              </span>
              Total Score
            </p>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}>
            <button 
              onClick={() => navigate('/learning-path')} 
              className="quiz-button"
            >
              Back to Learning Path
            </button>
            <button 
              onClick={resetQuiz} 
              className="quiz-button"
              style={{background: '#4a3075'}} // Secondary color
            >
              Retake Quiz
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizPage;