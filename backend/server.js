const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errormiddleware');

// Load environment variables first
dotenv.config();

// Environment variables loaded successfully

connectDB();

// Import routes after environment variables are loaded
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const aiRoutes = require('./routes/aiRoutes');
const careerRoutes = require('./routes/careerRoutes');
const QuizRoutes = require('./routes/QuizRoutes');
const courseRecommendationRoutes = require('./routes/courseRecommendationRoutes');
const learningActivityRoutes = require('./routes/learningActivityRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const corsOptions = {
  origin: true, // Temporarily allow all origins for immediate fix
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Additional CORS headers as fallback
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://e-buddy-frontend.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/api/ai", aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', QuizRoutes); // Mounted correctly
app.use('/api/career', careerRoutes);
app.use('/api/course-recommendation', courseRecommendationRoutes);
app.use('/api/learning-activities', learningActivityRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'production';

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${MODE} mode`);
});