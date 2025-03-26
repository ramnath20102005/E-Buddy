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

  const defaultProfileImage = '/default-profile.jpg';

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

  return (
    <Container className="profile-container">
      <Card className="profile-card">
        <Card.Body>
          <Row>
            <Col md={3} className="profile-section">
              <div className="profile-image-wrapper">
                <Image
                  src={profileImage || defaultProfileImage}
                  roundedCircle
                  className="profile-image"
                  alt="Profile"
                />
              </div>
              <p className="profile-email mt-2">{email}</p>
              {!isEditing && (
                <div className="d-flex flex-column gap-2">
                  <Button variant="link" className="edit-btn" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                  <Button variant="danger" className="logout-btn" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              )}
            </Col>

            {!isEditing && (
              <Col md={9}>
                <Row>
                  <Col md={4}>
                    <Card className="stat-card">
                      <Card.Body>
                        <Card.Title>Progress</Card.Title>
                        <ProgressBar
                          now={75}
                          label={`${75}%`}
                          className="custom-progress-bar" // Updated class name
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="stat-card">
                      <Card.Body>
                        <Card.Title>Courses Accessed</Card.Title>
                        <Card.Text className="stat-value">5</Card.Text> {/* Updated class name */}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="stat-card">
                      <Card.Body>
                        <Card.Title>Tracking History</Card.Title>
                        <Card.Text className="stat-value">Recently accessed chats</Card.Text> {/* Updated class name */}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>

          <Row className="mt-4">
            <Col>
              {isEditing ? (
                <Form className="edit-profile-form" onSubmit={handleSubmit}>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  <Form.Group controlId="profileImage" className="mb-3">
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                  </Form.Group>
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="bio" className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control as="textarea" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="skills" className="mb-3">
                    <Form.Label>Skills</Form.Label>
                    <Form.Control
                      type="text"
                      value={skills.join(', ')}
                      onChange={(e) => setSkills(e.target.value.split(',').map(skill => skill.trim()))}
                    />
                  </Form.Group>
                  <Form.Group controlId="interests" className="mb-3">
                    <Form.Label>Interests</Form.Label>
                    <Form.Control
                      type="text"
                      value={interests.join(', ')}
                      onChange={(e) => setInterests(e.target.value.split(',').map(interest => interest.trim()))}
                    />
                  </Form.Group>
                  <Form.Group controlId="certifications" className="mb-3">
                    <Form.Label>Certifications</Form.Label>
                    <Form.Control
                      type="text"
                      value={certifications.join(', ')}
                      onChange={(e) => setCertifications(e.target.value.split(',').map(cert => cert.trim()))}
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" className="save-btn">
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)} className="cancel-btn">
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <h4 className="section-title">About Me</h4>
                  <p className="bio-text">{bio}</p> {/* Updated class name */}
                  <h4 className="section-title">Skills</h4>
                  <p className="bio-text">{skills.join(', ')}</p> {/* Updated class name */}
                  <h4 className="section-title">Interests</h4>
                  <p className="bio-text">{interests.join(', ')}</p> {/* Updated class name */}
                  <h4 className="section-title">Certifications</h4>
                  <p className="bio-text">{certifications.join(', ')}</p> {/* Updated class name */}
                </>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;