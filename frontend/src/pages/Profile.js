import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, ProgressBar, Form, Image, Alert } from 'react-bootstrap';
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
  const navigate = useNavigate();

  const defaultProfileImage = '../assets/images/default-profile.jpg';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
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
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const profileData = {
        profileImage,
        name,
        bio,
        skills,
        interests,
        certifications,
        achievements,
      };

      await axios.put('http://localhost:5000/api/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Helper function to clean array display
  const cleanArrayDisplay = (arr) => {
    if (!Array.isArray(arr)) return 'None specified';
    return arr.map(item => item.replace(/["\[\]]/g, '')).join(', ') || 'None specified';
  };

  return (
    <Container className="profile-container">
      <Card className="profile-card">
        <Card.Body>
          {/* Top Section - Profile and Stats Side by Side */}
          <Row className="top-section">
            {/* Left Column - Profile Section */}
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
                    <Button className="edit-btn" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                    <Button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" className="save-btn" form="editForm">
                      Save Changes
                    </Button>
                    <Button variant="secondary" className="cancel-btn" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Col>

            {/* Right Column - Stats Section (hidden when editing) */}
            {!isEditing && (
              <Col md={8} className="stats-section">
                <Row>
                  <Col md={4}>
                    <Card className="stat-card">
                      <Card.Body>
                        <Card.Title>Progress</Card.Title>
                        <ProgressBar now={75} label={`${75}%`} className="custom-progress-bar" />
                        <Card.Text className="stat-value mt-2">75% Complete</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="stat-card">
                      <Card.Body>
                        <Card.Title>Courses Accessed</Card.Title>
                        <Card.Text className="stat-value">5 Courses</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="stat-card">
                      <Card.Body>
                        <Card.Title>Chat History</Card.Title>
                        <Card.Text className="stat-value">Recent Chats</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>

          {/* Bottom Section - Personal Information (full width) */}
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
                        <Form.Control 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          className="form-control-file"
                        />
                      </Form.Group>
                      
                      <Form.Group controlId="name" className="mb-4">
                        <Form.Label className="form-label">Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="form-input"
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
                        />
                      </Form.Group>
                      
                      <Form.Group controlId="certifications" className="mb-4">
                        <Form.Label className="form-label">Certifications (comma separated)</Form.Label>
                        <Form.Control
                          type="text"
                          value={Array.isArray(certifications) ? certifications.join(', ') : certifications}
                          onChange={(e) => setCertifications(e.target.value.split(',').map(cert => cert.trim()))}
                          className="form-input"
                          placeholder="e.g. AWS Certified, Google Analytics"
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
                  
                  <h4 className="section-title">Certifications</h4>
                  <p className="bio-text">{cleanArrayDisplay(certifications)}</p>
                  
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