// HOW IT WORKS:
// This module handles real-time chat functionality using Socket.IO
// It manages room joining/leaving and message broadcasting for both project chats and 1v1 messaging

const Message = require('../models/Message');

const chatHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Handle joining a project room
    socket.on('joinProjectRoom', (projectId) => {
      socket.join(projectId);
      console.log(`User ${socket.id} joined room ${projectId}`);
    });
    
    // Handle leaving a project room
    socket.on('leaveProjectRoom', (projectId) => {
      socket.leave(projectId);
      console.log(`User ${socket.id} left room ${projectId}`);
    });
    
    // Handle joining a 1v1 chat
    socket.on('joinPrivateChat', (userId) => {
      socket.join(`private_${userId}`);
      console.log(`User ${socket.id} joined private chat room for user ${userId}`);
    });
    
    // Handle leaving a 1v1 chat
    socket.on('leavePrivateChat', (userId) => {
      socket.leave(`private_${userId}`);
      console.log(`User ${socket.id} left private chat room for user ${userId}`);
    });
    
    // Handle sending a project message
    socket.on('sendMessage', (message) => {
      console.log('Project message received:', message);
      
      // Broadcast message to the project room
      io.to(message.projectId).emit('message', message);
    });
    
    // Handle sending a private message
    socket.on('sendPrivateMessage', async (data) => {
      console.log('Private message received:', data);
      
      const { senderId, recipientId, content } = data;
      
      try {
        // Save message to database
        const message = new Message({
          sender: senderId,
          recipient: recipientId,
          content: content
        });
        
        await message.save();
        
        // Populate sender info
        await message.populate('sender', 'name');
        
        // Emit message to recipient's private room
        io.to(`private_${recipientId}`).emit('privateMessage', message);
        
        // Also emit to sender's own socket for confirmation
        socket.emit('privateMessageSent', message);
      } catch (error) {
        console.error('Error sending private message:', error);
        socket.emit('privateMessageError', { error: 'Failed to send message' });
      }
    });
    
    // Handle marking messages as read
    socket.on('markMessagesAsRead', async (data) => {
      const { userId, senderId } = data;
      
      try {
        await Message.updateMany(
          { recipient: userId, sender: senderId, read: false },
          { read: true }
        );
        
        // Notify sender that messages have been read
        io.to(`private_${senderId}`).emit('messagesRead', { userId });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = chatHandler;