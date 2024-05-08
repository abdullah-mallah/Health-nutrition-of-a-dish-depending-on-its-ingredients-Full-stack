// importing routes
const usersRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const ingrediantRoutes = require('./routes/ingrediantRoutes')
const calorieEntryRoutes = require('./routes/calorieEntriesRoutes.js')

// const adminRoutes = require('./routes/adminRoutes')

require("dotenv").config(); //import .env file

const express = require("express");
const app = express();

const connectDB = require('./connection.js'); // Import the MongoDB connection
const bodyParser = require("body-parser");
connectDB(); // Connect to MongoDB 

const port = process.env.PORT || 5000;

const path = require("path");//
app.use(bodyParser.json());//to use bodyparse in express
// Serve static files from 'public' directory
app.use(express.static('public'));

// routes
app.use('/api/users', usersRoutes);
app.use('/api/recipes', recipeRoutes) // to get the recipes from the api
app.use('/api/ingrediants', ingrediantRoutes)
app.use('/api/favourites', favouriteRoutes);
app.use('/api/calorieEntries', calorieEntryRoutes); 
//app.use('/api/admin', adminRoutes)


// Serve recipe.html at root
app.get("/recipes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "recipes.html"));
});


app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});


app.listen(port, () => console.log(`Server running on port ${port}`));