import React, { useState } from 'react';
import axios from 'axios';
import './CourseRecommendation.css';
import { FaGraduationCap, FaMapMarkerAlt, FaStar, FaUniversity, FaBookOpen } from 'react-icons/fa';

const CourseRecommendation = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    region: '',
    interests: '',
    marks: '',
    cutoff: '',
    preferredDuration: '',
    budget: '',
    additionalInfo: ''
  });

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/course-recommendation/generate',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setRecommendations(response.data.recommendations);
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError(err.response?.data?.error || 'Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderRecommendations = () => {
    if (!recommendations) return null;

    return (
      <div className="recommendations-container">
        <h2 className="recommendations-title">
          <FaStar className="title-icon" />
          Your Personalized Course & College Recommendations
        </h2>
        
        <div className="recommendations-content">
          {recommendations}
        </div>

        <div className="recommendations-footer">
          <p className="disclaimer">
            💡 <strong>Note:</strong> These recommendations are AI-generated based on your inputs. 
            Please verify all information with official sources before making decisions.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="course-recommendation-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaGraduationCap className="title-icon" />
            Course & College Recommendation
          </h1>
          <p className="page-subtitle">
            Get personalized course and college recommendations based on your interests, 
            marks, and preferences using advanced AI analysis.
          </p>
        </div>
      </div>

      <div className="page-container">
        <div className="form-section">
          <div className="form-card">
            <h2 className="form-title">
              <FaBookOpen className="form-icon" />
              Tell Us About Yourself
            </h2>
            
            <form onSubmit={handleSubmit} className="recommendation-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="age">Age *</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="16"
                    max="25"
                    placeholder="Your age"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="region">Preferred Region *</label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Delhi, Mumbai, Bangalore, etc."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="marks">12th Marks (%) *</label>
                  <input
                    type="number"
                    id="marks"
                    name="marks"
                    value={formData.marks}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Your 12th percentage"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="interests">Areas of Interest *</label>
                <textarea
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Describe your interests, subjects you enjoy, career goals, etc."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cutoff">Expected Cutoff</label>
                  <input
                    type="number"
                    id="cutoff"
                    name="cutoff"
                    value={formData.cutoff}
                    onChange={handleInputChange}
                    min="0"
                    max="200"
                    step="0.01"
                    placeholder="Expected cutoff percentage"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="preferredDuration">Preferred Course Duration</label>
                  <select
                    id="preferredDuration"
                    name="preferredDuration"
                    value={formData.preferredDuration}
                    onChange={handleInputChange}
                  >
                    <option value="">Select duration</option>
                    <option value="3 years">3 Years (Bachelor's)</option>
                    <option value="4 years">4 Years (Engineering)</option>
                    <option value="5 years">5 Years (Integrated)</option>
                    <option value="2 years">2 Years (Diploma)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="budget">Budget Range (per year)</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                  >
                    <option value="">Select budget range</option>
                    <option value="Under 50,000">Under ₹50,000</option>
                    <option value="50,000 - 1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="1,00,000 - 2,00,000">₹1,00,000 - ₹2,00,000</option>
                    <option value="2,00,000 - 5,00,000">₹2,00,000 - ₹5,00,000</option>
                    <option value="Above 5,00,000">Above ₹5,00,000</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="additionalInfo">Additional Information</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any other preferences, constraints, or information you'd like to share..."
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <FaUniversity className="btn-icon" />
                    Get Recommendations
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {renderRecommendations()}
      </div>
    </div>
  );
};

export default CourseRecommendation;
