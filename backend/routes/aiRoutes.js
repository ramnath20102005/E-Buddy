const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
const { protect } = require('../middleware/authMiddleware');
const LearningPathHistory = require("../models/LearningPathHistory");
const User = require("../models/User");

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ Error: Missing GEMINI_API_KEY in environment variables.");
}

async function callGeminiAPI(prompt) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
  } catch (error) {
    console.error("🔴 Gemini API Error:", error.response?.data || error.message);
    throw error;
  }
}

// Apply authentication to all AI routes
router.use(protect);

router.post("/learning-path", async (req, res) => {
  try {
    const { topic, level, duration } = req.body;
    if (!topic || !level || !duration) {
      return res.status(400).json({ error: "Topic, level, and duration are required." });
    }

    const prompt = `Give a detailed learning path for ${topic} at a ${level} level for a duration of ${duration}.`;
    const responseText = await callGeminiAPI(prompt);

    const historyEntry = new LearningPathHistory({
      userId: req.user._id,
      topic,
      level,
      duration,
      requestText: prompt,
      responseText,
    });

    await historyEntry.save();
    res.json({ response: responseText });
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
    const response = await callGeminiAPI(prompt);
    
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
    const response = await callGeminiAPI(prompt);
    
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
    const response = await callGeminiAPI(prompt);
    
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

    console.log("💬 Chatbot Message Request:", message);
    const responseText = await callGeminiAPI(message);
    
    res.json({ response: responseText });
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