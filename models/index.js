const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

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
  duration: Number, // minutes
  notes: String,
  completed: { type: Boolean, default: false }
});

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

// Avoid OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const WorkoutLog = mongoose.models.WorkoutLog || mongoose.model('WorkoutLog', WorkoutLogSchema);
const MealLog = mongoose.models.MealLog || mongoose.model('MealLog', MealLogSchema);
const ProgressLog = mongoose.models.ProgressLog || mongoose.model('ProgressLog', ProgressLogSchema);

module.exports = { User, WorkoutLog, MealLog, ProgressLog };
