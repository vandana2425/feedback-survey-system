require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Form = require('../models/Form');
const { protect } = require('../middleware/authMiddleware'); // Import the middleware

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.message || error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Error during login:', error.message || error);
    return res.status(500).json({ message: 'Server error', error: error.message || error });
  }
});

// Protected route to get forms for a user
router.get('/forms/user', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId); // Assuming req.userId is set correctly
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const forms = await Form.find({ userId: user._id });
    console.log('Forms fetched:', forms); // Add this log to check if forms are retrieved
    res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching user forms:', error.message || error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
