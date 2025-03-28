import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', lineHeight: 1.5 },
  title: { fontSize: 18, marginBottom: 20, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  content: { fontSize: 12, whiteSpace: 'pre-wrap' }
});

// Component Styles
const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: 'Arial, sans-serif'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  marginBottom: '30px'
};

const inputStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '16px'
};

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold'
};

const disabledButtonStyle = { ...buttonStyle, backgroundColor: '#cccccc' };
const responseSectionStyle = { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginTop: '20px' };
const responseContentStyle = { whiteSpace: 'pre-wrap', margin: '15px 0', lineHeight: '1.6' };
const pdfButtonStyle = { backgroundColor: '#2196F3', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' };
const errorStyle = { color: '#d32f2f', backgroundColor: '#fde8e8', padding: '10px', borderRadius: '4px', margin: '10px 0' };

const StudyMaterials = () => {
  const [topic, setTopic] = useState('');
  const [materialType, setMaterialType] = useState('summarize');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [additionalOptions, setAdditionalOptions] = useState({ bullets: 5, count: 5, questions: 5 });
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.baseURL = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000' 
      : '';
  }, []);

  const generateMaterial = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login first');
      }

      const endpoint = `/api/ai/${materialType}`;
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
      setLoading(false);
    }
  };

  const handleOptionChange = (e) => {
    setAdditionalOptions({
      ...additionalOptions,
      [e.target.name]: parseInt(e.target.value) || 1
    });
  };

  const PdfDocument = () => (
    <Document>
      <Page style={pdfStyles.page}>
        <Text style={pdfStyles.title}>
          {`${materialType.charAt(0).toUpperCase() + materialType.slice(1)}: ${topic}`}
        </Text>
        <Text style={pdfStyles.content}>{response}</Text>
      </Page>
    </Document>
  );

  return (
    <div style={containerStyle}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>📚 Study Material Generator</h1>
      <form onSubmit={generateMaterial} style={formStyle}>
        <input
          type="text"
          value={topic}
          onChange={(e) => { setTopic(e.target.value); setError(''); }}
          placeholder="Enter topic (e.g., Quantum Physics)"
          required
          disabled={loading}
          style={inputStyle}
        />
        <select
          value={materialType}
          onChange={(e) => setMaterialType(e.target.value)}
          disabled={loading}
          style={inputStyle}
        >
          <option value="summarize">Summarized Notes</option>
          <option value="flashcards">Flashcards</option>
          <option value="quiz">Quiz Questions</option>
        </select>

        {materialType === 'summarize' && (
          <div>
            <label>Number of bullet points:</label>
            <input
              type="number"
              name="bullets"
              min="1"
              max="20"
              value={additionalOptions.bullets}
              onChange={handleOptionChange}
              disabled={loading}
              style={inputStyle}
            />
          </div>
        )}

        {materialType === 'flashcards' && (
          <div>
            <label>Number of flashcards:</label>
            <input
              type="number"
              name="count"
              min="1"
              max="20"
              value={additionalOptions.count}
              onChange={handleOptionChange}
              disabled={loading}
              style={inputStyle}
            />
          </div>
        )}

        {materialType === 'quiz' && (
          <div>
            <label>Number of questions:</label>
            <input
              type="number"
              name="questions"
              min="1"
              max="20"
              value={additionalOptions.questions}
              onChange={handleOptionChange}
              disabled={loading}
              style={inputStyle}
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={loading ? disabledButtonStyle : buttonStyle}
        >
          {loading ? 'Generating...' : 'Generate Material'}
        </button>
      </form>

      {error && <div style={errorStyle}>{error}</div>}

      {response && (
        <div style={responseSectionStyle}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>
            Generated {materialType === 'quiz' ? 'Quiz' : materialType === 'flashcards' ? 'Flashcards' : 'Summary'}:
          </h3>
          <div style={responseContentStyle}>
            {response.split('\n').map((line, i) => (
              <p key={i} style={{ margin: '8px 0' }}>{line}</p>
            ))}
          </div>
          <div style={{ marginTop: '20px' }}>
            <PDFDownloadLink
              document={<PdfDocument />}
              fileName={`${topic}-${materialType}.pdf`}
            >
              {({ loading: pdfLoading }) => (
                <button 
                  style={pdfButtonStyle}
                  disabled={pdfLoading || loading}
                >
                  {pdfLoading ? 'Creating PDF...' : '📥 Download as PDF'}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterials;