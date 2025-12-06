// HOW IT WORKS:
// This controller handles project rating functionality
// Users can rate their teammates after project completion

const Rating = require('../models/Rating');
const User = require('../models/User');
const Project = require('../models/Project');
const { authUser } = require('../services/authService');

// Rate a teammate in a project
const rateTeammate = async (req, res) => {
  try {
    const currentUser = await authUser(req);
    const { projectId } = req.params;
    const { ratedUserId, score, comment } = req.body;
    
    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify user is a member of the project
    const isMember = project.members.some(member => 
      member.userId.toString() === currentUser._id.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Verify rated user is a member of the project
    const isRatedUserMember = project.members.some(member => 
      member.userId.toString() === ratedUserId
    );
    
    if (!isRatedUserMember) {
      return res.status(400).json({ message: 'User is not a member of this project' });
    }
    
    // Prevent users from rating themselves
    if (currentUser._id.toString() === ratedUserId) {
      return res.status(400).json({ message: 'You cannot rate yourself' });
    }
    
    // Validate score
    if (score < 1 || score > 5) {
      return res.status(400).json({ message: 'Score must be between 1 and 5' });
    }
    
    // Check if rating already exists
    const existingRating = await Rating.findOne({
      projectId,
      raterId: currentUser._id,
      ratedUserId
    });
    
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this user for this project' });
    }
    
    // Create rating
    const rating = new Rating({
      projectId,
      raterId: currentUser._id,
      ratedUserId,
      score,
      comment
    });
    
    await rating.save();
    
    // Update user's average rating
    const userRatings = await Rating.find({ ratedUserId });
    const totalScore = userRatings.reduce((sum, r) => sum + r.score, 0);
    const avg = totalScore / userRatings.length;
    
    await User.findByIdAndUpdate(ratedUserId, {
      'rating.avg': avg,
      'rating.count': userRatings.length
    });
    
    res.status(201).json(rating);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  rateTeammate
};