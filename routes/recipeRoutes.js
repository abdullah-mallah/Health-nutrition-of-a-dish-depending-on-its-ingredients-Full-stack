const express = require("express");
const router = express.Router();
const axios = require("axios");
const Recipe = require('../models/recipe.js');

router.get("/:food", async (req, res) => {
    const food = req.params.food;
    const api_id = process.env.API_ID;
    const api_key = process.env.API_KEY;
    const url = `https://api.edamam.com/api/recipes/v2?q=${food}&app_id=${api_id}&app_key=${api_key}&type=public`;
    try {
        const response = await axios.get(url);
        // Extract both label and calories from each recipe
        const recipes = response.data.hits.map(hit => {
            return {
                label: hit.recipe.label,
                calories: Math.round(hit.recipe.calories), // Round the calories to a whole number
                image: hit.recipe.image,
                healthLabels: hit.recipe.healthLabels,
                dietLabels: hit.recipe.dietLabels,
                ingredientLines: hit.recipe.ingredientLines,
                protein: Math.round(hit.recipe.totalNutrients.PROCNT.quantity),
                sugar: Math.round(hit.recipe.totalNutrients.SUGAR.quantity),
                mealType: hit.recipe.mealType

            };
        });
        res.json(recipes); // Send labels and calories as JSON
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).send('Failed to fetch recipes');
    }
});



router.post('/save', async (req, res) => {
    const { user_id, recipe_name, calories, image } = req.body;
  
    try {
      // Check if the recipe with the same name already exists for this user
      const existingRecipe = await Recipe.findOne({ user_id, recipe_name });
      if (existingRecipe) {
        return res.status(409).json({ message: 'You have already saved this recipe.' });
      }
  
      // If no existing recipe is found, save the new one
      const newRecipe = new Recipe({ user_id, recipe_name, calories, image });
      await newRecipe.save();
      res.status(201).json({ message: 'Recipe saved successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  
// DELETE route to remove a recipe by user_id and recipe_name
router.delete('/delete', async (req, res) => {
    try {
      const { user_id, recipe_name } = req.body;
      const result = await Recipe.findOneAndDelete({ user_id, recipe_name });
  
      if (!result) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
module.exports = router;
  
  
  
  
  