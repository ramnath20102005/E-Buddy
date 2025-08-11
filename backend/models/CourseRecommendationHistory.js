const mongoose = require('mongoose');

const courseRecommendationHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  interests: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  cutoff: {
    type: String,
    default: 'Not specified'
  },
  preferredDuration: {
    type: String,
    default: 'Not specified'
  },
  budget: {
    type: String,
    default: 'Not specified'
  },
  additionalInfo: {
    type: String,
    default: 'None'
  },
  requestText: {
    type: String,
    required: true
  },
  responseText: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
courseRecommendationHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CourseRecommendationHistory', courseRecommendationHistorySchema);
