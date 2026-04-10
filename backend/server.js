import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/config/db.js';

dotenv.config();

// Connect to Database
import { seedInitialData } from './src/utils/seedAdmin.js';
import seedSettings from './src/utils/seedSettings.js';

import authRoutes from './src/routes/authRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import quizRoutes from './src/routes/quizRoutes.js';
import attemptRoutes from './src/routes/attemptRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import settingRoutes from './src/routes/settingRoutes.js';
import feedbackRoutes from './src/routes/feedbackRoutes.js';
import chatbotRoutes from './src/routes/chatbotRoutes.js';
const app = express();

// Set up promises for top level
connectDB().then(() => {
  seedInitialData();
  seedSettings();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
