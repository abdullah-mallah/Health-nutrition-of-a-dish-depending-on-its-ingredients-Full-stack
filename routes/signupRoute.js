const express = require('express');
const router = express.Router();
const { //to import the functions from users.js
  addUser, authenticateUser, deleteUser, getUsers, getAccountInfos, updateAccount } = require("../models/users.js");

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
        user: { id: user._id, email: user.email }
      });
    } catch (error) {
      console.error("Error in route when adding the user:", error);
      res.status(500).json({ message: "Error adding user data" });
    }
  });

  module.exports = router;