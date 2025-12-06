const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { isStudent } = require('../middleware/roleMiddleware');
const Project = require('../models/Project');

// Apply authentication middleware to all routes
router.use(authenticate);

// Apply student role middleware to all routes
router.use(isStudent);

// GET /api/student/projects - Get projects where student is a member
router.get('/projects', async (req, res) => {
  try {
    // Find projects where the current user is a member
    const projects = await Project.find({
      'members.userId': req.user._id
    })
    .populate('ownerId', 'name email')
    .populate('members.userId', 'name email');
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;