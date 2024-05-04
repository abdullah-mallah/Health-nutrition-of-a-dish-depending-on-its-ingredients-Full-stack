const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/:food", async (req, res) => {
    const food = req.params.food;
    const url = `https://api.edamam.com/api/recipes/v2?q=${food}&app_id=4f21898d&app_key=4c3e681eb31124f74461092eb4196d07&type=public`;
    try {
        const response = await axios.get(url);
        // Extract both label and calories from each recipe
        const recipes = response.data.hits.map(hit => {
            return {
                label: hit.recipe.label,
                calories: Math.round(hit.recipe.calories), // Round the calories to a whole number
                image: hit.recipe.image,
                healthLabels: hit.recipe.healthLabels,
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