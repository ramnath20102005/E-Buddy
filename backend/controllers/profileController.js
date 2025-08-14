const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const LearningPathHistory = require("../models/LearningPathHistory");
const CareerPathHistory = require("../models/CareerPathHistory");

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
      bio: user.bio,
      skills: user.skills,
      interests: user.interests,
      achievements: user.achievements,
      certifications: user.certifications,
      educationLevel: user.educationLevel,
      phone: user.phone,
      location: user.location,
      linkedin: user.linkedin,
      github: user.github,
      website: user.website,
      experience: user.experience,
      profileImage: user.profileImage,
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
    // Update all profile fields
    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.skills = req.body.skills || user.skills;
    user.interests = req.body.interests || user.interests;
    user.achievements = req.body.achievements || user.achievements;
    user.certifications = req.body.certifications || user.certifications;
    user.educationLevel = req.body.educationLevel !== undefined ? req.body.educationLevel : user.educationLevel;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.linkedin = req.body.linkedin !== undefined ? req.body.linkedin : user.linkedin;
    user.github = req.body.github !== undefined ? req.body.github : user.github;
    user.website = req.body.website !== undefined ? req.body.website : user.website;
    user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
    user.profileImage = req.body.profileImage !== undefined ? req.body.profileImage : user.profileImage;
    
    // Mark profile as completed if essential fields are filled
    const hasEssentialFields = user.name && user.bio && user.skills && user.skills.length > 0;
    user.profileCompleted = hasEssentialFields;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      userId: updatedUser.userId,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      interests: updatedUser.interests,
      achievements: updatedUser.achievements,
      certifications: updatedUser.certifications,
      educationLevel: updatedUser.educationLevel,
      phone: updatedUser.phone,
      location: updatedUser.location,
      linkedin: updatedUser.linkedin,
      github: updatedUser.github,
      website: updatedUser.website,
      experience: updatedUser.experience,
      profileImage: updatedUser.profileImage,
      profileCompleted: updatedUser.profileCompleted
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get learning path history for current user
// @route   GET /api/profile/learning-history
// @access  Private
const getLearningHistory = asyncHandler(async (req, res) => {
  const history = await LearningPathHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(history);
});

// @desc    Get career path history for current user
// @route   GET /api/profile/career-history
// @access  Private
const getCareerHistory = asyncHandler(async (req, res) => {
  const history = await CareerPathHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(history);
});

module.exports = { getProfile, updateProfile, getLearningHistory, getCareerHistory };