const express = require('express');
const { signup, login } = require('../controllers/authController');
const router = express.Router();

// Signup route
router.post('/signup', signup);
router.post('/register', signup); // Add register alias for frontend

// Login route
router.post('/login', login);

module.exports = router; // ✅ Ensure you export the router
