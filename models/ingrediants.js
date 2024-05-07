const mongoose = require("mongoose");
const ingrediantsSchema = new mongoose.Schema({
  name: String,
  size: String,
  fat: String,
  cholesterol: String,
  sodium: String,
  carbohydrate: String,
  sugar: String,
  protein: String,
  vitamin_c: String,
  vitamin_d: String,
  iron: String,
  calcium: String,
  potassium: String,
  phosphorus: String,
});
const ingrediants = mongoose.model("ingrediants", ingrediantsSchema);

async function getIngrediants() {
  try {
    const allIngrediants = await ingrediants.find();
    return allIngrediants;
  }
  catch (error) {
    throw error; // handle the error in the route
  }
}

async function addIngrediant(name, size, fat, cholesterol, sodium, carbohydrate, sugar, protein, vitamin_c, vitamin_d, iron, calcium, potassium, phosphorus) {
  try {
    const newIngrediant = new ingrediants({
      name: name,
      size: size,
      fat: fat,
      cholesterol: cholesterol,
      sodium: sodium,
      carbohydrate: carbohydrate,
      sugar: sugar,
      protein: protein,
      vitamin_c: vitamin_c,
      vitamin_d: vitamin_d,
      iron: iron,
      calcium: calcium,
      potassium: potassium,
      phosphorus: phosphorus,
    });
    await newIngrediant.save();
  } catch (error) {
    throw error; // handle the error in the route
  }
}

module.exports = {
  getIngrediants, addIngrediant
};