import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/config/db.js';
import { getEncryptionKey } from './src/utils/encryption.js';

dotenv.config();

// Fail fast instead of starting with an ephemeral answer-encryption key.
getEncryptionKey();

// Connect to Database
import { seedInitialData } from './src/utils/seedAdmin.js';
import seedSettings from './src/utils/seedSettings.js';

import authRoutes from './src/routes/authRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import quizRoutes from './src/routes/quizRoutes.js';
import sessionRoutes from './src/routes/sessionRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import settingRoutes from './src/routes/settingRoutes.js';
import feedbackRoutes from './src/routes/feedbackRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
const app = express();

// Set up promises for top level
connectDB().then(() => {
  seedInitialData();
  seedSettings();
});

// Middleware
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', sessionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running...' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.use((error, req, res, next) => {
  console.error('Unhandled API error:', error);
  if (res.headersSent) return next(error);
  res.status(error.statusCode || 500).json({ message: 'Internal server error' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
