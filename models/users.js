const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
});

const users = mongoose.model("users", usersSchema);

async function addUser(userName, email, password) {
  const userExist = await users.findOne({ userName });
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
}



async function authenticateUser(email, password) {
  const user = await users.findOne({ email: email });
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  } else {
    return null;
  }
}





module.exports = { //prepare which functions I want this class to export
  authenticateUser, 
  addUser
};