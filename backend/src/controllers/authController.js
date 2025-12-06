// HOW IT WORKS:
// This controller handles user authentication including registration, login, and fetching user profile
// It uses bcrypt for password hashing and JWT for token-based authentication

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateAccessToken, authUser } = require('../services/authService');

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password, college, role = 'student' } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Validate role
    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create user
    const user = new User({
      name,
      email,
      passwordHash,
      college,
      role,
      skills: [],
      interests: [],
      portfolioLinks: [],
      rating: { avg: 0, count: 0 }
    });
    
    await user.save();
    
    // Generate token
    const token = generateAccessToken(user);
    
    res.status(201).json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user and check password
    const user = await User.findByCredentials(email, password);
    
    // Generate token
    const token = generateAccessToken(user);
    
    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid credentials' });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  try {
    const user = await authUser(req);
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = {
  register,
  login,
  getMe
};