import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import '../study-material.css';
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
  const [history, setHistory] = useState([]);
  const [activeSection, setActiveSection] = useState('generate');
  const [animatedResponse, setAnimatedResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [additionalOptions, setAdditionalOptions] = useState({ 
    bullets: 5, 
    count: 5, 
    questions: 5 
  });
  const navigate = useNavigate();

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

  const generateMaterial = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setActiveSection('generate');
    setSelectedHistoryItem(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login first');
      }

      const endpoint = `http://localhost:5000/api/ai/${materialType}`;
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

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("❌ Error: No authentication token found");
      return;
    }

    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/ai/study-material/history",
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

  const handleOptionChange = (e) => {
    setAdditionalOptions({
      ...additionalOptions,
      [e.target.name]: parseInt(e.target.value) || 1
    });
  };

  return (
    <div className="study-material-container">
      <div className="study-material-wrapper">
        <div className="left-section">
          <h2>Study Material Generator</h2>
          <form onSubmit={generateMaterial} className="study-material-form">
            <input
              type="text"
              value={topic}
              onChange={(e) => { setTopic(e.target.value); setError(''); }}
              placeholder="Enter topic (e.g., Quantum Physics)"
              required
              disabled={isLoading}
            />
            
            <select
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              disabled={isLoading}
            >
              <option value="summarize">Summarized Notes</option>
              <option value="flashcards">Flashcards</option>
              <option value="quiz">MCQs and Answers</option>
            </select>

            {materialType === 'summarize' && (
              <input
                type="number"
                name="bullets"
                min="1"
                max="20"
                value={additionalOptions.bullets}
                onChange={handleOptionChange}
                disabled={isLoading}
                placeholder="Number of bullet points"
              />
            )}

            {materialType === 'flashcards' && (
              <input
                type="number"
                name="count"
                min="1"
                max="20"
                value={additionalOptions.count}
                onChange={handleOptionChange}
                disabled={isLoading}
                placeholder="Number of flashcards"
              />
            )}

            {materialType === 'quiz' && (
              <input
                type="number"
                name="questions"
                min="1"
                max="20"
                value={additionalOptions.questions}
                onChange={handleOptionChange}
                disabled={isLoading}
                placeholder="Number of questions"
              />
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Material'}
            </button>
            <button 
              type="button" 
              onClick={fetchHistory} 
              className="history-button"
            >
              Search History
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="right-section">
          {activeSection === 'generate' && (
            <div className="response-content">
              {response ? (
                <div className="response-box">
                  <h3>
                    Generated {materialType === 'quiz' ? 'Quiz' : 
                             materialType === 'flashcards' ? 'Flashcards' : 'Summary'}:
                  </h3>
                  <pre className="animated-text" style={{ whiteSpace: 'pre-wrap' }}>
                    {animatedResponse}
                  </pre>
                  <div style={{ marginTop: '20px' }}>
                    <PDFDownloadLink
                      document={<PdfDocument response={response} materialType={materialType} topic={topic} />}
                      fileName={`${topic}-${materialType}.pdf`}
                    >
                      {({ loading: pdfLoading }) => (
                        <button 
                          style={{
                            backgroundColor: '#2196F3',
                            color: 'white',
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          disabled={pdfLoading || isLoading}
                        >
                          {pdfLoading ? 'Creating PDF...' : '📥 Download as PDF'}
                        </button>
                      )}
                    </PDFDownloadLink>
                  </div>
                </div>
              ) : (
                <div className="placeholder-text">
                  Your study material will appear here
                </div>
              )}
            </div>
          )}

          {activeSection === 'history' && (
            <div className="history-content">
              <h3>Past Study Material Requests:</h3>
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
                        <strong>Type:</strong> {selectedHistoryItem.materialType}<br />
                        <strong>Options:</strong> {JSON.stringify(selectedHistoryItem.additionalOptions)}
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
                          {entry.topic} ({entry.materialType})
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="placeholder-text">
                      No study material history available
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

export default StudyMaterials;