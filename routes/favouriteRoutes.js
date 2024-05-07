const express = require("express");
const Recipe = require('../models/recipe');
const router = express.Router();

// Save a recipe to the database
router.post('/save', async (req, res) => {
    const { user_id, recipe_name, calories, image } = req.body;

    try {
        const existingRecipe = await Recipe.findOne({ user_id, recipe_name });
        if (existingRecipe) {
            return res.status(409).json({ message: 'You have already saved this recipe.' });
        }

        const newRecipe = new Recipe({ user_id, recipe_name, calories, image });
        await newRecipe.save();
        res.status(201).json({ message: 'Recipe saved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a recipe from the database
router.delete('/delete', async (req, res) => {
    const { user_id, recipe_name } = req.body;

    try {
        const result = await Recipe.findOneAndDelete({ user_id, recipe_name });
        if (!result) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/getAllFavouriteRecipes', async (req, res) => {
    try {
        const favouriteRecipes = await Recipe.find();
        console.log(favouriteRecipes)
        if (!favouriteRecipes) {
            return res.status(404).json({ message: 'No favourite recipes yet' });
        }
        res.status(200).json({
            message: 'Favourite recipes retrieved successfully',
            favouriteRecipes,
            //favouriteRecipes: { user_id: favouriteRecipes.user_id, recipe_name: favouriteRecipes.recipe_name, calories: favouriteRecipes.calories, image: favouriteRecipes.image },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
