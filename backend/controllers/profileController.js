const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // ✅ Ensure default profile image is used when missing
  user.profileImage = user.profileImage || '/default-profile.jpg';

  res.json(user);
});


// @desc    Update user profile (Now Supports Base64 Image)
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update fields
  const { name, bio, skills, interests, achievements, profileImage } = req.body;

  if (name) user.name = name;
  if (bio) user.bio = bio;

  // Handle skills, interests, and achievements as arrays
  if (skills) {
    user.skills = Array.isArray(skills) ? skills : [skills];
  }
  if (interests) {
    user.interests = Array.isArray(interests) ? interests : [interests];
  }
  if (achievements) {
    user.achievements = Array.isArray(achievements) ? achievements : [achievements];
  }

  // ✅ Store Base64 image directly in the database
  if (profileImage) {
    user.profileImage = profileImage; // Expecting Base64 string from frontend
  }

  // Save the updated user
  const updatedUser = await user.save();

  res.json(updatedUser);
});

module.exports = { getProfile, updateProfile };
