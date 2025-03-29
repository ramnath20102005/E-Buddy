import React, { useState, useEffect } from 'react';
import { Container, Spinner, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiRefreshCw, FiBriefcase, FiArrowRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import '../InsightsActivity.css';

const CareerInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();

  const fetchInsights = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile/career-history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInsights(response.data);
    } catch (err) {
      console.error('Error fetching career insights:', err);
      setError(err.response?.data?.message || 'Failed to fetch career insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInsights(); }, [navigate]);

  const getStatusBadge = (status) => {
    if (!status) return { class: 'not-started', text: 'Not Started' };
    const statusLower = status.toLowerCase();
    if (statusLower.includes('complete')) return { class: 'completed', text: 'Completed' };
    if (statusLower.includes('progress')) return { class: 'in-progress', text: 'In Progress' };
    return { class: 'not-started', text: 'Not Started' };
  };

  const toggleCardExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <Container className="insights-container">
      <div className="header-section">
        <h2>Career Insights</h2>
        <Button 
          variant="primary" 
          onClick={() => navigate('/careerpath')}
          className="action-btn"
        >
          Explore Paths <FiArrowRight />
        </Button>
      </div>

      <div className="content-section">
        {loading ? (
          <div className="loading-state">
            <Spinner animation="border" />
            <p>Loading your career insights...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <FiRefreshCw className="error-icon" />
            <p>{error}</p>
            <Button variant="outline-primary" onClick={fetchInsights}>
              <FiRefreshCw /> Retry
            </Button>
          </div>
        ) : insights.length === 0 ? (
          <div className="empty-state">
            <FiBriefcase className="empty-icon" />
            <h4>No Career Insights Yet</h4>
            <p>Complete your profile to get personalized recommendations</p>
            <Button variant="primary" onClick={() => navigate('/profile')}>
              Complete Profile
            </Button>
          </div>
        ) : (
          <div className="cards-grid">
            <AnimatePresence>
              {insights.map((insight, index) => {
                const status = getStatusBadge(insight.status);
                return (
                  <motion.div
                    key={insight._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    layout
                  >
                    <div 
                      className={`insight-card ${expandedCard === insight._id ? 'expanded' : ''}`}
                      onClick={() => toggleCardExpand(insight._id)}
                    >
                      <div className="card-header">
                        <Badge className={`status-badge ${status.class}`}>
                          {status.text}
                        </Badge>
                        <div className="card-title">Career Path Suggestion</div>
                        <div className="card-meta">
                          <span className="timestamp">
                            {new Date(insight.createdAt).toLocaleDateString()}
                          </span>
                          {expandedCard === insight._id ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedCard === insight._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="card-body"
                          >
                            <div className="content-block">
                              <label>Recommendation</label>
                              <div className="response-content">
                                {insight.responseText || 'No recommendation available'}
                              </div>
                            </div>
                            <div className="content-block">
                              <label>Skills</label>
                              <div className="skills-container">
                                {insight.skills?.map((skill, i) => (
                                  <Badge key={i} className="skill-badge">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Container>
  );
};

export default CareerInsights;