import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDbStatus } from './config/db.js';
import { dbStore } from './services/storage.js';

// Import Route Handlers
import authRoutes from './routes/auth.js';
import topicRoutes from './routes/topics.js';
import questionRoutes from './routes/questions.js';
import assessmentRoutes from './routes/assessment.js';
import adaptiveRoutes from './routes/adaptive.js';
import tutorRoutes from './routes/tutor.js';
import roadmapRoutes from './routes/roadmap.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Global Middleware
app.use(cors({
  origin: '*', // Permissive for smooth local frontend-backend development
  credentials: true
}));
app.use(express.json());

// Request logger for local dev transparency
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.path}`);
  }
  next();
});

// Health & Diagnostic Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: 'healthy',
    platform: 'LearnLoop AI Intelligent Adaptive Learning Platform',
    version: '1.0.0-hackathon',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '')
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/adaptive', adaptiveRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    path: req.path
  });
});

// Server Initialization
const startServer = async () => {
  try {
    // 1. Connect or activate DB
    await connectDB();

    // 2. Initialize in-memory / cache data layer
    await dbStore.initialize();

    // 3. Start Express HTTP Listener
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 LearnLoop AI Backend listening on http://localhost:${PORT}`);
      console.log(`⚡ Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🎯 Demo User: alex@learnloop.ai (Password: password123)`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Fatal initialization error:', err);
    process.exit(1);
  }
};

startServer();

