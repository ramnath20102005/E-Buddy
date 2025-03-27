const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

router.route('/')
  .get(protect, getProfile)
  .put(protect, updateProfile); // Ensure PUT method is properly defined

module.exports = router;