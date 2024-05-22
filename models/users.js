const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  admin: String,
});

const users = mongoose.model("users", usersSchema);

async function addUser(userName, email, password, admin) {
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
      admin: admin,
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

async function deleteUser(id) {
  try {
    const deletedUser = await users.findByIdAndDelete(id);
    if (!deletedUser) {
      return null; // if there are no recipe with that id
    }
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error; // handle the error in the route
  }
}

async function getAccountInfos(id) {
  try {
    const accountInfos = await users.find({ _id: id });
    return accountInfos;
  }
  catch (error) {
    throw error; // handle the error in the route
  }
}

async function updateAccount(id, updatedInfo) {
  updatedInfo.password = await bcrypt.hash(updatedInfo.password, 10);
  try {
    const updatedAccount = await users.findByIdAndUpdate(id, updatedInfo, {
      new: true,
    });
    if (!updatedAccount) {
      return null; // if there are no recipe with that id
    }
    return updatedAccount;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error; // handle the error in the route
  }

}

module.exports = { //prepare which functions I want this class to export
  authenticateUser, 
  addUser,
  getUsers,
  deleteUser,
  getAccountInfos,
  updateAccount,
};