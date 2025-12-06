// HOW IT WORKS:
// This controller handles user-related operations like fetching users, getting user details, and updating user profiles
// It supports search functionality with filters for skills, college, and minimum rating

const User = require('../models/User');
const { authUser } = require('../services/authService');

// Get all users with optional filtering
const getUsers = async (req, res) => {
  try {
    const { skill, college, minRating } = req.query;
    
    let query = {};
    
    // Apply filters if provided
    if (skill) {
      query.skills = { $elemMatch: { name: new RegExp(skill, 'i') } };
    }
    
    if (college) {
      query.college = new RegExp(college, 'i');
    }
    
    if (minRating) {
      query['rating.avg'] = { $gte: parseFloat(minRating) };
    }
    
    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const currentUser = await authUser(req);
    
    // Check if user is authorized to update this profile
    if (currentUser._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'name', 'college', 'skills', 'interests', 'bio', 
      'availability', 'portfolioLinks', 'avatarUrl'
    ];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    updates.forEach(update => {
      user[update] = req.body[update];
    });
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser
};