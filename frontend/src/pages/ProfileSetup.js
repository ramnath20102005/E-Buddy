import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Directly using axios
//import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../ProfileSetup.css';

const ProfileSetup = () => {
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated. Please log in again.');
        return;
      }

      const profileData = {
        name,
        skills: skills.split(',').map((skill) => skill.trim()),
        interests: interests.split(',').map((interest) => interest.trim()),
      };

      // Send request to update profile
      await axios.put('http://localhost:5000/api/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/login'), 1000); // Redirect faster
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  return (
    <>
      
      <div className="profile-setup-container">
        <div className="profile-setup-card">
          <h2 className="title">Profile Setup</h2>
          <p className="subtitle">Fill these details now or skip for later.</p>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </Form.Group>

            <Form.Group controlId="skills" className="mb-3">
              <Form.Label>Skills (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Area of specialization"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="input-field"
              />
            </Form.Group>

            <Form.Group controlId="interests" className="mb-3">
              <Form.Label>Interests (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Area of interest"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="input-field"
              />
            </Form.Group>

            <div className="button-group">
              <Button variant="primary" type="submit" className="save-button">
                Save
              </Button>
              <Button variant="secondary" onClick={handleSkip} className="skip-button">
                Skip for Later
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfileSetup;
