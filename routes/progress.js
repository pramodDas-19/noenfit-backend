const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const { ProgressLog } = require('../models');

router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body, user: req.user.id };
    if (req.file) data.photo = req.file.path;
    const log = await ProgressLog.create(data);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  const { limit = 30 } = req.query;
  const logs = await ProgressLog.find({ user: req.user.id }).sort({ date: -1 }).limit(Number(limit));
  res.json(logs);
});

router.get('/weekly', auth, async (req, res) => {
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const logs = await ProgressLog.find({ user: req.user.id, date: { $gte: weekAgo } }).sort({ date: 1 });
  res.json(logs);
});

module.exports = router;
