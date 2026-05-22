const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const WEEKLY_PLAN = {
  Monday: {
    day: 'Monday', type: 'Push', icon: '🔥',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: 90, muscle: 'Chest' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: 75, muscle: 'Upper Chest' },
      { name: 'Cable Chest Fly', sets: 3, reps: '12-15', rest: 60, muscle: 'Chest' },
      { name: 'Overhead Press', sets: 4, reps: '8-10', rest: 90, muscle: 'Shoulders' },
      { name: 'Lateral Raises', sets: 3, reps: '15-20', rest: 45, muscle: 'Side Delts' },
      { name: 'Tricep Rope Pushdown', sets: 3, reps: '12-15', rest: 60, muscle: 'Triceps' },
      { name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', rest: 60, muscle: 'Triceps' }
    ]
  },
  Tuesday: {
    day: 'Tuesday', type: 'Pull', icon: '💪',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: '5-6', rest: 120, muscle: 'Full Back' },
      { name: 'Pull-ups', sets: 4, reps: '8-12', rest: 90, muscle: 'Lats' },
      { name: 'Barbell Row', sets: 3, reps: '8-10', rest: 90, muscle: 'Mid Back' },
      { name: 'Single Arm Dumbbell Row', sets: 3, reps: '10-12', rest: 60, muscle: 'Lats' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', rest: 45, muscle: 'Rear Delts' },
      { name: 'Barbell Curl', sets: 3, reps: '10-12', rest: 60, muscle: 'Biceps' },
      { name: 'Hammer Curl', sets: 3, reps: '12-15', rest: 45, muscle: 'Brachialis' }
    ]
  },
  Wednesday: {
    day: 'Wednesday', type: 'Legs', icon: '⚡',
    exercises: [
      { name: 'Barbell Squat', sets: 4, reps: '8-10', rest: 120, muscle: 'Quads' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10-12', rest: 90, muscle: 'Hamstrings' },
      { name: 'Leg Press', sets: 3, reps: '12-15', rest: 75, muscle: 'Quads' },
      { name: 'Walking Lunges', sets: 3, reps: '12 each', rest: 60, muscle: 'Quads/Glutes' },
      { name: 'Leg Curl', sets: 3, reps: '12-15', rest: 60, muscle: 'Hamstrings' },
      { name: 'Calf Raises', sets: 4, reps: '20-25', rest: 45, muscle: 'Calves' }
    ]
  },
  Thursday: {
    day: 'Thursday', type: 'Push', icon: '🔥',
    exercises: [
      { name: 'Incline Barbell Press', sets: 4, reps: '8-10', rest: 90, muscle: 'Upper Chest' },
      { name: 'Dumbbell Bench Press', sets: 3, reps: '10-12', rest: 75, muscle: 'Chest' },
      { name: 'Chest Dips', sets: 3, reps: '10-15', rest: 75, muscle: 'Chest/Triceps' },
      { name: 'Arnold Press', sets: 3, reps: '10-12', rest: 75, muscle: 'Shoulders' },
      { name: 'Front Raises', sets: 3, reps: '12-15', rest: 45, muscle: 'Front Delts' },
      { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: 60, muscle: 'Triceps' },
      { name: 'Tricep Kickbacks', sets: 3, reps: '12-15', rest: 45, muscle: 'Triceps' }
    ]
  },
  Friday: {
    day: 'Friday', type: 'Pull', icon: '💪',
    exercises: [
      { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', rest: 90, muscle: 'Lats' },
      { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: 75, muscle: 'Mid Back' },
      { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: 75, muscle: 'Lats' },
      { name: 'Chest Supported Row', sets: 3, reps: '12-15', rest: 60, muscle: 'Upper Back' },
      { name: 'Reverse Fly', sets: 3, reps: '15-20', rest: 45, muscle: 'Rear Delts' },
      { name: 'Concentration Curl', sets: 3, reps: '12-15', rest: 45, muscle: 'Biceps' },
      { name: 'Cable Curl', sets: 3, reps: '12-15', rest: 45, muscle: 'Biceps' }
    ]
  },
  Saturday: {
    day: 'Saturday', type: 'Legs', icon: '⚡',
    exercises: [
      { name: 'Front Squat', sets: 4, reps: '8-10', rest: 120, muscle: 'Quads' },
      { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each', rest: 90, muscle: 'Quads/Glutes' },
      { name: 'Hack Squat', sets: 3, reps: '12-15', rest: 75, muscle: 'Quads' },
      { name: 'Seated Leg Curl', sets: 3, reps: '12-15', rest: 60, muscle: 'Hamstrings' },
      { name: 'Hip Thrust', sets: 3, reps: '12-15', rest: 75, muscle: 'Glutes' },
      { name: 'Standing Calf Raises', sets: 4, reps: '20-25', rest: 45, muscle: 'Calves' }
    ]
  },
  Sunday: {
    day: 'Sunday', type: 'Rest', icon: '😴',
    exercises: [],
    note: 'Active recovery — light walk, stretching, or yoga. Let your muscles rebuild!'
  }
};

router.get('/', auth, (req, res) => res.json(WEEKLY_PLAN));
router.get('/:day', auth, (req, res) => {
  const day = req.params.day;
  const plan = WEEKLY_PLAN[day];
  if (!plan) return res.status(404).json({ error: 'Day not found' });
  res.json(plan);
});

module.exports = router;
