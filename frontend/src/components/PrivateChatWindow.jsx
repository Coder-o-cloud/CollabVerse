// HOW IT WORKS:
// This component provides a real-time 1v1 chat interface
// It uses Socket.IO to send and receive private messages in real-time

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/api';

const PrivateChatWindow = ({ recipient, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5002');
    
    // Join private chat room
    socketRef.current.emit('joinPrivateChat', user._id);
    
    // Load message history
    const loadMessageHistory = async () => {
      try {
        const history = await apiClient.getMessageHistory(recipient._id);
        setMessages(history);
      } catch (error) {
        console.error('Failed to load message history:', error);
      }
    };
    
    loadMessageHistory();
    
    // Listen for new private messages
    socketRef.current.on('privateMessage', (message) => {
      // Only add messages from the current recipient
      if (message.sender._id === recipient._id) {
        setMessages(prev => [...prev, message]);
      }
    });
    
    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leavePrivateChat', user._id);
        socketRef.current.disconnect();
      }
    };
  }, [recipient._id, user._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when chat window opens
    if (socketRef.current) {
      socketRef.current.emit('markMessagesAsRead', {
        userId: user._id,
        senderId: recipient._id
      });
    }
  }, [recipient._id, user._id]);

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    const messageData = {
      senderId: user._id,
      recipientId: recipient._id,
      content: newMessage
    };
    
    // Emit message to server
    socketRef.current.emit('sendPrivateMessage', messageData);
    
    // Clear input
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold">Chat with {recipient.name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div 
              key={message._id} 
              className={`mb-4 ${message.sender._id === user._id ? 'text-right' : ''}`}
            >
              <div className="text-xs text-gray-500 mb-1">
                {message.sender.name} • {formatTime(message.timestamp)}
              </div>
              <div 
                className={`inline-block p-2 rounded-lg max-w-xs md:max-w-md ${
                  message.sender._id === user._id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="form-input flex-1 mr-2"
            />
            <button type="submit" className="btn-primary">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrivateChatWindow;