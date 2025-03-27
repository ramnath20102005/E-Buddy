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

  // Remove default image assignment - let frontend handle it
  // Just return the user data as-is
  res.json(user);
});

// @desc    Update user profile
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

  // Handle array fields
  if (skills) {
    user.skills = Array.isArray(skills) ? skills : 
                  typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : 
                  [];
  }
  
  if (interests) {
    user.interests = Array.isArray(interests) ? interests : 
                    typeof interests === 'string' ? interests.split(',').map(i => i.trim()) : 
                    [];
  }
  
  if (achievements) {
    user.achievements = Array.isArray(achievements) ? achievements : 
                       typeof achievements === 'string' ? achievements.split(',').map(a => a.trim()) : 
                       [];
  }

  // Handle profile image (accepts Base64 or null)
  if (profileImage !== undefined) {
    user.profileImage = profileImage || null; // Explicitly set to null if empty
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
});

module.exports = { getProfile, updateProfile };