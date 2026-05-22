const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'neonfit_secret_key', { expiresIn: '30d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, weight, height } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) return res.status(400).json({ error: 'Password must be at least 8 characters with uppercase, lowercase, and number' });

    if (weight && (weight < 30 || weight > 200)) return res.status(400).json({ error: 'Weight must be between 30kg and 200kg' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const user = await User.create({ name, email, password, weight, height });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, proteinTarget: user.proteinTarget }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, proteinTarget: user.proteinTarget } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get profile
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Update profile
router.patch('/me', auth, async (req, res) => {
  try {
    const updates = ['name', 'weight', 'height', 'proteinTarget', 'calorieTarget', 'profilePhoto'];
    const body = {};
    updates.forEach(u => { if (req.body[u] !== undefined) body[u] = req.body[u]; });
    const user = await User.findByIdAndUpdate(req.user.id, body, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
