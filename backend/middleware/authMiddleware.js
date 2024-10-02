const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and verify JWT tokens
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header is present and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from 'Bearer <token>'
      token = req.headers.authorization.split(' ')[1];

      // Verify token using JWT_SECRET from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Debug: Log the decoded token to verify structure
      console.log('Decoded JWT:', decoded);

      // Ensure the token contains a valid userId (or `id`)
      if (!decoded.userId && !decoded.id) {
        return res.status(400).json({ message: 'Token does not contain user information' });
      }

      // Use `decoded.id` if it is the field used in your token payload
      const userId = decoded.userId || decoded.id;

      // Find the user in the database (excluding the password field)
      req.user = await User.findById(userId).select('-password');

      // If user not found, send an error
      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Authorization failed:', error.message);

      // Check if the error is due to an expired token or malformed token
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please log in again' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  } else {
    // No token was provided in the Authorization header
    return res.status(403).json({ message: 'No token provided, access denied' });
  }
};

module.exports = { protect };
