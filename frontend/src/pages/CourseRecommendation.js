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

    // Function to format AI response with better visual elements
    const formatAIResponse = (response) => {
      if (!response) return 'No recommendations available.';

      let formattedResponse = response;

      // Add emojis and visual elements to common patterns
      formattedResponse = formattedResponse
        // Course recommendations
        .replace(/(\b)(Computer Science|Engineering|Medicine|Business|Arts|Science|Commerce)(\b)/gi, '$1🎓 $2$3')
        .replace(/(\b)(Bachelor|Master|PhD|Diploma|Certificate)(\b)/gi, '$1🎯 $2$3')
        
        // Colleges and universities
        .replace(/(\b)(IIT|NIT|AIIMS|Delhi University|Mumbai University|Bangalore University)(\b)/gi, '$1🏛️ $2$3')
        .replace(/(\b)(University|College|Institute|School)(\b)/gi, '$1🏫 $2$3')
        
        // Subjects and skills
        .replace(/(\b)(Mathematics|Physics|Chemistry|Biology|English|History|Geography)(\b)/gi, '$1📚 $2$3')
        .replace(/(\b)(Programming|Coding|Development|Design|Analysis|Research)(\b)/gi, '$1💻 $2$3')
        
        // Career aspects
        .replace(/(\b)(Career|Job|Employment|Salary|Growth|Opportunity)(\b)/gi, '$1💼 $2$3')
        .replace(/(\b)(Future|Prospects|Scope|Demand|Market)(\b)/gi, '$1🚀 $2$3')
        
        // Financial aspects
        .replace(/(\b)(Budget|Cost|Fee|Expense|Affordable|Expensive)(\b)/gi, '$1💰 $2$3')
        .replace(/(\b)(Scholarship|Financial Aid|Loan|Grant)(\b)/gi, '$1🎁 $2$3')
        
        // Location and region
        .replace(/(\b)(Delhi|Mumbai|Bangalore|Chennai|Kolkata|Hyderabad|Pune)(\b)/gi, '$1📍 $2$3')
        .replace(/(\b)(North|South|East|West|Central|India|International)(\b)/gi, '$1🌍 $2$3')
        
        // Time and duration
        .replace(/(\b)(Duration|Years|Months|Semester|Academic Year)(\b)/gi, '$1⏰ $2$3')
        .replace(/(\b)(Full-time|Part-time|Online|Distance|Regular)(\b)/gi, '$1📅 $2$3')
        
        // Quality indicators
        .replace(/(\b)(Excellent|Good|Best|Top|Reputed|Famous)(\b)/gi, '$1⭐ $2$3')
        .replace(/(\b)(Accredited|Recognized|Approved|Certified)(\b)/gi, '$1✅ $2$3')
        
        // Numbers and percentages
        .replace(/(\b)(\d+%)(\b)/g, '$1📊 $2$3')
        .replace(/(\b)(\d+ years?)(\b)/gi, '$1⏳ $2$3')
        
        // Lists and bullet points
        .replace(/^[-*]\s+/gm, '• ')
        .replace(/^(\d+)\.\s+/gm, '$1️⃣ ')
        
        // Headers and sections
        .replace(/^(.*?):\s*$/gm, '## 📋 $1:')
        .replace(/^(.*?)\n[-=]{3,}/gm, '## 🎯 $1')
        
        // Important keywords
        .replace(/(\b)(Important|Note|Remember|Consider|Advice)(\b)/gi, '$1💡 $2$3')
        .replace(/(\b)(Benefits|Advantages|Pros|Features)(\b)/gi, '$1✨ $2$3')
        .replace(/(\b)(Challenges|Disadvantages|Cons|Limitations)(\b)/gi, '$1⚠️ $2$3');

      // Convert structured data to tables
      formattedResponse = formattedResponse
        // Course details table
        .replace(
          /Course Details:?\s*\n((?:.*?\n)*?)(?=\n|$)/gi,
          (match, content) => {
            const lines = content.trim().split('\n').filter(line => line.trim());
            if (lines.length > 0) {
              let table = '\n📊 **Course Details:**\n\n';
              table += '| Aspect | Details |\n';
              table += '|--------|---------|\n';
              lines.forEach(line => {
                const [key, value] = line.split(':').map(s => s.trim());
                if (key && value) {
                  table += `| ${key} | ${value} |\n`;
                }
              });
              return table;
            }
            return match;
          }
        )
        
        // College recommendations table
        .replace(
          /(?:Recommended|Top|Best) Colleges?:?\s*\n((?:.*?\n)*?)(?=\n|$)/gi,
          (match, content) => {
            const lines = content.trim().split('\n').filter(line => line.trim());
            if (lines.length > 0) {
              let table = '\n🏛️ **Recommended Colleges:**\n\n';
              table += '| Rank | College Name | Location | Rating |\n';
              table += '|------|--------------|----------|--------|\n';
              lines.forEach((line, index) => {
                const parts = line.split(',').map(s => s.trim());
                const college = parts[0] || line;
                const location = parts[1] || 'N/A';
                const rating = parts[2] || '⭐⭐⭐⭐⭐';
                table += `| ${index + 1}️⃣ | ${college} | ${location} | ${rating} |\n`;
              });
              return table;
            }
            return match;
          }
        )
        
        // Career prospects table
        .replace(
          /Career Prospects?:?\s*\n((?:.*?\n)*?)(?=\n|$)/gi,
          (match, content) => {
            const lines = content.trim().split('\n').filter(line => line.trim());
            if (lines.length > 0) {
              let table = '\n💼 **Career Prospects:**\n\n';
              table += '| Job Role | Salary Range | Growth |\n';
              table += '|----------|--------------|--------|\n';
              lines.forEach(line => {
                const [role, salary, growth] = line.split('|').map(s => s.trim());
                if (role) {
                  table += `| ${role} | ${salary || 'Competitive'} | ${growth || 'High'} |\n`;
                }
              });
              return table;
            }
            return match;
          }
        );

      // Add visual separators and formatting
      formattedResponse = formattedResponse
        // Add stars for ratings
        .replace(/(\b)(5|4|3|2|1)(\s*stars?|\s*out of 5)/gi, (match, prefix, rating) => {
          const stars = '⭐'.repeat(parseInt(rating));
          return `${prefix}${stars}`;
        })
        
        // Add checkmarks for positive points
        .replace(/(\b)(Yes|Available|Included|Provided|Offered)(\b)/gi, '$1✅ $2$3')
        
        // Add warning signs for limitations
        .replace(/(\b)(No|Not|Limited|Restricted|Expensive|Difficult)(\b)/gi, '$1⚠️ $2$3')
        
        // Add money emoji for financial info
        .replace(/(\b)(₹|Rs\.?|INR|Dollar|USD)(\s*\d+)/gi, '$1💰 $2$3')
        
        // Add calendar for dates
        .replace(/(\b)(January|February|March|April|May|June|July|August|September|October|November|December)(\b)/gi, '$1📅 $2$3')
        
        // Add location for places
        .replace(/(\b)(City|State|Country|Region|Area|Zone)(\b)/gi, '$1📍 $2$3');

      // Add summary section with key highlights
      const summaryMatch = formattedResponse.match(/(?:Summary|Conclusion|Final Thoughts?):?\s*\n((?:.*?\n)*?)(?=\n|$)/i);
      if (summaryMatch) {
        const summary = summaryMatch[1].trim();
        const highlights = summary.split('\n').filter(line => line.trim()).slice(0, 5);
        
        let highlightsSection = '\n\n🎯 **Key Highlights:**\n\n';
        highlights.forEach((highlight, index) => {
          highlightsSection += `${index + 1}️⃣ ${highlight.trim()}\n`;
        });
        
        formattedResponse = formattedResponse.replace(summaryMatch[0], summaryMatch[0] + highlightsSection);
      }

      return formattedResponse;
    };

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
        
        <div className="recommendations-content enhanced">
          <div 
            className="ai-response-formatted"
            dangerouslySetInnerHTML={{ 
              __html: formatAIResponse(recommendations)
                .split('\n')
                .map(line => {
                  // Convert markdown-style headers to HTML
                  if (line.startsWith('## ')) {
                    return `<h3 class="ai-section-header">${line.substring(3)}</h3>`;
                  }
                  // Convert markdown-style bold to HTML
                  if (line.includes('**')) {
                    return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  }
                  // Convert bullet points
                  if (line.startsWith('• ')) {
                    return `<div class="ai-bullet-point">${line}</div>`;
                  }
                  // Convert numbered points
                  if (line.match(/^\d+️⃣\s/)) {
                    return `<div class="ai-numbered-point">${line}</div>`;
                  }
                  // Convert tables
                  if (line.includes('|')) {
                    return `<div class="ai-table-line">${line}</div>`;
                  }
                  // Convert regular text
                  if (line.trim()) {
                    return `<p class="ai-text">${line}</p>`;
                  }
                  return '<br>';
                })
                .join('')
            }}
          />
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

