const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
const { protect } = require('../middleware/authMiddleware');
const CourseRecommendationHistory = require("../models/CourseRecommendationHistory");
const User = require("../models/User");

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ Error: Missing GEMINI_API_KEY in environment variables.");
}

// Apply authentication to all course recommendation routes
router.use(protect);

router.post("/generate", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const {
      name,
      age,
      region,
      interests,
      marks,
      cutoff,
      preferredDuration,
      budget,
      additionalInfo
    } = req.body;

    // Validate required fields
    if (!name || !age || !region || !interests || !marks) {
      return res.status(400).json({ error: "Name, age, region, interests, and marks are required." });
    }

    // Create a comprehensive prompt for Gemini API
    const prompt = `As an expert educational counselor, provide detailed course and college recommendations for a 12th pass student with the following profile:

Student Profile:
- Name: ${name}
- Age: ${age} years
- Preferred Region: ${region}
- 12th Marks: ${marks}%
- Areas of Interest: ${interests}
${cutoff ? `- Expected Cutoff: ${cutoff}%` : ''}
${preferredDuration ? `- Preferred Course Duration: ${preferredDuration}` : ''}
${budget ? `- Budget Range: ${budget} per year` : ''}
${additionalInfo ? `- Additional Information: ${additionalInfo}` : ''}

Please provide:

1. COURSE RECOMMENDATIONS:
   - 3-5 specific courses that match their interests and marks
   - Course duration and eligibility criteria
   - Future career prospects for each course
   - Required subjects in 12th for each course

2. COLLEGE RECOMMENDATIONS:
   - 5-8 colleges/universities in their preferred region (${region})
   - Include both government and private institutions
   - Admission criteria and cutoff trends
   - Fee structure and available scholarships
   - Infrastructure and placement statistics

3. ADMISSION STRATEGY:
   - Application process and important dates
   - Required documents and preparation tips
   - Alternative options if marks are below cutoff
   - Entrance exam recommendations if applicable

4. ADDITIONAL GUIDANCE:
   - Skill development suggestions
   - Internship and certification opportunities
   - Financial planning and scholarship options
   - Next steps and timeline

Format the response in a clear, structured manner with proper headings and bullet points. Make it easy to read and actionable for the student.`;

    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${GEMINI_API_KEY}`,
      { 
        contents: [{ 
          parts: [{ text: prompt }] 
        }] 
      },
      { 
        headers: { "Content-Type": "application/json" } 
      }
    );

    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    
    // Add personalized greeting
    const personalizedResponse = `Dear ${name},\n\n${responseText}`;

    // Save to history
    const historyEntry = new CourseRecommendationHistory({
      userId: req.user._id,
      studentName: name,
      age,
      region,
      interests,
      marks,
      cutoff: cutoff || 'Not specified',
      preferredDuration: preferredDuration || 'Not specified',
      budget: budget || 'Not specified',
      additionalInfo: additionalInfo || 'None',
      requestText: prompt,
      responseText: personalizedResponse,
    });

    await historyEntry.save();

    res.json({ 
      recommendations: personalizedResponse,
      message: "Course recommendations generated successfully!"
    });

  } catch (error) {
    console.error("🔴 Course Recommendation Error:", error);
    
    if (error.response?.status === 400) {
      return res.status(400).json({ error: "Invalid request to Gemini API. Please check your inputs." });
    }
    
    if (error.response?.status === 403) {
      return res.status(500).json({ error: "API key error. Please contact support." });
    }
    
    res.status(500).json({ error: "Failed to generate course recommendations. Please try again." });
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await CourseRecommendationHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(history);
  } catch (error) {
    console.error("🔴 Course Recommendation History Error:", error);
    res.status(500).json({ error: "Failed to fetch recommendation history." });
  }
});

module.exports = router;
