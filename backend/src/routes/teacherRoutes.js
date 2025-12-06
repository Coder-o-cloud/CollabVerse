const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { isTeacher } = require('../middleware/roleMiddleware');
const Project = require('../models/Project');

// Apply authentication middleware to all routes
router.use(authenticate);

// Apply teacher role middleware to all routes
router.use(isTeacher);

// GET /api/teacher/projects - Get projects assigned to teacher for review
router.get('/projects', async (req, res) => {
  try {
    // In a real implementation, you would query projects assigned to this teacher
    // For now, we'll return all projects as an example
    const projects = await Project.find()
      .populate('ownerId', 'name email')
      .populate('members.userId', 'name email');
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/teacher/projects/:id/review - Submit project review
router.post('/projects/:id/review', async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    
    // Validate input
    if (!grade || !feedback) {
      return res.status(400).json({ message: 'Grade and feedback are required' });
    }
    
    // In a real implementation, you would:
    // 1. Verify the project exists
    // 2. Verify the teacher is assigned to review this project
    // 3. Update the project with the review
    // 4. Possibly notify the student team
    
    // For now, we'll just return a success response
    res.json({ 
      message: 'Review submitted successfully',
      projectId: req.params.id,
      grade,
      feedback
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;