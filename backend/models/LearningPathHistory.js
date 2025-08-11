const mongoose = require('mongoose');

const learningPathHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
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
learningPathHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('LearningPathHistory', learningPathHistorySchema);
