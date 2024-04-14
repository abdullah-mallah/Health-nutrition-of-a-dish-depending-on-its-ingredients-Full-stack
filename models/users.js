const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
});

const users = mongoose.model("users", usersSchema);

async function addUser(userName, email, password) {
  try {
    const userExist = await users.findOne({ userName });
    if (userExist) {
      return null; // if the user already exists
    }

    const newUser = new user({
      userName: userName,
      email: email,
      password: password,
    });
    await newUser.save(); // save user to database
    console.log(newUser);
    return newUser;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error; // handle the error in the route
  }
}

module.exports = { //prepare which functions I want this class to export
  addUser
};