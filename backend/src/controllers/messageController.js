// HOW IT WORKS:
// This controller handles message-related operations for 1v1 messaging
// It provides endpoints for fetching message history and managing messages

const Message = require('../models/Message');
const User = require('../models/User');

// Get message history between two users
const getMessageHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    
    // Fetch messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId }
      ]
    })
    .populate('sender', 'name')
    .populate('recipient', 'name')
    .sort({ timestamp: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { recipient: currentUserId, sender: userId, read: false },
      { read: true }
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({ message: 'Failed to fetch message history' });
  }
};

// Get unread message counts
const getUnreadCounts = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    // Aggregate unread messages by sender
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          recipient: currentUserId,
          read: false
        }
      },
      {
        $group: {
          _id: '$sender',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'senderInfo'
        }
      },
      {
        $project: {
          senderId: '$_id',
          count: 1,
          senderName: { $arrayElemAt: ['$senderInfo.name', 0] }
        }
      }
    ]);
    
    res.json(unreadCounts);
  } catch (error) {
    console.error('Error fetching unread counts:', error);
    res.status(500).json({ message: 'Failed to fetch unread counts' });
  }
};

module.exports = {
  getMessageHistory,
  getUnreadCounts
};