const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const dietRoutes = require('./routes/diet');
const progressRoutes = require('./routes/progress');
const planRoutes = require('./routes/plans');

const app = express();

// 1. Parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    const bodyClone = { ...req.body };
    if (bodyClone.password) bodyClone.password = '********';
    console.log('Body:', bodyClone);
  }
  next();
});

// 3. Security
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));

// 4. Rate limiting - applied to all /api routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// 5. Static files
app.use('/uploads', express.static('uploads'));

// 6. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/plans', planRoutes);

// 7. Health checks
app.get('/health', (req, res) => res.json({ status: 'NEON FIT API running 🔥' }));
app.get('/api/health', (req, res) => res.json({ status: 'NEON FIT API running 🔥' }));

// 8. 404 Handler for /api routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// 9. Global Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NEON FIT server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));
