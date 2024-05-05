const express = require("express");
const router = express.Router();
const axios = require("axios");

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
                ingredientLines: hit.recipe.ingredientLines

            };
        });
        res.json(recipes); // Send labels and calories as JSON
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).send('Failed to fetch recipes');
    }
});

module.exports = router;