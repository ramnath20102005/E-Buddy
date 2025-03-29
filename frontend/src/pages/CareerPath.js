import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../career-path.css';
import Chatbot from "../components/Chatbot";

const CareerPath = () => {
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [activeSection, setActiveSection] = useState('generate');
  const [animatedResponse, setAnimatedResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Enhanced response formatting
  const formatResponse = (text) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '')
               .replace(/#/g, '')
               .replace(/- /g, '• ');
  };

  // Typing effect for response - Fixed version
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
          setAnimatedResponse(formattedResponse); // This line ensures full text is preserved
        }
      }, 10);

      return () => clearInterval(typingEffect);
    }
  }, [response]);

  // All other functions remain exactly the same
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
        "http://localhost:5000/api/career/generate",
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setResponse(data.response);
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
        "http://localhost:5000/api/career/history",
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
    <div className="career-path-container">
      <div className="career-path-wrapper">
        <div className="left-section">
          <h2>Career Path Generator</h2>
          <form onSubmit={handleSubmit} className="career-form">
            <button 
              type="submit" 
              disabled={isLoading}
              className="generate-button"
            >
              {isLoading ? 'Generating...' : 'Generate Career Path'}
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
                  <p>Generating your career path...</p>
                </div>
              ) : response ? (
                <div className="response-box">
                  <h3>Generated Career Path:</h3>
                  <pre className="animated-text">{animatedResponse}</pre>
                </div>
              ) : (
                <div className="placeholder-text">
                  Your career path will appear here
                </div>
              )}
            </div>
          )}

          {activeSection === 'history' && (
            <div className="history-content">
              <h3>Past Career Path Requests:</h3>
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
                        <strong>Skills:</strong> {selectedHistoryItem.skills?.join(", ") || "Not specified"}<br />
                        <strong>Interests:</strong> {selectedHistoryItem.interests?.join(", ") || "Not specified"}<br />
                        <strong>Achievements:</strong> {selectedHistoryItem.achievements?.join(", ") || "None"}<br />
                      </div>
                      <pre className="history-response">
                        {formatResponse(selectedHistoryItem.responseText || "No data available")}
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
                        <div className="history-item-summary">
                          {entry.skills?.slice(0, 3).join(", ") || "No skills specified"}...
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="placeholder-text">
                      No career history available
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

export default CareerPath;