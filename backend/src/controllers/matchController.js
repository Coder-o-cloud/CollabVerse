// HOW IT WORKS:
// This controller handles the matching algorithm endpoint
// It calculates and returns ranked users based on project requirements or required skills

const Project = require('../models/Project');
const { calculateMatchScore } = require('../services/matchingService');

// Get matching users for a project or skills
const getMatches = async (req, res) => {
  try {
    const { projectId, requiredSkills } = req.body;
    
    let project;
    
    if (projectId) {
      // Get project by ID
      project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
    } else if (requiredSkills) {
      // Create a temporary project object with provided skills
      project = {
        requiredSkills,
        ownerId: null // No owner for skill-based matching
      };
    } else {
      return res.status(400).json({ message: 'Either projectId or requiredSkills is required' });
    }
    
    // Calculate matches
    const matches = await calculateMatchScore(project);
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMatches
};