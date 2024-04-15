const { //to import the functions from users.js
  addUser, authenticateUser
} = require("./models/users.js");

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

app.post("/api/users", async (req, res) => { //take info from request body and send it to addUser function in users.js
  try {
    const userInfo = req.body;

    const userName = userInfo.userName;
    const email = userInfo.email;
    const password = userInfo.password;

    const user = await addUser(
      userName,
      email,
      password
    );

    if (!user) {
      return res
        .status(409)
        .json({ message: "A user with that userName already exists" });
    }
    res.status(201).json({
      message: "User added successfully",
      user,
    });
  } catch (error) {
    console.error("Error in route when adding the user:", error);
    res.status(500).json({ message: "Error adding user data" });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    if (user) {
      // Login successful, handle session or token generation here
      res.status(200).json({
        message: "Login successful",
        user: { id: user._id, email: user.email } // Do not send password
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ message: "Error processing login" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));