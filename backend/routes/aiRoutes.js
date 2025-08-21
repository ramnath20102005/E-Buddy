const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const { protect } = require('../middleware/authMiddleware');
const LearningPathHistory = require("../models/LearningPathHistory");
const User = require("../models/User");
const LearningActivity = require("../models/LearningActivity");
const { generateTextFromPrompt } = require("../utils/nimClient");

dotenv.config();
// NVIDIA NIM is used for all AI endpoints

// Apply authentication to all AI routes
router.use(protect);
router.post("/learning-material", async (req, res) => {
  try {
    const { topic, level, duration, format } = req.body;
    console.log('🔍 Learning Material API - Request body:', { topic, level, duration, format });
    
    if (!topic || !level || !duration) {
      return res.status(400).json({ error: "Topic, level, and duration are required." });
    }

    // Validate topic is not empty or generic
    const trimmedTopic = topic?.trim();
    console.log('🔍 Topic validation - Original:', topic, 'Trimmed:', trimmedTopic, 'Length:', trimmedTopic?.length);
    
    if (!topic || !trimmedTopic || trimmedTopic === '' || trimmedTopic.toLowerCase() === 'learning topic') {
      console.log('🚨 Topic validation failed:', { topic, trimmedTopic });
      return res.status(400).json({ error: "Valid topic is required." });
    }

    // Get user's name
    const user = await User.findById(req.user._id);
    const userName = user?.name || 'there';
    
    console.log('🔍 Learning Material API - User:', userName, 'Topic:', topic);
    console.log('🔍 Learning Material API - Topic validation passed for:', topic);

    // Create a more specific and constrained prompt
    const topicUpperCase = topic.charAt(0).toUpperCase() + topic.slice(1);
    
    const prompt = `Create learning material for the subject: ${topic}

Subject: ${topic}
Level: ${level}  
Duration: ${duration}

Write educational content specifically about ${topic}. Do not write about any other subject.

Section 1: Introduction to ${topicUpperCase}
Explain what ${topic} is and why it's important to learn. Write 2-3 paragraphs specifically about ${topic}.

Section 2: Core Concepts of ${topicUpperCase}  
Describe the main ideas, principles, and fundamentals of ${topic}. Write 3-4 paragraphs about ${topic} concepts.

Section 3: Real-World Applications of ${topicUpperCase}
Explain how ${topic} is used practically and its benefits. Write 2-3 paragraphs about ${topic} applications.

For each section, add:
VIDEOS: [${topic} tutorial 1], [${topic} basics], [learn ${topic}]
RESOURCES: [${topic} guide - comprehensive resource], [${topic} reference - detailed information], [${topic} examples - practical cases]  
EXERCISE: [Practice activity for ${topic}]

Important: Every word must be about ${topic}. The subject is ${topic} - write only about ${topic}.`;

    console.log('🔍 Learning Material API - Generated prompt for topic:', topic);
    console.log('🔍 Full prompt being sent to AI:', prompt);
    
    const responseText = await generateTextFromPrompt(prompt);
    
    console.log('🔍 Raw AI response:', responseText.substring(0, 200) + '...');
    console.log('🔍 Learning Material API - Response generated for topic:', topic);
    
    // Validate that the AI response actually contains the requested topic
    const responseContainsTopic = responseText.toLowerCase().includes(topic.toLowerCase());
    if (!responseContainsTopic) {
      console.log('🚨 AI response validation failed - topic not found in response');
      console.log('🚨 Requested topic:', topic);
      console.log('🚨 AI response preview:', responseText.substring(0, 300));
      
      // Retry with a more aggressive prompt
      const retryPrompt = `MANDATORY: Write about ${topic} ONLY. Subject: ${topic}. 
      
      Write exactly about ${topic}:
      
      What is ${topic}?
      ${topic} is [explain ${topic} here]
      
      Key aspects of ${topic}:
      - [aspect 1 of ${topic}]
      - [aspect 2 of ${topic}]  
      - [aspect 3 of ${topic}]
      
      How to learn ${topic}:
      [explain learning ${topic}]
      
      VIDEOS: [${topic} tutorial], [${topic} guide], [${topic} basics]
      RESOURCES: [${topic} book - learn ${topic}], [${topic} course - master ${topic}]
      EXERCISE: [practice ${topic}]
      
      Topic: ${topic}. Write only about ${topic}.`;
      
      console.log('🔄 Retrying with aggressive prompt for topic:', topic);
      const retryResponse = await generateTextFromPrompt(retryPrompt);
      console.log('🔄 Retry response:', retryResponse.substring(0, 200) + '...');
      
      const personalizedResponse = `Hi ${userName}! Here's your learning material for ${topic}:\n\n${retryResponse}`;
      res.json({ response: personalizedResponse, material: personalizedResponse });
    } else {
      const personalizedResponse = `Hi ${userName}! Here's your learning material for ${topic}:\n\n${responseText}`;
      res.json({ response: personalizedResponse, material: personalizedResponse });
    }
  } catch (error) {
    console.error("🔴 Error:", error);
    res.status(500).json({ error: "Failed to generate learning material." });
  }
});

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

    // Create learning activity
    try {
      await LearningActivity.create({
        userId: req.user._id,
        activityType: 'learning-path',
        topic,
        title: `${topic} Learning Path`,
        level,
        category: 'Learning Path',
        difficulty: level === 'Beginner' ? 'Easy' : level === 'Intermediate' ? 'Medium' : 'Hard',
        duration,
        status: 'completed',
        progress: 100,
        completedAt: new Date(),
        metadata: { originalPathId: historyEntry._id }
      });
    } catch (error) {
      console.error('Error creating learning activity for learning path:', error);
      // Don't fail the learning path generation if learning activity creation fails
    }

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
    
    // Check if the query is website-related
    const isWebsiteRelated = checkIfWebsiteRelated(message);
    
    if (!isWebsiteRelated) {
      const response = `Hi ${userName}! I'm E-Buddy, your learning platform assistant. I can only help with questions about our website features like learning paths, quizzes, courses, assignments, profile management, and platform navigation. Please ask me something related to the E-Buddy learning platform.`;
      return res.json({ response });
    }

    // Create a specialized prompt for E-Buddy platform queries
    const specializedPrompt = `You are E-Buddy, an AI assistant specifically designed for the E-Buddy learning platform. You can ONLY answer questions related to:

1. Learning platform features (learning paths, quizzes, courses, assignments)
2. Account management (profile, settings, registration, login)
3. Platform navigation and how to use website features
4. Study materials and learning activities
5. Progress tracking and performance analytics
6. Technical support for platform issues

User question: "${message}"

Provide a helpful, friendly response focused ONLY on E-Buddy platform topics. If the question is not related to the learning platform, politely redirect the user to ask about platform features instead.

Keep responses concise and actionable. Always maintain a helpful, educational tone as a learning assistant.`;

    let aiResponse = await generateTextFromPrompt(specializedPrompt);
    
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

