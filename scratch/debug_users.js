const mongoose = require('mongoose');
const { User } = require('../models');
require('dotenv').config();
const fs = require('fs');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neonfit');
    const count = await User.countDocuments();
    const users = await User.find({}, 'name email createdAt').limit(5);
    const result = {
      timestamp: new Date().toISOString(),
      userCount: count,
      latestUsers: users
    };
    fs.writeFileSync('scratch/db_status.json', JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (err) {
    fs.writeFileSync('scratch/db_status.json', JSON.stringify({ error: err.message }, null, 2));
    process.exit(1);
  }
}
debug();
