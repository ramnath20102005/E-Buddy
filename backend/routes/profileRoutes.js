const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');
const router = express.Router();

// Profile routes
router.route('/').get(protect, getProfile).put(protect, updateProfile);

module.exports = router;