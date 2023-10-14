
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');


async function login(req, res){
    try {
        const { username, password } = req.body;
    
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        // Generate and return a JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
    
        res.json({ token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

function logout(req, res) {

    // can also use backlisting for jwt token not allowing

    res.clearCookie('jwt'); // Clear the JWT cookie
    res.json({ message: 'Logged out successfully' });  
}


module.exports = {
    login, logout
}