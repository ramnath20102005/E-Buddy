import React, { useState } from "react";
import axios from "axios";
import Chatbot from "../components/Chatbot";

const CareerPath = () => {
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("❌ Error: No authentication token found");
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
      setShowHistory(true);
    } catch (error) {
      console.error("❌ Error fetching history:", error);
      setHistory([]);
    }
  };

  return (
    <div className="career-path-container">
      <div className="content">
        <h2>Career Path Generator</h2>
        <form onSubmit={handleSubmit} className="career-form">
          <button type="submit">Generate Career Path</button>
        </form>

        {response && (
          <div className="response-box">
            <h3>Generated Career Path:</h3>
            <p>{response}</p>
          </div>
        )}

        <button onClick={fetchHistory} className="history-btn">
          Search History
        </button>

        {showHistory && (
          <div className="history-section">
            <h3>Past Career Path Requests:</h3>
            {history.length > 0 ? (
              <ul className="history-list">
                {history.map((entry, index) => (
                  <li key={index} className="history-item">
                    <strong>Skills:</strong> {entry.skills?.join(", ") || "Not specified"} <br />
                    <strong>Interests:</strong> {entry.interests?.join(", ") || "Not specified"} <br />
                    <strong>Achievements:</strong> {entry.achievements?.join(", ") || "None"} <br />
                    <strong>Generated Path:</strong> {entry.responseText || "No data available"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No career history available.</p>
            )}
          </div>
        )}

        <Chatbot />
      </div>
    </div>
  );
};

export default CareerPath;