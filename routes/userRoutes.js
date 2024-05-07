const express = require('express');
const router = express.Router();
const { //to import the functions from users.js
    addUser, authenticateUser } = require("../models/users.js");

// Register user
router.post('/signup', async (req, res) => { //take info from request body and send it to addUser function in users.js
    try {
      const userInfo = req.body;
  
      const userName = userInfo.userName;
      const email = userInfo.email;
      const password = userInfo.password;
      const admin = userInfo.admin;
  
      const user = await addUser(
        userName,
        email,
        password,
        admin
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

// Login user
router.post('/login', async (req, res) => {
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

module.exports = router;
