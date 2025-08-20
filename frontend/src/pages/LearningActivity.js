import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaClock, 
  FaArrowRight, 
  FaChevronDown, 
  FaChevronUp,
  FaGraduationCap,
  FaChartLine,
  FaTrophy,
  FaPlay,
  FaPause,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaBookOpen,
  FaCrosshairs,
  FaRocket,
  FaSync
} from 'react-icons/fa';
import '../styles/learning-common.css';
import Chatbot from "../components/Chatbot";

const LearningActivity = () => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    completionRate: 0,
    totalTimeSpent: 0,
    averageScore: 0,
    recentActivities: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch activities with current filters
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (searchTerm) params.append('search', searchTerm);

      const activitiesResponse = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/learning-activities?${params}`,
        config
      );

      // Fetch statistics
      const statsResponse = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/learning-activities/stats`,
        config
      );

      setActivities(activitiesResponse.data);
      setStats(statsResponse.data);
      setError('');
    } catch (err) {
      console.error('Error fetching learning activities:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to fetch learning activities');
      }
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    try {
      setSyncing(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/learning-activities/sync`,
        {},
        config
      );

      // Refresh data after sync
      await fetchActivities();
    } catch (err) {
      console.error('Error syncing data:', err);
      setError(err.response?.data?.error || 'Failed to sync data');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filter, searchTerm]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { class: 'badge-success', text: 'Completed', icon: <FaCheckCircle /> };
      case 'in-progress':
        return { class: 'badge-warning', text: 'In Progress', icon: <FaPlay /> };
      case 'not-started':
        return { class: 'badge-error', text: 'Not Started', icon: <FaPause /> };
      default:
        return { class: 'badge-info', text: 'Unknown', icon: <FaExclamationTriangle /> };
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'var(--accent-green)';
      case 'medium': return 'var(--accent-orange)';
      case 'hard': return 'var(--accent-red)';
      default: return 'var(--gray-500)';
    }
  };

  const toggleCardExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.status === filter;
    const matchesSearch = activity.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="learning-page-container">
      <div className="learning-page-wrapper">
        {/* Header Section */}
        <div className="learning-header">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaGraduationCap style={{ marginRight: '20px', fontSize: '3rem' }} />
            Learning Activity Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Track your learning progress and achievements
          </motion.p>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            padding: '24px',
            background: 'var(--gray-50)',
            borderBottom: '1px solid var(--gray-200)'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gray-800)' }}>
              Learning Statistics
            </h2>
            <motion.button
              className="btn btn-outline"
              onClick={syncData}
              disabled={syncing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FaSync className={syncing ? 'spinning' : ''} />
              {syncing ? 'Syncing...' : 'Sync Data'}
            </motion.button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              { label: 'Total Activities', value: stats.total, icon: <FaBookOpen />, color: 'var(--primary-blue)' },
              { label: 'Completed', value: stats.completed, icon: <FaCheckCircle />, color: 'var(--accent-green)' },
              { label: 'In Progress', value: stats.inProgress, icon: <FaPlay />, color: 'var(--accent-orange)' },
              { label: 'Not Started', value: stats.notStarted, icon: <FaPause />, color: 'var(--accent-red)' },
              { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: <FaChartLine />, color: 'var(--accent-green)' },
              { label: 'Recent Activities', value: stats.recentActivities, icon: <FaClock />, color: 'var(--primary-blue)' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="card"
                style={{ textAlign: 'center', padding: '20px' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <div style={{ fontSize: '2rem', color: stat.color, marginBottom: '12px' }}>
                  {stat.icon}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--gray-800)', marginBottom: '8px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', fontWeight: '500' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="learning-content">
          {/* Left Sidebar - Filters */}
          <div className="learning-sidebar">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: 'var(--gray-800)' }}>
                <FaCrosshairs style={{ marginRight: '10px', color: 'var(--primary-blue)' }} />
                Filters & Actions
              </h2>

              {/* Search */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Search Activities</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by topic or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Filter by Status</label>
                <select
                  className="form-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Activities</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="not-started">Not Started</option>
                </select>
              </div>

              {/* Quick Actions */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Quick Actions
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <motion.button
                    className="btn btn-primary"
          onClick={() => navigate('/learning-path')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaRocket style={{ marginRight: '8px' }} />
                    Start New Learning
                  </motion.button>
                  
                  <motion.button
                    className="btn btn-outline"
                    onClick={() => navigate('/study-materials')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaBookOpen style={{ marginRight: '8px' }} />
                    Study Materials
                  </motion.button>
                  
                  <motion.button
                    className="btn btn-outline"
                    onClick={() => navigate('/quiz')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaChartLine style={{ marginRight: '8px' }} />
                    Take Quiz
                  </motion.button>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="card" style={{ marginTop: '24px' }}>
                <div className="card-title" style={{ marginBottom: '16px' }}>
                  <FaTrophy style={{ marginRight: '8px', color: 'var(--accent-orange)' }} />
                  Your Progress
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Completion Rate:</strong> {stats.completionRate}%
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Total Time:</strong> {stats.totalTimeSpent} min
                  </div>
                  <div>
                    <strong>Average Score:</strong> {Math.round(stats.averageScore || 0)}%
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Main Content */}
          <div className="learning-main">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gray-800)' }}>
                  Learning Activities
                </h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                  {filteredActivities.length} of {activities.length} activities
                </div>
      </div>

        {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <div className="loading-text">Loading your learning activities...</div>
          </div>
        ) : error ? (
                <div className="card" style={{ textAlign: 'center', color: 'var(--accent-red)' }}>
                  <FaExclamationTriangle style={{ fontSize: '3rem', marginBottom: '16px' }} />
                  <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                    Error Loading Activities
                  </div>
                  <div>{error}</div>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="placeholder-container">
                  <div className="placeholder-icon">📚</div>
                  <div className="placeholder-text">No activities found</div>
                  <div className="placeholder-subtext">
                    Try adjusting your filters or start a new learning path
          </div>
          </div>
        ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
            <AnimatePresence>
                    {filteredActivities.map((activity, index) => {
                const status = getStatusBadge(activity.status);
                return (
                  <motion.div
                    key={activity._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                    layout
                  >
                    <div 
                            className={`card ${expandedCard === activity._id ? 'expanded' : ''}`}
                            style={{ cursor: 'pointer' }}
                      onClick={() => toggleCardExpand(activity._id)}
                    >
                      <div className="card-header">
                              <div style={{ flex: 1 }}>
                        <div className="card-title">{activity.title || activity.topic}</div>
                                <div className="card-subtitle">
                                  <FaCalendarAlt style={{ marginRight: '6px', fontSize: '0.75rem' }} />
                                  {new Date(activity.createdAt).toLocaleDateString()}
                                  <span style={{ margin: '0 8px' }}>•</span>
                                  <span style={{ color: getDifficultyColor(activity.difficulty) }}>
                                    {activity.difficulty}
                          </span>
                                  <span style={{ margin: '0 8px' }}>•</span>
                                  {activity.category}
                                  <span style={{ margin: '0 8px' }}>•</span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                    {activity.activityType}
                                  </span>
                                </div>
                              </div>
                              
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className={`badge ${status.class}`}>
                                  {status.icon}
                                  <span style={{ marginLeft: '6px' }}>{status.text}</span>
                                </div>
                                
                                {expandedCard === activity._id ? <FaChevronUp /> : <FaChevronDown />}
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ marginBottom: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Progress</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                                  {activity.progress}%
                          </span>
                              </div>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${activity.progress}%` }}
                                ></div>
                        </div>
                      </div>

                            {/* Quick Stats */}
                            <div style={{ 
                              display: 'grid', 
                              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                              gap: '16px',
                              marginBottom: '16px'
                            }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '4px' }}>
                                  Duration
                                </div>
                                <div style={{ fontWeight: '600', color: 'var(--gray-700)' }}>
                                  {activity.duration}
                                </div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '4px' }}>
                                  Time Spent
                                </div>
                                <div style={{ fontWeight: '600', color: 'var(--gray-700)' }}>
                                  {activity.timeSpent}
                                </div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '4px' }}>
                                  Level
                                </div>
                                <div style={{ fontWeight: '600', color: 'var(--gray-700)' }}>
                                  {activity.level}
                                </div>
                              </div>
                              {activity.score && (
                                <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '4px' }}>
                                    Score
                                  </div>
                                  <div style={{ fontWeight: '600', color: 'var(--accent-green)' }}>
                                    {activity.score}%
                                  </div>
                                </div>
                              )}
                            </div>

                      <AnimatePresence>
                        {expandedCard === activity._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                                  style={{ 
                                    borderTop: '1px solid var(--gray-200)', 
                                    paddingTop: '20px',
                                    marginTop: '20px'
                                  }}
                                >
                                  <div style={{ display: 'grid', gap: '16px' }}>
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                      <motion.button
                                        className="btn btn-primary"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const params = new URLSearchParams();
                                          if (activity.topic) params.set('topic', activity.topic);
                                          if (activity.level) params.set('level', activity.level);
                                          if (activity.duration) params.set('duration', activity.duration);
                                          navigate(`/learning-path?${params.toString()}`);
                                        }}
                                      >
                                        <FaPlay style={{ marginRight: '8px' }} />
                                        Continue Learning
                                      </motion.button>
                                      
                                      <motion.button
                                        className="btn btn-outline"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const params = new URLSearchParams();
                                          if (activity.topic) params.set('topic', activity.topic);
                                          params.set('type', 'summarize');
                                          params.set('auto', '1');
                                          navigate(`/study-materials?${params.toString()}`);
                                        }}
                                      >
                                        <FaBookOpen style={{ marginRight: '8px' }} />
                                        View Materials
                                      </motion.button>
                                      
                          
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
            </motion.div>
          </div>
        </div>
      </div>
      <Chatbot />
      </div>
  );
};

export default LearningActivity;