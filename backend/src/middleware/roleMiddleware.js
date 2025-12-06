// Role-based access control middleware
const User = require('../models/User');

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      // Get user from request (attached by auth middleware)
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // Check if user's role is in the allowed roles
      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          message: `Access denied. Required role(s): ${roles.join(', ')}` 
        });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

// Specific role checkers
const isAdmin = checkRole(['admin']);
const isTeacher = checkRole(['teacher']);
const isStudent = checkRole(['student']);
const isTeacherOrAdmin = checkRole(['teacher', 'admin']);

module.exports = {
  checkRole,
  isAdmin,
  isTeacher,
  isStudent,
  isTeacherOrAdmin
};