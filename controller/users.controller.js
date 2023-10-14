const User = require("../models/User");
const { hashGenerate } = require("../config/util");
const mongoose = require("mongoose");

async function createUser(req, res) {
  try {
    // Check if the user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { _id=(new mongoose.Types.ObjectId()), username, password, isAdmin=false } = req.body;

    // Create a new user
    const user = await User.create({ _id, username, password: (await hashGenerate(password)), isAdmin });
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// only admin can
async function updateUser(req, res) {
  try {
    // Check if the user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    const { username, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    user.password = await hashGenerate(password);

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteUser(req, res) {
  const { userId } = req.params;

  try {
    // Check if the requesting user has the authority to delete users
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({
          message: "Access denied. You are not authorized to delete users.",
        });
    }

    // Delete the user by ID
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function searchUsers(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the query parameters

    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Use a regular expression to perform a case-insensitive search on username or other attributes
    const users = await User.find({
      $or: [
        { username: { $regex: searchQuery, $options: "i" } },
        // Add other attributes for search as needed
      ],
    }, {_id:1, username:1});

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// only admin can
async function fetchAllUsers(req, res) {
  try {
    // Check if the requesting user has the authority to list users
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({
          message: "Access denied. You are not authorized to list users.",
        });
    }

    // Retrieve all users
    const users = await User.find({}, "-password"); // Exclude password field from the response

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    fetchAllUsers
}