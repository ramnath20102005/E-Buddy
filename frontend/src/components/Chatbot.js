import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-icon" onClick={toggleChatbot}>
        <img src="chatbot-icon.png" alt="Chatbot" />
      </div>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>E-Buddy Chatbot</h3> {/* Updated to E-Buddy */}
            <button onClick={toggleChatbot}>×</button>
          </div>
          <div className="chatbot-body">
            <p>Hello! How can I assist you today?</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;