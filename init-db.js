const mongoose = require('mongoose');
require('dotenv').config();

async function initDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neonfit', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('\n🔧 Initializing NEON FIT Database...\n');

    // 1. Users Collection
    const UserSchema = new mongoose.Schema({
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true, minlength: 6 },
      proteinTarget: { type: Number, default: 150 },
      calorieTarget: { type: Number, default: 2500 },
      weight: { type: Number },
      height: { type: Number },
      profilePhoto: { type: String },
      createdAt: { type: Date, default: Date.now }
    });
    UserSchema.index({ email: 1 });
    const User = mongoose.model('User', UserSchema);
    console.log('✅ Users collection created');

    // 2. WorkoutLogs Collection
    const WorkoutLogSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      date: { type: Date, default: Date.now },
      dayType: { type: String, enum: ['Push', 'Pull', 'Legs', 'Rest'], required: true },
      exercises: [{
        name: String,
        sets: [{
          setNumber: Number,
          weight: Number,
          reps: Number,
          completed: { type: Boolean, default: false }
        }]
      }],
      duration: Number,
      notes: String,
      completed: { type: Boolean, default: false }
    });
    WorkoutLogSchema.index({ user: 1, date: -1 });
    const WorkoutLog = mongoose.model('WorkoutLog', WorkoutLogSchema);
    console.log('✅ WorkoutLogs collection created');

    // 3. MealLogs Collection
    const MealLogSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      date: { type: Date, default: Date.now },
      mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-workout', 'Post-workout'] },
      items: [{
        foodName: String,
        quantity: Number,
        unit: { type: String, default: 'g' },
        protein: Number,
        calories: Number,
        carbs: Number,
        fats: Number
      }],
      totalProtein: Number,
      totalCalories: Number
    });
    MealLogSchema.index({ user: 1, date: -1 });
    const MealLog = mongoose.model('MealLog', MealLogSchema);
    console.log('✅ MealLogs collection created');

    // 4. ProgressLogs Collection (with water field)
    const ProgressLogSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      date: { type: Date, default: Date.now },
      weight: Number,
      bodyFat: Number,
      chest: Number,
      waist: Number,
      arms: Number,
      water: Number,
      photo: String,
      notes: String
    });
    ProgressLogSchema.index({ user: 1, date: -1 });
    const ProgressLog = mongoose.model('ProgressLog', ProgressLogSchema);
    console.log('✅ ProgressLogs collection created');

    // Create sample documents to ensure collections are visible in MongoDB
    const sampleUser = new User({
      name: 'Demo User',
      email: 'demo@neonfit.com',
      password: 'DemoPass123'
    });
    const user = await sampleUser.save().catch(() => {
      // User might already exist
      return User.findOne({ email: 'demo@neonfit.com' });
    });

    // Create sample workout log
    const sampleWorkout = new WorkoutLog({
      user: user._id,
      dayType: 'Push',
      exercises: [{
        name: 'Bench Press',
        sets: [{ setNumber: 1, weight: 100, reps: 8, completed: true }]
      }],
      duration: 60,
      completed: true
    });
    await sampleWorkout.save().catch(() => {});

    // Create sample meal log
    const sampleMeal = new MealLog({
      user: user._id,
      mealType: 'Breakfast',
      items: [{
        foodName: 'Chicken Breast',
        quantity: 150,
        protein: 35,
        calories: 200,
        carbs: 0,
        fats: 2
      }],
      totalProtein: 35,
      totalCalories: 200
    });
    await sampleMeal.save().catch(() => {});

    // Create sample progress log
    const sampleProgress = new ProgressLog({
      user: user._id,
      weight: 80,
      bodyFat: 15,
      water: 2.5,
      notes: 'Sample progress entry'
    });
    await sampleProgress.save().catch(() => {});

    console.log('\n📊 Database Initialization Summary:\n');
    console.log('Collections Created:');
    console.log('  1. users - Stores user profiles and auth data');
    console.log('  2. workoutlogs - Stores workout sessions');
    console.log('  3. meallogs - Stores meal logs with macros');
    console.log('  4. progresslogs - Stores weight, body fat, photos, water intake');
    console.log('\nIndexes Created:');
    console.log('  • users: email (unique)');
    console.log('  • workoutlogs: user + date');
    console.log('  • meallogs: user + date');
    console.log('  • progresslogs: user + date');
    console.log('\n✅ Database ready for NEON FIT!\n');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Initialization Error:', err.message);
    process.exit(1);
  }
}

initDB();