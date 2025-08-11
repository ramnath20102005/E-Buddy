# Backend Setup Guide

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
MONGO_URI=mongodb://localhost:27017/ebuddy
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
PORT=5000
```

### Required Variables:

1. **MONGO_URI**: MongoDB connection string
   - Local: `mongodb://localhost:27017/ebuddy`
   - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/ebuddy`

2. **JWT_SECRET**: Secret key for JWT token generation
   - Generate a strong random string
   - Example: `mySuperSecretKey123!@#`

3. **GEMINI_API_KEY**: Google Gemini API key
   - Get from: https://makersuite.google.com/app/apikey
   - Required for AI-powered features

4. **NODE_ENV**: Environment mode
   - `development` for local development
   - `production` for production deployment

5. **PORT**: Server port (optional, defaults to 5000)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start MongoDB service

3. Create `.env` file with above variables

4. Start the server:
   ```bash
   npm start
   ```

## Features

- User authentication (signup/login)
- Profile management
- AI-powered learning paths
- Career guidance
- Course recommendations
- Quiz system
- Study materials

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/ai/learning-path` - Generate learning path
- `POST /api/career/generate` - Generate career path
- `POST /api/course-recommendation/generate` - Course recommendations
- `POST /api/quiz` - Generate quiz questions
