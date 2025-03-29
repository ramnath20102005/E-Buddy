import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Form, Image, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Profile.css';

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
  const navigate = useNavigate();

  const defaultProfileImage = '/default-profile.jpg';

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
              </div>
              <h5 className="profile-name">{name || 'User Name'}</h5>
              <p className="profile-email">{email}</p>
              
              <div className="profile-actions">
                {!isEditing ? (
                  <>
                    <Button 
                      className="edit-btn" 
                      onClick={() => setIsEditing(true)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Edit Profile'}
                    </Button>
                    <Button 
                      className="logout-btn" 
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="save-btn" 
                      form="editForm"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="cancel-btn" 
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Col>

            {!isEditing && (
              <Col md={8} className="stats-section">
                <h4 className="section-title mb-3">Your Dashboard Overview</h4>
                <Row>
                  <Col md={4}>
                    <Card className="stat-card">
                      <Card.Body>
                        <Card.Title>YOUR PROFILE</Card.Title>
                        <Card.Text className="stat-description">
                          Keep your profile details updated for better recommendations and networking.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card 
                      className="stat-card hover-shadow" 
                      onClick={navigateToLearningActivity}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <Card.Body>
                        <Card.Title>Learning Activity</Card.Title>
                        <Card.Text className="stat-description">
                          Track your learning activities and see your course engagement.
                        </Card.Text>
                        <div className="text-end text-primary">View History →</div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card 
                      className="stat-card hover-shadow" 
                      onClick={navigateToCareerInsights}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <Card.Body>
                        <Card.Title>Recent Career Insights</Card.Title>
                        <Card.Text className="stat-description">
                          Get personalized career suggestions and skill-building insights.
                        </Card.Text>
                        <div className="text-end text-primary">View History →</div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>

          <Row className="personal-info-section">
            <Col>
              {isEditing ? (
                <Form id="editForm" className="edit-profile-form" onSubmit={handleSubmit}>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="profileImage" className="mb-4">
                        <Form.Label className="form-label">Profile Image</Form.Label>
                        <div className="d-flex align-items-center">
                          <Form.Control 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="form-control-file"
                            disabled={isLoading}
                          />
                          <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => setProfileImage(defaultProfileImage)} 
                            className="remove-btn ms-2"
                            disabled={isLoading}
                          >
                            Remove Profile Image
                          </Button>
                        </div>
                      </Form.Group>

                      <Form.Group controlId="name" className="mb-4">
                        <Form.Label className="form-label">Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="form-input"
                          disabled={isLoading}
                        />
                      </Form.Group>
                      
                      <Form.Group controlId="bio" className="mb-4">
                        <Form.Label className="form-label">Bio</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={4} 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)}
                          className="form-textarea"
                          disabled={isLoading}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group controlId="skills" className="mb-4">
                        <Form.Label className="form-label">Skills (comma separated)</Form.Label>
                        <Form.Control
                          type="text"
                          value={Array.isArray(skills) ? skills.join(', ') : skills}
                          onChange={(e) => setSkills(e.target.value.split(',').map(skill => skill.trim()))}
                          className="form-input"
                          placeholder="e.g. JavaScript, React, Node.js"
                          disabled={isLoading}
                        />
                      </Form.Group>
                      
                      <Form.Group controlId="interests" className="mb-4">
                        <Form.Label className="form-label">Interests (comma separated)</Form.Label>
                        <Form.Control
                          type="text"
                          value={Array.isArray(interests) ? interests.join(', ') : interests}
                          onChange={(e) => setInterests(e.target.value.split(',').map(interest => interest.trim()))}
                          className="form-input"
                          placeholder="e.g. Hiking, Reading, Music"
                          disabled={isLoading}
                        />
                      </Form.Group>
                      
                      <Form.Group controlId="achievements" className="mb-4">
                        <Form.Label className="form-label">Achievements (comma separated)</Form.Label>
                        <Form.Control
                          type="text"
                          value={Array.isArray(achievements) ? achievements.join(', ') : achievements}
                          onChange={(e) => setAchievements(e.target.value.split(',').map(cert => cert.trim()))}
                          className="form-input"
                          placeholder="e.g. AWS Certified, Google Analytics"
                          disabled={isLoading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              ) : (
                <div className="info-display">
                  <h4 className="section-title">About Me</h4>
                  <p className="bio-text">{bio || 'No bio available'}</p>
                  
                  <h4 className="section-title">Skills</h4>
                  <p className="bio-text">{cleanArrayDisplay(skills)}</p>
                  
                  <h4 className="section-title">Interests</h4>
                  <p className="bio-text">{cleanArrayDisplay(interests)}</p>
                  
                  <h4 className="section-title">Achievements</h4>
                  <p className="bio-text">{cleanArrayDisplay(achievements)}</p>
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