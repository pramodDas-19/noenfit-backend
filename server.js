const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const dietRoutes = require('./routes/diet');
const progressRoutes = require('./routes/progress');
const planRoutes = require('./routes/plans');

const app = express();

// Enable CORS for all requests
app.use(cors({ origin: '*', credentials: true }));

// Parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Root / Health check
app.get('/', (req, res) => res.send('NEON FIT Backend Live Version 3.0 🚀 - Use /api prefix for routes'));
app.get('/health', (req, res) => res.json({ status: 'OK', message: 'Main endpoint running' }));

// IMPORTANT: Mount all routes under /api
const apiRouter = express.Router();
apiRouter.get('/health', (req, res) => res.json({ status: 'OK', message: 'API endpoint running' }));
apiRouter.use('/auth', authRoutes);
apiRouter.use('/workouts', workoutRoutes);
apiRouter.use('/diet', dietRoutes);
apiRouter.use('/progress', progressRoutes);
apiRouter.use('/plans', planRoutes);

app.use('/api', apiRouter);

// Serve uploads
app.use('/uploads', express.static('uploads'));

// Global 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({ error: `Path ${req.originalUrl} not found on this server.` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NEON FIT server running on port ${PORT}`);
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));
