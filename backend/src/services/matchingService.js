// HOW IT WORKS:
// This service calculates matching scores between users and projects
// It uses a weighted formula combining skills, availability, ratings, and complementary skills

const User = require('../models/User');

// Calculate skills score based on required skills and user skills
const calculateSkillsScore = (requiredSkills, userSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return 100;
  if (!userSkills || userSkills.length === 0) return 0;
  
  let totalWeight = 0;
  let matchedScore = 0;
  
  for (const reqSkill of requiredSkills) {
    totalWeight += reqSkill.weight;
    
    const userSkill = userSkills.find(skill => 
      skill.name.toLowerCase() === reqSkill.name.toLowerCase()
    );
    
    if (userSkill) {
      // Weighted score based on skill level match
      matchedScore += (userSkill.level / 5) * reqSkill.weight;
    }
  }
  
  return totalWeight > 0 ? (matchedScore / totalWeight) * 100 : 0;
};

// Calculate availability score based on timezone and hours compatibility
const calculateAvailabilityScore = (projectOwnerId, userAvailability) => {
  // In a real implementation, this would compare timezones and available hours
  // For now, we'll return a moderate score as a placeholder
  return 75;
};

// Calculate rating score based on user's average rating
const calculateRatingScore = (userRating) => {
  if (!userRating || userRating.count === 0) return 50; // Default for unrated users
  // Normalize rating to 0-100 scale (assuming 1-5 star rating system)
  return (userRating.avg / 5) * 100;
};

// Calculate complementary skills score
const calculateComplementaryScore = (requiredSkills, userSkills) => {
  if (!userSkills || userSkills.length === 0) return 0;
  
  // Count skills that are not explicitly required but might be useful
  const requiredSkillNames = requiredSkills.map(s => s.name.toLowerCase());
  const complementarySkills = userSkills.filter(skill => 
    !requiredSkillNames.includes(skill.name.toLowerCase())
  );
  
  // Score based on number and level of complementary skills
  const score = Math.min(100, complementarySkills.reduce((sum, skill) => sum + (skill.level * 10), 0));
  return score;
};

// Main matching function
const calculateMatchScore = async (project, userId = null) => {
  let users = [];
  
  if (userId) {
    const user = await User.findById(userId);
    if (user) users = [user];
  } else {
    // Get all users for project matching
    users = await User.find({});
  }
  
  const results = [];
  
  for (const user of users) {
    // Skip the project owner in matching results
    if (user._id.toString() === project.ownerId.toString()) continue;
    
    const skillsScore = calculateSkillsScore(project.requiredSkills, user.skills);
    const availabilityScore = calculateAvailabilityScore(project.ownerId, user.availability);
    const ratingScore = calculateRatingScore(user.rating);
    const complementaryScore = calculateComplementaryScore(project.requiredSkills, user.skills);
    
    // Weighted final score
    // skills: 55%, availability: 20%, rating: 15%, complementary: 10%
    const finalScore = 
      (skillsScore * 0.55) + 
      (availabilityScore * 0.20) + 
      (ratingScore * 0.15) + 
      (complementaryScore * 0.10);
    
    results.push({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatarUrl,
      userCollege: user.college,
      score: Math.round(finalScore),
      explain: {
        skillsScore: Math.round(skillsScore),
        availabilityScore: Math.round(availabilityScore),
        ratingScore: Math.round(ratingScore),
        complementaryScore: Math.round(complementaryScore)
      }
    });
  }
  
  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  
  return results;
};

module.exports = {
  calculateMatchScore
};