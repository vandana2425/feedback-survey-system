// routes/dashboardRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Adjust path as necessary
const router = express.Router();

// A protected route that requires a valid JWT token
router.get('/dashboard', protect, (req, res) => {
  res.json({ message: `Welcome to the dashboard, ${req.user.email}` });
});

module.exports = router;
