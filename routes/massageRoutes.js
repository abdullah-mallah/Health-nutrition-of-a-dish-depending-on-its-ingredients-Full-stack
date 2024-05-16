const express = require('express');
const router = express.Router();
const { //to import the functions from users.js
  addmassage } = require("../models/massages.js");


router.post('/createMassage', async (req, res) => { //take info from request body and send it to addUser function in users.js
  try {
    const massageInfo = req.body;

    const user_id = massageInfo.user_id;
    const massage = massageInfo.massage;

    const newMassage = await addmassage(
      user_id,
      massage,
    );
    res.status(201).json({
      message: "massage added successfully",
    });
  } catch (error) {
    console.error("Error in route when adding the massage:", error);
    res.status(500).json({ message: "Error adding massage data" });
  }
});

module.exports = router;