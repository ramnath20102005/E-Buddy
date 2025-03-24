require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(MONGO_URI, {})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Chatbot API (Using Gemini AI)
app.post("/chatbot", async (req, res) => {
  const { message } = req.body;
  console.log("📩 Received chatbot request:", message);

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("🔵 Sending to Gemini AI:", message);
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: message }] }],
      }
    );

    console.log("🟢 Gemini AI Response:", response.data);
    res.json({ reply: response.data.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error("🔴 Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("🔥 Google Gemini AI-Powered Chatbot API is running!");
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));