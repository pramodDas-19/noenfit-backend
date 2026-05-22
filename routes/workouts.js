const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const router = express.Router();

const { WorkoutLog } = require('../models');

// Log today's workout
router.post('/', auth, async (req, res) => {
  try {
    const log = await WorkoutLog.create({ ...req.body, user: req.user.id });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get workouts (with optional date filter)
router.get('/', auth, async (req, res) => {
  const { startDate, endDate, limit = 30 } = req.query;
  const query = { user: req.user.id };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  const logs = await WorkoutLog.find(query).sort({ date: -1 }).limit(Number(limit));
  res.json(logs);
});

// Get today's workout
router.get('/today', auth, async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const log = await WorkoutLog.findOne({ user: req.user.id, date: { $gte: today, $lt: tomorrow } });
  res.json(log);
});

// Update workout (log sets/reps)
router.patch('/:id', auth, async (req, res) => {
  try {
    const log = await WorkoutLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!log) return res.status(404).json({ error: 'Workout not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Weekly summary
router.get('/summary/weekly', auth, async (req, res) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const logs = await WorkoutLog.find({ user: req.user.id, date: { $gte: weekAgo } });
  res.json({ total: logs.length, completed: logs.filter(l => l.completed).length, logs });
});

module.exports = router;
