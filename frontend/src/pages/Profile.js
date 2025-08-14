import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Form, Image, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Profile.css';
import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaSignOutAlt, 
  FaUser, 
  FaGraduationCap, 
  FaLightbulb, 
  FaTrophy, 
  FaBookOpen, 
  FaChartLine,
  FaCamera,
  FaTrash,
  FaPlus,
  FaStar,
  FaHeart,
  FaRocket,
  FaCheckCircle
} from 'react-icons/fa';

const Profile = () => {
  const [profileImage, setProfileImage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const defaultProfileImage = '/default-profile.jpg';

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      { value: name, isString: true },
      { value: bio, isString: true },
      { value: skills, isArray: true },
      { value: interests, isArray: true }
    ];
    
    const completedFields = fields.filter(field => {
      if (field.isString) {
        return field.value && field.value.trim() !== '';
      } else if (field.isArray) {
        return Array.isArray(field.value) && field.value.length > 0;
      }
      return false;
    }).length;
    
    return Math.round((completedFields / fields.length) * 100);
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = response.data;
      setProfileImage(profile.profileImage || defaultProfileImage);
      setName(profile.name || '');
      setEmail(profile.email || '');
      setBio(profile.bio || 'No bio available');
      setSkills(Array.isArray(profile.skills) ? profile.skills : []);
      setInterests(Array.isArray(profile.interests) ? profile.interests : []);
      setCertifications(Array.isArray(profile.certifications) ? profile.certifications : []);
      setAchievements(Array.isArray(profile.achievements) ? profile.achievements : []);
    } catch (err) {
      setError('Failed to fetch profile: ' + (err.response?.data?.message || err.message));
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG)');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target.result);
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const profileData = {
        profileImage: profileImage !== defaultProfileImage ? profileImage : null,
        name,
        bio,
        skills,
        interests,
        certifications,
        achievements,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile`,
        profileData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to update profile');
        console.error('Update error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navigateToLearningActivity = () => {
    navigate('/learning-activity');
  };

  const navigateToCareerInsights = () => {
    navigate('/career-insights');
  };

  const cleanArrayDisplay = (arr) => {
    if (!Array.isArray(arr)) return 'None specified';
    return arr.filter(item => item.trim()).join(', ') || 'None specified';
  };

  const addSkill = (skill) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()]);
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addInterest = (interest) => {
    if (interest.trim() && !interests.includes(interest.trim())) {
      setInterests([...interests, interest.trim()]);
    }
  };

  const removeInterest = (index) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const addAchievement = (achievement) => {
    if (achievement.trim() && !achievements.includes(achievement.trim())) {
      setAchievements([...achievements, achievement.trim()]);
    }
  };

  const removeAchievement = (index) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-content">
            <Row>
              <Col md={4}>
                <Card className="stat-card enhanced">
                  <Card.Body>
                    <div className="stat-icon-wrapper">
                      <FaUser className="stat-icon" />
                    </div>
                    <Card.Title>YOUR PROFILE</Card.Title>
                    <Card.Text className="stat-description">
                      Keep your profile details updated for better recommendations and networking.
                    </Card.Text>
                    <div className="profile-completion">
                      <ProgressBar 
                        now={calculateProfileCompletion()} 
                        variant="success" 
                        className="mb-2"
                        style={{ height: '8px' }}
                      />
                      <small className="text-muted">{calculateProfileCompletion()}% Complete</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card 
                  className="stat-card enhanced hover-shadow" 
                  onClick={navigateToLearningActivity}
                >
                  <Card.Body>
                    <div className="stat-icon-wrapper">
                      <FaBookOpen className="stat-icon" />
                    </div>
                    <Card.Title>Learning Activity</Card.Title>
                    <Card.Text className="stat-description">
                      Track your learning activities and see your course engagement.
                    </Card.Text>
                    <div className="stat-action">
                      <span>View History</span>
                      <FaRocket className="action-icon" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card 
                  className="stat-card enhanced hover-shadow" 
                  onClick={navigateToCareerInsights}
                >
                  <Card.Body>
                    <div className="stat-icon-wrapper">
                      <FaChartLine className="stat-icon" />
                    </div>
                    <Card.Title>Career Insights</Card.Title>
                    <Card.Text className="stat-description">
                      Get personalized career suggestions and skill-building insights.
                    </Card.Text>
                    <div className="stat-action">
                      <span>Get Insights</span>
                      <FaRocket className="action-icon" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        );

      case 'skills':
        return (
          <div className="tab-content">
            <div className="skills-section">
              <h4 className="section-title">Skills & Expertise</h4>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    <FaStar className="skill-icon" />
                    <span>{skill}</span>
                    {isEditing && (
                      <button 
                        className="remove-tag-btn"
                        onClick={() => removeSkill(index)}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="add-item-form">
                  <input
                    type="text"
                    placeholder="Add a new skill"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="add-item-input"
                  />
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      addSkill(input.value);
                      input.value = '';
                    }}
                  >
                    <FaPlus />
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'interests':
        return (
          <div className="tab-content">
            <div className="interests-section">
              <h4 className="section-title">Personal Interests</h4>
              <div className="interests-grid">
                {interests.map((interest, index) => (
                  <div key={index} className="interest-tag">
                    <FaHeart className="interest-icon" />
                    <span>{interest}</span>
                    {isEditing && (
                      <button 
                        className="remove-tag-btn"
                        onClick={() => removeInterest(index)}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="add-item-form">
                  <input
                    type="text"
                    placeholder="Add a new interest"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addInterest(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="add-item-input"
                  />
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      addInterest(input.value);
                      input.value = '';
                    }}
                  >
                    <FaPlus />
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="tab-content">
            <div className="achievements-section">
              <h4 className="section-title">Achievements & Certifications</h4>
              <div className="achievements-grid">
                {achievements.map((achievement, index) => (
                  <div key={index} className="achievement-tag">
                    <FaTrophy className="achievement-icon" />
                    <span>{achievement}</span>
                    {isEditing && (
                      <button 
                        className="remove-tag-btn"
                        onClick={() => removeAchievement(index)}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="add-item-form">
                  <input
                    type="text"
                    placeholder="Add a new achievement"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addAchievement(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="add-item-input"
                  />
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      addAchievement(input.value);
                      input.value = '';
                    }}
                  >
                    <FaPlus />
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Container className="profile-container">
      <Card className="profile-card">
        <Card.Body>
          <Row className="top-section">
            <Col md={4} className="profile-section">
              <div className="profile-image-wrapper">
                <Image
                  src={profileImage || defaultProfileImage}
                  roundedCircle
                  className="profile-image"
                  alt="Profile"
                />
                {isEditing && (
                  <div className="image-overlay">
                    <label htmlFor="profileImage" className="image-upload-btn">
                      <FaCamera />
                    </label>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>
              <h5 className="profile-name">{name || 'User Name'}</h5>
              <p className="profile-email">{email}</p>
              
              <div className="profile-actions">
                {!isEditing ? (
                  <>
                    <Button 
                      className="edit-btn enhanced" 
                      onClick={() => setIsEditing(true)}
                      disabled={isLoading}
                    >
                      <FaEdit className="btn-icon" />
                      Edit Profile
                    </Button>
                    <Button 
                      className="logout-btn enhanced" 
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      <FaSignOutAlt className="btn-icon" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="save-btn enhanced" 
                      form="editForm"
                      disabled={isLoading}
                    >
                      <FaSave className="btn-icon" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="cancel-btn enhanced" 
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      <FaTimes className="btn-icon" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Col>

            {!isEditing && (
              <Col md={8} className="stats-section">
                <div className="tabs-navigation">
                  <button 
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <FaUser className="tab-icon" />
                    Overview
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                    onClick={() => setActiveTab('skills')}
                  >
                    <FaGraduationCap className="tab-icon" />
                    Skills
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'interests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('interests')}
                  >
                    <FaLightbulb className="tab-icon" />
                    Interests
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('achievements')}
                  >
                    <FaTrophy className="tab-icon" />
                    Achievements
                  </button>
                </div>
                {renderTabContent()}
              </Col>
            )}
          </Row>

          <Row className="personal-info-section">
            <Col>
              {isEditing ? (
                <Form id="editForm" className="edit-profile-form enhanced" onSubmit={handleSubmit}>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="name" className="mb-4">
                        <Form.Label className="form-label">
                          <FaUser className="label-icon" />
                          Full Name *
                        </Form.Label>
                        <Form.Control 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="form-input enhanced"
                          placeholder="Enter your full name"
                          disabled={isLoading}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group controlId="bio" className="mb-4">
                        <Form.Label className="form-label">
                          <FaUser className="label-icon" />
                          Bio
                        </Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={4} 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)}
                          className="form-textarea enhanced"
                          placeholder="Tell us about yourself..."
                          disabled={isLoading}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <div className="info-display enhanced">
                        <h6 className="section-subtitle">
                          <FaGraduationCap className="label-icon" />
                          Profile Completion
                        </h6>
                        <p className="text-muted small">
                          Complete your profile by adding your bio and ensuring you have skills and interests listed.
                        </p>
                        <div className="profile-completion-mini">
                          <ProgressBar 
                            now={calculateProfileCompletion()} 
                            variant="success" 
                            className="mb-2"
                            style={{ height: '6px' }}
                          />
                          <small className="text-muted">{calculateProfileCompletion()}% Complete</small>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Skills Section */}
                  <Row className="mt-4">
                    <Col>
                      <Form.Group controlId="skills" className="mb-4">
                        <Form.Label className="form-label">
                          <FaGraduationCap className="label-icon" />
                          Skills & Expertise
                        </Form.Label>
                        <div className="skills-grid mb-3">
                          {skills.map((skill, index) => (
                            <div key={index} className="skill-tag">
                              <FaStar className="skill-icon" />
                              <span>{skill}</span>
                              <button 
                                type="button"
                                className="remove-tag-btn"
                                onClick={() => removeSkill(index)}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="add-item-form">
                          <input
                            type="text"
                            placeholder="Add a new skill"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkill(e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="add-item-input"
                          />
                          <Button 
                            type="button"
                            variant="outline-primary" 
                            size="sm"
                            onClick={(e) => {
                              const input = e.target.previousSibling;
                              addSkill(input.value);
                              input.value = '';
                            }}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Interests Section */}
                  <Row className="mt-4">
                    <Col>
                      <Form.Group controlId="interests" className="mb-4">
                        <Form.Label className="form-label">
                          <FaLightbulb className="label-icon" />
                          Personal Interests
                        </Form.Label>
                        <div className="interests-grid mb-3">
                          {interests.map((interest, index) => (
                            <div key={index} className="interest-tag">
                              <FaHeart className="interest-icon" />
                              <span>{interest}</span>
                              <button 
                                type="button"
                                className="remove-tag-btn"
                                onClick={() => removeInterest(index)}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="add-item-form">
                          <input
                            type="text"
                            placeholder="Add a new interest"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addInterest(e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="add-item-input"
                          />
                          <Button 
                            type="button"
                            variant="outline-primary" 
                            size="sm"
                            onClick={(e) => {
                              const input = e.target.previousSibling;
                              addInterest(input.value);
                              input.value = '';
                            }}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Achievements Section */}
                  <Row className="mt-4">
                    <Col>
                      <Form.Group controlId="achievements" className="mb-4">
                        <Form.Label className="form-label">
                          <FaTrophy className="label-icon" />
                          Achievements & Certifications
                        </Form.Label>
                        <div className="achievements-grid mb-3">
                          {achievements.map((achievement, index) => (
                            <div key={index} className="achievement-tag">
                              <FaTrophy className="achievement-icon" />
                              <span>{achievement}</span>
                              <button 
                                type="button"
                                className="remove-tag-btn"
                                onClick={() => removeAchievement(index)}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="add-item-form">
                          <input
                            type="text"
                            placeholder="Add a new achievement"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addAchievement(e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="add-item-input"
                          />
                          <Button 
                            type="button"
                            variant="outline-primary" 
                            size="sm"
                            onClick={(e) => {
                              const input = e.target.previousSibling;
                              addAchievement(input.value);
                              input.value = '';
                            }}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              ) : (
                <div className="info-display enhanced">
                  <h4 className="section-title">
                    <FaUser className="title-icon" />
                    About Me
                  </h4>
                  <p className="bio-text">{bio || 'No bio available'}</p>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;