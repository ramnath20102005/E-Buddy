const mongoose = require('mongoose');

const learningActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    enum: ['quiz', 'learning-path', 'course-recommendation', 'study-material', 'career-path'],
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  duration: {
    type: String,
    default: '30 min'
  },
  timeSpent: {
    type: String,
    default: '0 min'
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  totalQuestions: {
    type: Number,
    default: null
  },
  correctAnswers: {
    type: Number,
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  materials: [{
    title: String,
    url: String,
    type: String
  }],
  tags: [{
    type: String
  }],
  completedAt: {
    type: Date,
    default: null
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
learningActivitySchema.index({ userId: 1, createdAt: -1 });
learningActivitySchema.index({ userId: 1, status: 1 });
learningActivitySchema.index({ userId: 1, activityType: 1 });
learningActivitySchema.index({ userId: 1, category: 1 });

// Virtual for calculating time spent in minutes
learningActivitySchema.virtual('timeSpentMinutes').get(function() {
  if (!this.timeSpent) return 0;
  const match = this.timeSpent.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
});

// Method to update progress
learningActivitySchema.methods.updateProgress = function(newProgress) {
  this.progress = Math.min(100, Math.max(0, newProgress));
  if (this.progress === 100) {
    this.status = 'completed';
    this.completedAt = new Date();
  } else if (this.progress > 0) {
    this.status = 'in-progress';
  }
  this.lastAccessedAt = new Date();
  return this.save();
};

// Method to update score
learningActivitySchema.methods.updateScore = function(score, totalQuestions, correctAnswers) {
  this.score = score;
  this.totalQuestions = totalQuestions;
  this.correctAnswers = correctAnswers;
  this.progress = 100;
  this.status = 'completed';
  this.completedAt = new Date();
  this.lastAccessedAt = new Date();
  return this.save();
};

// Static method to get user statistics
learningActivitySchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
        notStarted: { $sum: { $cond: [{ $eq: ['$status', 'not-started'] }, 1, 0] } },
        totalTimeSpent: { $sum: '$timeSpentMinutes' },
        averageScore: { $avg: '$score' }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    totalTimeSpent: 0,
    averageScore: 0
  };
};

module.exports = mongoose.model('LearningActivity', learningActivitySchema);
