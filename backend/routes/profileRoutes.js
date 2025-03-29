const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');
const LearningPathHistory = require('../models/LearningPathHistory');
const CareerPathHistory = require('../models/CareerPathHistory');

router.route('/')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.get('/learning-history', protect, async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id);
    const history = await LearningPathHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/career-history', protect, async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id);
    const history = await CareerPathHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;