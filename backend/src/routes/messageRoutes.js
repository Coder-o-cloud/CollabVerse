// HOW IT WORKS:
// This file defines the routes for message-related operations
// It includes endpoints for fetching message history and unread counts

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get message history between current user and another user
router.get('/history/:userId', messageController.getMessageHistory);

// Get unread message counts
router.get('/unread', messageController.getUnreadCounts);

module.exports = router;