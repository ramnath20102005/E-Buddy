const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// 🔹 Generate unique userId
const generateUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`;

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Generate unique userId (stored permanently)
  const userId = generateUserId();

  // Create user
  const user = await User.create({
    userId, // ✅ Storing generated userId
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      userId: user.userId, // ✅ Send userId for history tracking
      name: user.name,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      userId: user.userId, // ✅ Send userId for history tracking
      name: user.name || "",
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

module.exports = { signup, login };
