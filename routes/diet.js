const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const router = express.Router();

const { MealLog } = require('../models');

// Indian food database (per 100g)
const FOOD_DB = {
  'eggs': { protein: 13, calories: 155, carbs: 1.1, fats: 11 },
  'egg whites': { protein: 10.9, calories: 52, carbs: 0.7, fats: 0.2 },
  'dal': { protein: 9, calories: 116, carbs: 20, fats: 0.4 },
  'chana': { protein: 19, calories: 364, carbs: 61, fats: 6 },
  'soy chunks': { protein: 52, calories: 336, carbs: 33, fats: 0.5 },
  'paneer': { protein: 18, calories: 265, carbs: 1.2, fats: 20 },
  'bread': { protein: 8, calories: 265, carbs: 49, fats: 3.2 },
  'chicken breast': { protein: 31, calories: 165, carbs: 0, fats: 3.6 },
  'brown rice': { protein: 2.6, calories: 123, carbs: 26, fats: 1 },
  'oats': { protein: 17, calories: 389, carbs: 66, fats: 7 },
  'milk': { protein: 3.4, calories: 61, carbs: 5, fats: 3.3 },
  'curd': { protein: 3.5, calories: 61, carbs: 4.7, fats: 3.3 },
  'moong dal': { protein: 24, calories: 347, carbs: 63, fats: 1.2 },
  'rajma': { protein: 8.7, calories: 127, carbs: 22, fats: 0.5 },
  'tofu': { protein: 8, calories: 76, carbs: 1.9, fats: 4.8 },
  'whey protein': { protein: 80, calories: 350, carbs: 8, fats: 5 },
  'banana': { protein: 1.1, calories: 89, carbs: 23, fats: 0.3 },
  'peanut butter': { protein: 25, calories: 588, carbs: 20, fats: 50 },
  'almonds': { protein: 21, calories: 579, carbs: 22, fats: 50 },
  'tuna': { protein: 30, calories: 132, carbs: 0, fats: 1 }
};

// Get food database
router.get('/foods', auth, (req, res) => {
  const { q } = req.query;
  if (q) {
    const filtered = Object.entries(FOOD_DB)
      .filter(([name]) => name.toLowerCase().includes(q.toLowerCase()))
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    return res.json(filtered);
  }
  res.json(FOOD_DB);
});

// Log a meal
router.post('/', auth, async (req, res) => {
  try {
    const { mealType, items, date } = req.body;
    const processedItems = items.map(item => {
      const food = FOOD_DB[item.foodName.toLowerCase()] || {};
      const ratio = item.quantity / 100;
      return {
        ...item,
        protein: parseFloat(((food.protein || item.protein || 0) * ratio).toFixed(1)),
        calories: parseFloat(((food.calories || item.calories || 0) * ratio).toFixed(1)),
        carbs: parseFloat(((food.carbs || item.carbs || 0) * ratio).toFixed(1)),
        fats: parseFloat(((food.fats || item.fats || 0) * ratio).toFixed(1))
      };
    });

    const totalProtein = processedItems.reduce((s, i) => s + i.protein, 0);
    const totalCalories = processedItems.reduce((s, i) => s + i.calories, 0);

    const log = await MealLog.create({
      user: req.user.id,
      mealType,
      items: processedItems,
      totalProtein: parseFloat(totalProtein.toFixed(1)),
      totalCalories: parseFloat(totalCalories.toFixed(1)),
      date: date || new Date()
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get today's meals
router.get('/today', auth, async (req, res) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const meals = await MealLog.find({ user: req.user.id, date: { $gte: today, $lt: tomorrow } });
  const totalProtein = meals.reduce((s, m) => s + m.totalProtein, 0);
  const totalCalories = meals.reduce((s, m) => s + m.totalCalories, 0);
  res.json({ meals, totalProtein: parseFloat(totalProtein.toFixed(1)), totalCalories: parseFloat(totalCalories.toFixed(1)) });
});

// Get meals by date range
router.get('/', auth, async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = { user: req.user.id };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  const meals = await MealLog.find(query).sort({ date: -1 });
  res.json(meals);
});

// Delete meal
router.delete('/:id', auth, async (req, res) => {
  await MealLog.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ message: 'Meal deleted' });
});

module.exports = router;
