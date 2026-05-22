const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Health Checks (TOP PRIORITY)
app.get('/api/health', (req, res) => res.json({ status: 'Backend Working' }));
app.get('/', (req, res) => res.send('NEON FIT Backend Live Version 5.0 🚀 - Use /api for all requests'));

// 3. Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// 4. Import & Mount Routes
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workouts');
const dietRoutes = require('./routes/diet');
const progressRoutes = require('./routes/progress');
const planRoutes = require('./routes/plans');

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/plans', planRoutes);

// Static files
app.use('/uploads', express.static('uploads'));

// 5. 404 Handler
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: `Route ${req.originalUrl} not found on this server.` });
});

// 6. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NEON FIT server running on port ${PORT}`);
});

// 7. MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));
