const usersRoutes = require('./routes/userRoutes'); // Import user routes
require("dotenv").config(); //import .env file
const express = require("express");
const mongoose = require("mongoose");
//
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

const path = require("path");//
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());//to use bodyparse in express

// MongoDB connection
mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true, // tells Mongoose to use the new URL parser instead of the legacy URL parser. 
    useUnifiedTopology: true, //enables the use of MongoDB's new connection management engine
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log("Error in connecting to MongoDB", err));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use('/api/users', usersRoutes); // Attach user routes under '/api/users'

app.listen(port, () => console.log(`Server running on port ${port}`));