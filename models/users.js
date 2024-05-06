const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
});

const users = mongoose.model("users", usersSchema);

async function addUser(userName, email, password) {
  try {
    const userExist = await users.findOne({ email });
    if (userExist) {
      return null;
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Ensure passwords are hashed
    const newUser = new users({
      userName: userName,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    return newUser;
  } catch (error) {
      throw error; // handle the error in the route
  }
}

async function authenticateUser(email, password) {
  try {
    const user = await users.findOne({ email: email });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
  catch (error) {
    throw error; // handle the error in the route
  }
}
async function getUsers() {
  try {
    const allUsers = await users.find();
    return allUsers;
  }
  catch (error) {
    throw error; // handle the error in the route
  }
}
module.exports = { //prepare which functions I want this class to export
  authenticateUser, 
  addUser,
  getUsers
};