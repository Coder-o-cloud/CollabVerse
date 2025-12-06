// HOW IT WORKS:
// This service handles JWT token generation and validation for authentication
// It creates access tokens and optionally refresh tokens for secure user sessions

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_ACCESS_SECRET || 'access_secret_key',
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
    { expiresIn: '7d' }
  );
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

const authUser = async (req) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Access denied. No token provided.');
  }
  
  try {
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET || 'access_secret_key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error('Invalid token.');
    }
    
    // Attach user to request object
    req.user = user;
    
    return user;
  } catch (error) {
    throw new Error('Invalid token.');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  authUser
};