const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model

const jwtMiddleware = async (req, res, next) => {
  const token = req.header('Authorization'); // Assuming the token is sent in the 'Authorization' header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the JWT token
    const tokenOnly = token.split(' ')[1];

    const decoded = jwt.verify(tokenOnly, process.env.JWT_SECRET); // Replace with your actual secret key
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = user; // Attach user details to the req object
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = jwtMiddleware;
