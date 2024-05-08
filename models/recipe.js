const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipe_name: { type: String, required: true },
  calories: { type: Number, required: true },
  image: { type: String, required: false } // URL to the image
});

// Create a unique index to prevent the same recipe from being saved more than once.
recipeSchema.index({ user_id: 1, recipe_name: 1 }, { unique: true });

module.exports = mongoose.model('Recipe', recipeSchema);

