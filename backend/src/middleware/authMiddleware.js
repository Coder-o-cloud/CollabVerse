// Authentication middleware
const { authUser } = require('../services/authService');

const authenticate = async (req, res, next) => {
  try {
    await authUser(req);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = {
  authenticate
};