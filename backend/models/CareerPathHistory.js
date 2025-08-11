const mongoose = require('mongoose');

const careerPathHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  achievements: [{
    type: String
  }],
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
careerPathHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CareerPathHistory', careerPathHistorySchema);