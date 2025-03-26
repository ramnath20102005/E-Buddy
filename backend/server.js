const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // ✅ Fixed import

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logs HTTP requests in development
}

app.use(express.json({ limit: '10mb' })); // Increase JSON payload size
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Increase URL-encoded payload size
app.use(cors());

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public'))); // Default profile images
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Uploaded profile images

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'production';

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${MODE} mode`);
});
