const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neonfit';

async function listUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Define a simple schema just to read emails
    const User = mongoose.model('User', new mongoose.Schema({ email: String, name: String }));
    
    const users = await User.find({}, 'email name');
    console.log('Users found:');
    console.log(JSON.stringify(users, null, 2));
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

listUsers();
