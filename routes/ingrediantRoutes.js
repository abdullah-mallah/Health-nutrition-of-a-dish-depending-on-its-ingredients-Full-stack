const express = require('express');
const router = express.Router();
const { //to import the functions from users.js
  getIngrediants, addIngrediant } = require("../models/ingrediants.js");

router.get('/getAllIngrediants', async (req, res) => {
  try {
    const ingrediants = await getIngrediants();
    res.json({
      message: "Ingredients retrieved successfully",
      ingrediants,
    });
  } catch (error) {
    console.error("Error in route when retrieving ingredients:", error);
    res.status(500).json({ message: "Error retrieving ingredients data" });
  }
});

router.post('/addIngrediant', async (req, res) => {
  try {
    const ingrediantInfo = req.body;

    const ingrediantName = ingrediantInfo.name;
    const ingrediantSize = ingrediantInfo.size;
    const ingrediantFat = ingrediantInfo.fat;
    const ingrediantCholesterol = ingrediantInfo.cholesterol;
    const ingrediantSodium = ingrediantInfo.sodium;
    const ingrediantCarbohydrate = ingrediantInfo.carbohydrate;
    const ingrediantSugar = ingrediantInfo.sugar;
    const ingrediantProtein = ingrediantInfo.protein;
    const ingrediantVitamin_c = ingrediantInfo.vitamin_c;
    const ingrediantVitamin_d = ingrediantInfo.vitamin_d;
    const ingrediantIron = ingrediantInfo.iron;
    const ingrediantCalcium = ingrediantInfo.calcium;
    const ingrediantPotassium = ingrediantInfo.potassium;
    const ingrediantPhosphorus = ingrediantInfo.phosphorus;

    const ingrediant = await addIngrediant(
      ingrediantName,
      ingrediantSize,
      ingrediantFat,
      ingrediantCholesterol,
      ingrediantSodium,
      ingrediantCarbohydrate,
      ingrediantSugar,
      ingrediantProtein,
      ingrediantVitamin_c,
      ingrediantVitamin_d,
      ingrediantIron,
      ingrediantCalcium,
      ingrediantPotassium,
      ingrediantPhosphorus,
    );
    res.status(201).json({
      message: "Ingredient added successfully",
    });
  } catch (error) {
    console.error("Error in route when adding the ingrediant:", error);
    res.status(500).json({ message: "Error adding ingrediant data" });
  }
});

module.exports = router;