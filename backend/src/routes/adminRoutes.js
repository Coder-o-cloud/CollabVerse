const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const User = require('../models/User');

// Apply authentication middleware to all routes
router.use(authenticate);

// Apply admin role middleware to all routes
router.use(isAdmin);

// GET /api/admin/users - Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-passwordHash'); // Exclude password hashes
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/users/:id - Get specific user (admin only)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/users/:id/role - Update user role (admin only)
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: '-passwordHash' }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;