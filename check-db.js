const mongoose = require('mongoose');
require('dotenv').config();

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neonfit', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const db = mongoose.connection.getClient().db('neonfit');
    const collections = await db.listCollections().toArray();
    
    console.log('\n✅ MongoDB Connected!');
    console.log('📊 Current Collections:');
    
    if (collections.length === 0) {
      console.log('   ❌ No collections found (database is empty)');
    } else {
      collections.forEach((col, idx) => {
        console.log(`   ${idx + 1}. ${col.name}`);
      });
    }
    
    console.log('\n📋 Required Collections for NEON FIT:');
    const required = ['users', 'workoutlogs', 'meallogs', 'progresslogs'];
    required.forEach(col => {
      const exists = collections.some(c => c.name === col);
      console.log(`   ${exists ? '✅' : '❌'} ${col}`);
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Connection Error:', err.message);
    process.exit(1);
  }
}

checkDB();