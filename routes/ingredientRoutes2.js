const express = require('express');
const router = express.Router();

router.get("/:ingredient", async (req, res) => {
  try {
    const ingredient = req.params.ingredient;

    const response = await fetch(`https://api.spoonacular.com/food/ingredients/search?apiKey=${process.env.API_KEY_INGREDIANT}&query=${ingredient}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const ingredientsData = await response.json(); // Parsing the response as JSON
    res.json({
      message: "Ingredients retrieved successfully",
      ingredients: ingredientsData, // parsed data
    });
  } catch (error) {
    console.error("Error in route when retrieving ingredients:", error);
    res.status(500).json({ message: "Error retrieving ingredients data" });
  }
});

router.get("/getIngredient/:ingredientId", async (req, res) => {
  try {
    const ingredientId = req.params.ingredientId;

    const response = await fetch(`https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=1&apiKey=${process.env.API_KEY_INGREDIANT}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const ingredientsData = await response.json(); // Parsing the response as JSON
    res.json({
      message: "Ingredient retrieved successfully",
      ingredient: ingredientsData, // parsed data
    });
  } catch (error) {
    console.error("Error in route when retrieving ingredient data:", error);
    res.status(500).json({ message: "Error retrieving ingredient data" });
  }
});

module.exports = router;