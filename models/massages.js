const mongoose = require("mongoose");

const massagesSchema = new mongoose.Schema({
  user_id: String,
  massage: String,
});

const massages = mongoose.model("massages", massagesSchema);

async function addmassage(user_id, massage) {
  try {
    const newMassage = new massages({
      user_id: user_id,
      massage: massage,
    });
    await newMassage.save();
  } catch (error) {
    throw error; // handle the error in the route
  }
}

module.exports = { //prepare which functions I want this class to export
  addmassage
};