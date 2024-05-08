const mongoose = require('mongoose');

const calorieEntrySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  recipe_name: { type: String, required: true },
  calories: { type: Number, required: true }
});

// Create a unique index to prevent the same recipe from being saved more than once for a specific date.
calorieEntrySchema.index({ user_id: 1, recipe_name: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('CalorieEntry', calorieEntrySchema);


