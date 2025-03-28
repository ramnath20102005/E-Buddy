import React, { useState } from "react";
import axios from "axios";
import Chatbot from "../components/Chatbot";

const LearningPath = () => {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Easy");
  const [duration, setDuration] = useState("");
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
      setShowHistory(true);
    } catch (error) {
      console.error("❌ Error fetching history:", error);
    }
  };

  return (
    <div className="learning-path-container">
      <div className="content">
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
          <button type="submit">Generate</button>
        </form>

        {response && (
          <div className="response-box">
            <h3>Generated Learning Path:</h3>
            <p>{response}</p>
          </div>
        )}

        <button onClick={fetchHistory} className="history-btn">
          Search History
        </button>

        {showHistory && (
          <div className="history-section">
            <h3>Past Learning Path Requests:</h3>
            <ul className="history-list">
              {history.map((entry, index) => (
                <li key={index} className="history-item">
                  <strong>Topic:</strong> {entry.topic} <br />
                  <strong>Level:</strong> {entry.level} <br />
                  <strong>Duration:</strong> {entry.duration} <br />
                  <strong>Generated Path:</strong> {entry.responseText}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Chatbot />
      </div>
    </div>
  );
};

export default LearningPath;
