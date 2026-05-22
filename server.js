const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. Import Routes
// Ensure this file exists at ./routes/authRoutes.js
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workouts');
const dietRoutes = require('./routes/diet');
const progressRoutes = require('./routes/progress');
const planRoutes = require('./routes/plans');

const app = express();

// 2. Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Health Check (Defined BEFORE any complex routing)
app.get('/api/health', (req, res) => res.json({ status: 'Backend Working', version: '8.0' }));
app.get('/health', (req, res) => res.json({ status: 'Backend Working', version: '8.0' }));

// 4. Root Endpoint (To verify deployment)
app.get('/', (req, res) => res.send('<h1>NEON FIT Backend Live Version 8.0 🚀</h1><p>API is running correctly.</p>'));

// 5. Mount API Routes
// We mount them under /api as requested
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/plans', planRoutes);

// 6. Static files
app.use('/uploads', express.static('uploads'));

// 7. Global 404 Handler (MUST BE LAST)
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl,
    message: 'Check if you are missing the /api prefix or have a typo.'
  });
});

// 8. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NEON FIT server running on port ${PORT}`);
});

// 9. MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));