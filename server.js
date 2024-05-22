const { //to import the functions from users.js
  authenticateUser } = require("./models/users.js");
// importing routes
const usersRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes')
const logoutRoute = require('./routes/logoutRoute.js');
const signuptRoute = require('./routes/signupRoute.js');
const massageRoutes = require('./routes/massageRoutes.js');
const ingredientRoutes = require('./routes/ingredientRoutes2.js');

require("dotenv").config(); //import .env file

const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
app.use('/api', authenticateToken);

const connectDB = require('./connection.js'); // Import the MongoDB connection
const bodyParser = require("body-parser");
connectDB(); // Connect to MongoDB 

const port = process.env.PORT || 5000;

const path = require("path");//
app.use(bodyParser.json());//to use bodyparse in express
app.use(express.static('public'));

// routes
app.use('/api/users', usersRoutes);
app.use('/api/recipes', recipeRoutes) // to get the recipes from the api
app.use('/api/favourites', favouriteRoutes);
app.use('/api/nutritions', nutritionRoutes);
app.use('/api/massages', massageRoutes);
app.use('/api/logout', logoutRoute);
app.use('/api/ingredients', ingredientRoutes);
app.use('/', signuptRoute)



app.post("/login", async (req, res) => { // Added async here
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password); // Added await here
    if (user) {
      const userPayload = { id: user._id, email: user.email, userName: user.userName, admin: user.admin };
      var accessToken = jwt.sign(userPayload, process.env.TOKEN_SECRET);
      res.status(200).json({
        message: "Login successful",
        user: { id: user._id, email: user.email, userName: user.userName, admin: user.admin },
        token: { Token: accessToken }
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ message: "Error processing login" });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.log('No token provided');
    return res.sendStatus(401);  // No token present
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(`Token validation error: ${err.message}`);
      return res.sendStatus(403);  // Invalid token
    }
    req.user = user;
    next();
  });
}


app.listen(port, () => console.log(`Server running on port ${port}`));