const express = require('express');
const router = express.Router();
const { //to import the functions from users.js
  addUser, authenticateUser, deleteUser, getUsers, getAccountInfos, updateAccount } = require("../models/users.js");

// Register user


// // Login user
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await authenticateUser(email, password);
//     if (user) {
//       // Login successful, handle session or token generation here
//       res.status(200).json({
//         message: "Login successful",
//         user: { id: user._id, email: user.email } // Do not send password
//       });
//     } else {
//       res.status(401).json({ message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error("Error in login route:", error);
//     res.status(500).json({ message: "Error processing login" });
//   }
// });

router.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    console.log(id);
    const deletedUser = await deleteUser(id);
    if (!deletedUser) { // if this variable is null
      return res
        .status(404)
        .json({ message: "A user with that id wasn't found" });
    }
    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error in route when deleteing the recipe:", error);
    res.status(500).json({ message: "Error deleteing recipe data" });
  }
});

router.get("/getUsers", async (req, res) => {
  try {
    const allUsers = await getUsers();
    res.json({
      message: "All users retrieved successfully",
      allUsers,
    });
  } catch (error) {
    console.error("Error in route when retrieving all users:", error);
    res.status(500).json({ message: "Error retrieving user's data" });
  }
});

router.get('/getAccountInfo/:id', async (req, res) => {
  const UserId = req.params.id;
  try {
    const accountInfos = await getAccountInfos(UserId);
    res.status(200).json({
      message: 'Account infos retrieved successfully',
      accountInfos,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put("/uppdateAccount/:id", async (req, res) => {
  try {
    var id = req.params.id;
    const updatedInfo = req.body;

    const updatedRecipe = await updateAccount(id, updatedInfo);
    if (!updatedRecipe) { // returned value is null
      return res
        .status(404)
        .json({ message: "A recipe with that id wasn't found" });
    }
    res.status(200).json({
      message: "Recipe updated successfully"
    });
  } catch (error) {
    console.error("Error in route when updating the recipe:", error);
    res.status(500).json({ message: "Error updating recipe data" });
  }
});

module.exports = router;
