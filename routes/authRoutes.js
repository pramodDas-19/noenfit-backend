const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'neonfit_secret_key', { expiresIn: '30d' });

// NOTE: Do NOT include /api/auth or /auth here.
// These are relative to the mount point in server.js

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, weight, height } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const user = await User.create({ name, email: email.toLowerCase(), password, weight, height });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;