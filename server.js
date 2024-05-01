const usersRoutes = require('./routes/userRoutes'); // Import user routes
const recipeRoutes = require('./routes/recipeRoutes');
require("dotenv").config(); //import .env file
const express = require("express");
const connectDB = require('./connection.js'); // Import the MongoDB connection
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;
connectDB(); // Connect to MongoDB 

const path = require("path");//
app.use(bodyParser.json());//to use bodyparse in express

// Serve static files from 'public' directory
app.use(express.static('public'));

// routes
app.use('/api/users', usersRoutes); // Attach user routes under '/api/users'
app.use('/api/recipes', recipeRoutes);


// Serve recipe.html at root
app.get("/recipes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "recipe.html"));
});


app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});


app.listen(port, () => console.log(`Server running on port ${port}`));