const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const { protect } = require('../middleware/authMiddleware');
const LearningPathHistory = require("../models/LearningPathHistory");
const User = require("../models/User");
const { generateTextFromPrompt } = require("../utils/nimClient");

dotenv.config();
// NVIDIA NIM is used for all AI endpoints

// Apply authentication to all AI routes
router.use(protect);
router.post("/learning-path", async (req, res) => {
  try {
    const { topic, level, duration } = req.body;
    if (!topic || !level || !duration) {
      return res.status(400).json({ error: "Topic, level, and duration are required." });
    }

    // Get user's name
    const user = await User.findById(req.user._id);
    const userName = user?.name || 'there';

    const prompt = `Give a detailed learning path for ${topic} at a ${level} level for a duration of ${duration}. Provide structured paragraphs (e.g., if duration is one hour, split into minute-wise segments). Return plain text without special characters for headings. Use the format: topic (time period and title) followed by content (what to do in that topic).`;

    const responseText = await generateTextFromPrompt(prompt);
    const personalizedResponse = `Hi ${userName}! Here's your learning path:\n\n${responseText}`;

    const historyEntry = new LearningPathHistory({
      userId: req.user._id,
      topic,
      level,
      duration,
      requestText: prompt,
      responseText: personalizedResponse, // Store personalized response
    });

    await historyEntry.save();
    res.json({ response: personalizedResponse });
  } catch (error) {
    console.error("🔴 Error:", error);
    res.status(500).json({ error: "Failed to generate learning path." });
  }
});

router.post("/summarize", async (req, res) => {
  try {
    const { topic, bullets } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required." });
    }

    const prompt = `Provide ${bullets || 5} concise bullet points summarizing ${topic}.`;
    const response = await generateTextFromPrompt(prompt);
    
    res.json({ summary: response });
  } catch (error) {
    console.error("🔴 Error:", error);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

router.post("/flashcards", async (req, res) => {
  try {
    const { topic, count } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required." });
    }

    const prompt = `Create ${count || 5} flashcards about ${topic}. Format as: Q: question\nA: answer\n\n`;
    const response = await generateTextFromPrompt(prompt);
    
    res.json({ flashcards: response });
  } catch (error) {
    console.error("🔴 Error:", error);
    res.status(500).json({ error: "Failed to generate flashcards." });
  }
});

router.post("/quiz", async (req, res) => {
  try {
    const { topic, questions } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required." });
    }

    const prompt = `Generate ${questions || 5} multiple-choice questions about ${topic}. Format each as: Q: [question]\nA) [option1]\nB) [option2]\nC) [option3]\nD) [option4]\nAnswer: [correct letter]\n\n`;
    const response = await generateTextFromPrompt(prompt);
    
    res.json({ quiz: response });
  } catch (error) {
    console.error("🔴 Error:", error);
    res.status(500).json({ error: "Failed to generate quiz." });
  }
});

router.post("/chatbot", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const user = await User.findById(req.user._id);
    const userName = user?.name || 'there';
    
    let aiResponse = await generateTextFromPrompt(message);
    
    // Check if response already contains a greeting
    const hasGreeting = /^(hi|hello|hey|greetings)[,!]?/i.test(aiResponse);
    const response = hasGreeting 
      ? aiResponse.replace(/^(hi|hello|hey|greetings)[,!]?\s*/i, `$& ${userName}, `)
      : `Hi ${userName}! ${aiResponse}`;
    
    res.json({ response });
  } catch (error) {
    console.error("🔴 Chatbot Error:", error);
    res.status(500).json({ error: "Failed to generate chatbot response." });
  }
});

router.get("/learning-path/history", async (req, res) => {
  try {
    const history = await LearningPathHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error("🔴 Error:", error);
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

// Additional endpoint for getting user-specific history by type
router.get("/history/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['learning-path', 'summarize', 'flashcards', 'quiz', 'chatbot'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid history type." });
    }

    let history;
    if (type === 'learning-path') {
      history = await LearningPathHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    } else {
      // Add other history types here if you have separate collections
      history = []; // Placeholder for other history types
    }

    res.json(history);
  } catch (error) {
    console.error("🔴 Error:", error);
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

module.exports = router;