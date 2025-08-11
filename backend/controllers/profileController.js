const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    res.json({
      _id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      skills: user.skills,
      interests: user.interests,
      achievements: user.achievements,
      profileCompleted: user.profileCompleted
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.skills = req.body.skills || user.skills;
    user.interests = req.body.interests || user.interests;
    user.achievements = req.body.achievements || user.achievements;
    user.profileCompleted = true;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      userId: updatedUser.userId,
      name: updatedUser.name,
      email: updatedUser.email,
      skills: updatedUser.skills,
      interests: updatedUser.interests,
      achievements: updatedUser.achievements,
      profileCompleted: updatedUser.profileCompleted
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = { getProfile, updateProfile };