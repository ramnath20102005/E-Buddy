import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../learning-path.css';
import Chatbot from "../components/Chatbot";

const LearningPath = () => {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Easy");
  const [duration, setDuration] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [activeSection, setActiveSection] = useState('generate');
  const [animatedResponse, setAnimatedResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

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
        "http://localhost:5000/api/ai/learning-path",
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
        "http://localhost:5000/api/ai/learning-path/history",
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

  return (
    <div className="learning-path-container">
      <div className="learning-path-wrapper">
        <div className="left-section">
          <h2>Learning Path Generator</h2>
          <form onSubmit={handleSubmit} className="learning-form">
            <input
              type="text"
              placeholder="Enter topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="Easy">Easy</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Hard">Hard</option>
            </select>
            <input
              type="text"
              placeholder="Duration (e.g., 20hrs)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Path'}
            </button>
            <button 
              type="button" 
              onClick={fetchHistory} 
              className="history-button"
            >
              Search History
            </button>
          </form>
        </div>

        <div className="right-section">
          {activeSection === 'generate' && (
            <div className="response-content">
              {isLoading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Generating your learning path...</p>
                </div>
              ) : response ? (
                <div className="response-box">
                  <h3>Generated Learning Path:</h3>
                  <pre className="animated-text" style={{ whiteSpace: 'pre-wrap' }}>
                    {animatedResponse}
                  </pre>
                </div>
              ) : (
                <div className="placeholder-text">
                  Your learning path will appear here
                </div>
              )}
            </div>
          )}

          {activeSection === 'history' && (
            <div className="history-content">
              <h3>Past Learning Path Requests:</h3>
              <div className="history-scroll">
                {selectedHistoryItem ? (
                  <div className="history-detail-view">
                    <button 
                      className="back-button" 
                      onClick={() => setSelectedHistoryItem(null)}
                    >
                      ← Back to list
                    </button>
                    <div className="history-item-detail">
                      <div className="history-details">
                        <strong>Topic:</strong> {selectedHistoryItem.topic}<br />
                        <strong>Level:</strong> {selectedHistoryItem.level}<br />
                        <strong>Duration:</strong> {selectedHistoryItem.duration}
                      </div>
                      <pre className="history-response" style={{ whiteSpace: 'pre-wrap' }}>
                        {cleanResponseText(selectedHistoryItem.responseText)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  history.length > 0 ? (
                    history.map((entry, index) => (
                      <div 
                        key={index} 
                        className="history-item" 
                        onClick={() => handleHistoryItemClick(entry)}
                      >
                        <div className="history-item-topic">
                          {entry.topic} ({entry.level}, {entry.duration})
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="placeholder-text">
                      No learning path history available
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default LearningPath;