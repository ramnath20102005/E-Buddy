const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const LearningActivity = require('../models/LearningActivity');
const User = require('../models/User');
const LearningPathHistory = require('../models/LearningPathHistory');
const CourseRecommendationHistory = require('../models/CourseRecommendationHistory');

// Get all learning activities for a user
router.get('/', protect, async (req, res) => {
  try {
    const { status, activityType, category, search } = req.query;
    const userId = req.user.id;

    // Build filter object
    const filter = { userId };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (activityType && activityType !== 'all') {
      filter.activityType = activityType;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { topic: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const activities = await LearningActivity.find(filter)
      .sort({ lastAccessedAt: -1 })
      .limit(50);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching learning activities:', error);
    res.status(500).json({ error: 'Failed to fetch learning activities' });
  }
});

// Get learning activity statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await LearningActivity.getUserStats(userId);
    
    // Get recent activities count
    const recentActivities = await LearningActivity.countDocuments({
      userId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Get categories breakdown
    const categories = await LearningActivity.aggregate([
      { $match: { userId: new (require('mongoose').Types.ObjectId)(userId) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      ...stats,
      recentActivities,
      categories,
      completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    });
  } catch (error) {
    console.error('Error fetching learning activity stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Create a new learning activity
router.post('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      activityType,
      topic,
      title,
      level,
      category,
      difficulty,
      duration,
      description,
      materials,
      tags
    } = req.body;

    const activity = new LearningActivity({
      userId,
      activityType,
      topic,
      title,
      level,
      category,
      difficulty,
      duration,
      description,
      materials,
      tags
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating learning activity:', error);
    res.status(500).json({ error: 'Failed to create learning activity' });
  }
});

// Update learning activity progress
router.patch('/:id/progress', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, timeSpent } = req.body;
    const userId = req.user.id;

    const activity = await LearningActivity.findOne({ _id: id, userId });
    
    if (!activity) {
      return res.status(404).json({ error: 'Learning activity not found' });
    }

    if (progress !== undefined) {
      await activity.updateProgress(progress);
    }

    if (timeSpent) {
      activity.timeSpent = timeSpent;
      await activity.save();
    }

    res.json(activity);
  } catch (error) {
    console.error('Error updating learning activity progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Update learning activity score (for quizzes)
router.patch('/:id/score', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { score, totalQuestions, correctAnswers } = req.body;
    const userId = req.user.id;

    const activity = await LearningActivity.findOne({ _id: id, userId });
    
    if (!activity) {
      return res.status(404).json({ error: 'Learning activity not found' });
    }

    await activity.updateScore(score, totalQuestions, correctAnswers);
    res.json(activity);
  } catch (error) {
    console.error('Error updating learning activity score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// Delete a learning activity
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const activity = await LearningActivity.findOneAndDelete({ _id: id, userId });
    
    if (!activity) {
      return res.status(404).json({ error: 'Learning activity not found' });
    }

    res.json({ message: 'Learning activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting learning activity:', error);
    res.status(500).json({ error: 'Failed to delete learning activity' });
  }
});

// Sync existing data from other collections
router.post('/sync', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Sync quiz history from User model
    const user = await User.findById(userId);
    if (user && user.quizHistory && user.quizHistory.length > 0) {
      for (const quiz of user.quizHistory) {
        const existingActivity = await LearningActivity.findOne({
          userId,
          activityType: 'quiz',
          topic: quiz.topic,
          'metadata.originalQuizId': quiz._id
        });

        if (!existingActivity) {
          const score = quiz.totalQuestions > 0 ? Math.round((quiz.score / quiz.totalQuestions) * 100) : 0;
          
          await LearningActivity.create({
            userId,
            activityType: 'quiz',
            topic: quiz.topic,
            title: `${quiz.topic} Quiz`,
            level: 'Beginner', // Default level
            category: 'Assessment',
            difficulty: score >= 80 ? 'Easy' : score >= 60 ? 'Medium' : 'Hard',
            duration: '15 min',
            timeSpent: '15 min',
            status: 'completed',
            progress: 100,
            score,
            totalQuestions: quiz.totalQuestions,
            correctAnswers: quiz.score,
            completedAt: quiz.date,
            metadata: { originalQuizId: quiz._id }
          });
        }
      }
    }

    // Sync learning path history
    const learningPaths = await LearningPathHistory.find({ userId });
    for (const path of learningPaths) {
      const existingActivity = await LearningActivity.findOne({
        userId,
        activityType: 'learning-path',
        topic: path.topic,
        'metadata.originalPathId': path._id
      });

      if (!existingActivity) {
        await LearningActivity.create({
          userId,
          activityType: 'learning-path',
          topic: path.topic,
          title: `${path.topic} Learning Path`,
          level: path.level,
          category: 'Learning Path',
          difficulty: path.level === 'Beginner' ? 'Easy' : path.level === 'Intermediate' ? 'Medium' : 'Hard',
          duration: path.duration,
          status: 'completed',
          progress: 100,
          completedAt: path.createdAt,
          metadata: { originalPathId: path._id }
        });
      }
    }

    // Sync course recommendation history
    const courseRecommendations = await CourseRecommendationHistory.find({ userId });
    for (const rec of courseRecommendations) {
      const existingActivity = await LearningActivity.findOne({
        userId,
        activityType: 'course-recommendation',
        topic: rec.interests,
        'metadata.originalRecId': rec._id
      });

      if (!existingActivity) {
        await LearningActivity.create({
          userId,
          activityType: 'course-recommendation',
          topic: rec.interests,
          title: `Course Recommendation for ${rec.interests}`,
          level: 'Beginner',
          category: 'Course Recommendation',
          difficulty: 'Medium',
          duration: '30 min',
          status: 'completed',
          progress: 100,
          completedAt: rec.createdAt,
          metadata: { originalRecId: rec._id }
        });
      }
    }

    res.json({ message: 'Data sync completed successfully' });
  } catch (error) {
    console.error('Error syncing learning activities:', error);
    res.status(500).json({ error: 'Failed to sync learning activities' });
  }
});

module.exports = router;
