const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
const { protect } = require('../middleware/authMiddleware');
const CareerPathHistory = require("../models/CareerPathHistory");
const User = require("../models/User");

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ Error: Missing GEMINI_API_KEY in environment variables.");
}

// Apply authentication to all career routes
router.use(protect);

router.post("/generate", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const skills = user.skills?.length ? user.skills.join(", ") : "Not specified";
    const interests = user.interests?.length ? user.interests.join(", ") : "Not specified";
    const achievements = user.achievements?.length ? user.achievements.join(", ") : "None";

    const prompt = `Generate a career path based on:
      Skills - ${skills},
      Interests - ${interests},
      Achievements - ${achievements}.
      Provide a detailed career path with future Trends.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    
    // Add personalized greeting
    const userName = user.name || 'there';
    const personalizedResponse = `Hi ${userName}! Here's your personalized career path:\n\n${responseText}`;

    const historyEntry = new CareerPathHistory({
      userId: req.user._id,
      skills: user.skills,
      interests: user.interests,
      achievements: user.achievements,
      requestText: prompt,
      responseText: personalizedResponse, // Store personalized response
    });

    await historyEntry.save();
    res.json({ response: personalizedResponse });
  } catch (error) {
    console.error("🔴 Career Path Error:", error);
    res.status(500).json({ error: "Failed to generate career path." });
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await CareerPathHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error("🔴 Career History Error:", error);
    res.status(500).json({ error: "Failed to fetch career history." });
  }
});

module.exports = router;