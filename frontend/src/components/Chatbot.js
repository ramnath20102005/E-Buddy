import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hello! How can I assist you today?", sender: "bot" }]);
  const [userInput, setUserInput] = useState("");

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    const updatedMessages = [...messages, { text: userInput, sender: "user" }];
    setMessages(updatedMessages);

    try {
      // 🔹 Send message to backend API
      const response = await axios.post("http://localhost:5000/api/ai/chatbot", { message: userInput });

      console.log("🔹 Chatbot Response:", response.data); // Debugging log

      // 🔹 Extract correct response key
      const botResponse = response.data.response || "⚠ No response received.";

      // 🔹 Update chat with bot response
      setMessages([...updatedMessages, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("🔴 Chatbot API Error:", error);
      setMessages([...updatedMessages, { text: "⚠ Error connecting to chatbot.", sender: "bot" }]);
    }

    setUserInput("");
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-icon" onClick={toggleChatbot}>
        <img src="chatbot-icon.png" alt="Chatbot" />
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>E-Buddy Chatbot</h3>
            <button onClick={toggleChatbot}>×</button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <p key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
                {msg.text}
              </p>
            ))}
          </div>

          <div className="chatbot-footer">
            <input
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