// Helper function to check if a message is website-related
const checkIfWebsiteRelated = (message) => {
  const websiteKeywords = [
    // Platform features
    'learning', 'course', 'quiz', 'assignment', 'study', 'lesson', 'tutorial', 'education',
    'profile', 'account', 'login', 'register', 'signup', 'password', 'settings',
    'dashboard', 'progress', 'score', 'grade', 'result', 'performance', 'analytics',
    'navigation', 'menu', 'page', 'website', 'platform', 'app', 'interface',
    
    // Learning activities
    'flashcard', 'material', 'content', 'video', 'exercise', 'practice', 'test',
    'difficulty', 'level', 'beginner', 'intermediate', 'advanced',
    'recommendation', 'suggest', 'path', 'journey', 'track',
    
    // Technical/support
    'error', 'bug', 'issue', 'problem', 'help', 'support', 'trouble', 'fix',
    'upload', 'download', 'submit', 'save', 'delete', 'update', 'edit',
    
    // General platform terms
    'e-buddy', 'ebuddy', 'buddy', 'assistant', 'chatbot', 'ai',
    'how to', 'how do i', 'where is', 'what is', 'can i', 'unable to'
  ];
  
  const messageLower = message.toLowerCase();
  
  // Check for direct website keywords
  const hasWebsiteKeywords = websiteKeywords.some(keyword => 
    messageLower.includes(keyword)
  );
  
  // Check for question patterns that are likely website-related
  const questionPatterns = [
    /how (to|do i|can i)/i,
    /where (is|can i find)/i,
    /what (is|does)/i,
    /why (is|does|can't)/i,
    /when (will|can)/i,
    /can i/i,
    /unable to/i,
    /having trouble/i,
    /not working/i
  ];
  
  const hasQuestionPattern = questionPatterns.some(pattern => 
    pattern.test(message)
  );
  
  // Consider greetings as website-related to allow conversation start
  const greetingPatterns = /^(hi|hello|hey|greetings|good morning|good afternoon|good evening)[,!.\s]*$/i;
  const isGreeting = greetingPatterns.test(message.trim());
  
  // Consider thanks/acknowledgments as website-related
  const acknowledgmentPatterns = /(thank|thanks|ok|okay|yes|no|sure)[\s!.]*$/i;
  const isAcknowledgment = acknowledgmentPatterns.test(message.trim());
  
  return hasWebsiteKeywords || (hasQuestionPattern && message.length > 10) || isGreeting || isAcknowledgment;
};

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