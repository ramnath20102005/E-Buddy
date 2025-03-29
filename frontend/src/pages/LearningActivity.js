import React, { useState, useEffect } from 'react';
import { Container, Spinner, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiRefreshCw, FiClock, FiArrowRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import '../InsightsActivity.css';

const LearningActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile/learning-history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActivities(response.data);
    } catch (err) {
      console.error('Error fetching learning history:', err);
      setError(err.response?.data?.message || 'Failed to fetch activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActivities(); }, [navigate]);

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

  const formatDuration = (duration) => {
    if (!duration) return '0 min';
    return duration.includes('min') ? duration : `${duration} min`;
  };

  return (
    <Container className="insights-container">
      <div className="header-section">
        <h2>Learning Activity</h2>
        <Button 
          variant="primary" 
          onClick={() => navigate('/learning-path')}
          className="action-btn"
        >
          Continue Learning <FiArrowRight />
        </Button>
      </div>

      <div className="content-section">
        {loading ? (
          <div className="loading-state">
            <Spinner animation="border" />
            <p>Loading your learning activities...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <FiRefreshCw className="error-icon" />
            <p>{error}</p>
            <Button variant="outline-primary" onClick={fetchActivities}>
              <FiRefreshCw /> Retry
            </Button>
          </div>
        ) : activities.length === 0 ? (
          <div className="empty-state">
            <FiClock className="empty-icon" />
            <h4>No Learning Activities Yet</h4>
            <p>Start learning to see your history here</p>
            <Button variant="primary" onClick={() => navigate('/learning-path')}>
              Start Learning
            </Button>
          </div>
        ) : (
          <div className="cards-grid">
            <AnimatePresence>
              {activities.map((activity, index) => {
                const status = getStatusBadge(activity.status);
                return (
                  <motion.div
                    key={activity._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    layout
                  >
                    <div 
                      className={`insight-card ${expandedCard === activity._id ? 'expanded' : ''}`}
                      onClick={() => toggleCardExpand(activity._id)}
                    >
                      <div className="card-header">
                        <Badge className={`status-badge ${status.class}`}>
                          {status.text}
                        </Badge>
                        <div className="card-title">{activity.topic}</div>
                        <div className="card-meta">
                          <span className="duration">
                            {formatDuration(activity.duration)}
                          </span>
                          <span className="timestamp">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </span>
                          {expandedCard === activity._id ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedCard === activity._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="card-body"
                          >
                            <div className="content-block">
                              <label>Level</label>
                              <div className="detail-value">
                                {activity.level || 'Not specified'}
                              </div>
                            </div>
                            <div className="content-block">
                              <label>Response</label>
                              <div className="response-content">
                                {activity.responseText || 'No response available'}
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

export default LearningActivity;