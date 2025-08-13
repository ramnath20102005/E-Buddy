import React, { useState } from 'react';
import axios from 'axios';
import './CourseRecommendation.css';
import { 
  FaGraduationCap, 
  FaMapMarkerAlt, 
  FaStar, 
  FaUniversity, 
  FaBookOpen, 
  FaUser, 
  FaCalendarAlt, 
  FaGlobe, 
  FaChartLine, 
  FaClock, 
  FaMoneyBillWave,
  FaLightbulb,
  FaCheckCircle,
  FaArrowRight,
  FaHeart
} from 'react-icons/fa';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [formProgress, setFormProgress] = useState(0);

  const totalSteps = 4;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calculate form progress
    const filledFields = Object.values({ ...formData, [name]: value }).filter(val => val !== '').length;
    const progress = Math.round((filledFields / Object.keys(formData).length) * 100);
    setFormProgress(progress);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
      setCurrentStep(totalSteps + 1); // Show results
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError(err.response?.data?.error || 'Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
          <div className="step-number">{step}</div>
          <div className="step-label">
            {step === 1 && 'Basic Info'}
            {step === 2 && 'Academic'}
            {step === 3 && 'Preferences'}
            {step === 4 && 'Review'}
          </div>
        </div>
      ))}
    </div>
  );

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <div className="step-header">
              <FaUser className="step-icon" />
              <h3>Basic Information</h3>
              <p>Let's start with your personal details</p>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className="enhanced-input"
                  />
                  <FaUser className="input-icon" />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <div className="input-wrapper">
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
                    className="enhanced-input"
                  />
                  <FaCalendarAlt className="input-icon" />
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="region">Preferred Region *</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Delhi, Mumbai, Bangalore, etc."
                  className="enhanced-input"
                />
                <FaGlobe className="input-icon" />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <div className="step-header">
              <FaChartLine className="step-icon" />
              <h3>Academic Information</h3>
              <p>Tell us about your academic background</p>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="marks">12th Marks (%) *</label>
                <div className="input-wrapper">
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
                    className="enhanced-input"
                  />
                  <FaStar className="input-icon" />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="cutoff">Expected Cutoff</label>
                <div className="input-wrapper">
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
                    className="enhanced-input"
                  />
                  <FaChartLine className="input-icon" />
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="interests">Areas of Interest *</label>
              <div className="input-wrapper">
                <textarea
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Describe your interests, subjects you enjoy, career goals, etc."
                  className="enhanced-textarea"
                />
                <FaLightbulb className="input-icon textarea-icon" />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <div className="step-header">
              <FaClock className="step-icon" />
              <h3>Course Preferences</h3>
              <p>Help us understand your course requirements</p>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preferredDuration">Preferred Course Duration</label>
                <div className="input-wrapper">
                  <select
                    id="preferredDuration"
                    name="preferredDuration"
                    value={formData.preferredDuration}
                    onChange={handleInputChange}
                    className="enhanced-select"
                  >
                    <option value="">Select duration</option>
                    <option value="3 years">3 Years (Bachelor's)</option>
                    <option value="4 years">4 Years (Engineering)</option>
                    <option value="5 years">5 Years (Integrated)</option>
                    <option value="2 years">2 Years (Diploma)</option>
                  </select>
                  <FaClock className="input-icon" />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="budget">Budget Range (per year)</label>
                <div className="input-wrapper">
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="enhanced-select"
                  >
                    <option value="">Select budget range</option>
                    <option value="Under 50,000">Under ₹50,000</option>
                    <option value="50,000 - 1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="1,00,000 - 2,00,000">₹1,00,000 - ₹2,00,000</option>
                    <option value="2,00,000 - 5,00,000">₹2,00,000 - ₹5,00,000</option>
                    <option value="Above 5,00,000">Above ₹5,00,000</option>
                  </select>
                  <FaMoneyBillWave className="input-icon" />
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="additionalInfo">Additional Information</label>
              <div className="input-wrapper">
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any other preferences, constraints, or information you'd like to share..."
                  className="enhanced-textarea"
                />
                <FaBookOpen className="input-icon textarea-icon" />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-step">
            <div className="step-header">
              <FaCheckCircle className="step-icon" />
              <h3>Review & Submit</h3>
              <p>Please review your information before submitting</p>
            </div>
            
            <div className="review-summary">
              <div className="review-item">
                <span className="review-label">Name:</span>
                <span className="review-value">{formData.name}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Age:</span>
                <span className="review-value">{formData.age} years</span>
              </div>
              <div className="review-item">
                <span className="review-label">Region:</span>
                <span className="review-value">{formData.region}</span>
              </div>
              <div className="review-item">
                <span className="review-label">12th Marks:</span>
                <span className="review-value">{formData.marks}%</span>
              </div>
              <div className="review-item">
                <span className="review-label">Interests:</span>
                <span className="review-value">{formData.interests}</span>
              </div>
              {formData.cutoff && (
                <div className="review-item">
                  <span className="review-label">Expected Cutoff:</span>
                  <span className="review-value">{formData.cutoff}%</span>
                </div>
              )}
              {formData.preferredDuration && (
                <div className="review-item">
                  <span className="review-label">Course Duration:</span>
                  <span className="review-value">{formData.preferredDuration}</span>
                </div>
              )}
              {formData.budget && (
                <div className="review-item">
                  <span className="review-label">Budget Range:</span>
                  <span className="review-value">{formData.budget}</span>
                </div>
              )}
              {formData.additionalInfo && (
                <div className="review-item">
                  <span className="review-label">Additional Info:</span>
                  <span className="review-value">{formData.additionalInfo}</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderRecommendations = () => {
    if (!recommendations) return null;

    return (
      <div className="recommendations-container">
        <div className="recommendations-header">
          <h2 className="recommendations-title">
            <FaStar className="title-icon" />
            Your Personalized Course & College Recommendations
          </h2>
          <div className="recommendations-badge">
            <FaHeart className="badge-icon" />
            AI-Powered
          </div>
        </div>
        
        <div className="recommendations-content">
          {recommendations}
        </div>

        <div className="recommendations-footer">
          <div className="disclaimer">
            <FaLightbulb className="disclaimer-icon" />
            <div>
              <strong>Note:</strong> These recommendations are AI-generated based on your inputs. 
              Please verify all information with official sources before making decisions.
            </div>
          </div>
          <button 
            className="new-recommendation-btn"
            onClick={() => {
              setRecommendations(null);
              setCurrentStep(1);
              setFormProgress(0);
            }}
          >
            <FaArrowRight className="btn-icon" />
            Get New Recommendations
          </button>
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
          
          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${formProgress}%` }}
              ></div>
            </div>
            <span className="progress-text">{formProgress}% Complete</span>
          </div>
        </div>
      </div>

      <div className="page-container">
        {!recommendations ? (
          <div className="form-section">
            <div className="form-card">
              {renderStepIndicator()}
              
              <form onSubmit={handleSubmit} className="recommendation-form">
                {renderFormStep()}
                
                <div className="form-navigation">
                  {currentStep > 1 && (
                    <button 
                      type="button" 
                      className="nav-btn prev-btn"
                      onClick={prevStep}
                    >
                      ← Previous
                    </button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <button 
                      type="button" 
                      className="nav-btn next-btn"
                      onClick={nextStep}
                    >
                      Next →
                    </button>
                  ) : (
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
                  )}
                </div>
              </form>
            </div>
          </div>
        ) : null}

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

