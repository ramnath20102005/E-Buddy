const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Apply authentication to all profile routes
router.use(protect);

// Get user profile
router.get('/', getProfile);

// Update user profile
router.put('/', updateProfile);

module.exports = router;