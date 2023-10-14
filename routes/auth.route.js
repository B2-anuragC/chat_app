const express = require('express');
const router = express.Router();
const controller = require("../controller/auth.controller");

const User = require("../models/User")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// // Register a new user
// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Check if the user already exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const user = new User({ username, password: hashedPassword });
//     await user.save();

//     // Generate and return a JWT token
//     const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);

//     res.json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.post('/login', controller.login);
router.post('/logout', controller.logout);

module.exports = router;
