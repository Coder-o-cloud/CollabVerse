// HOW IT WORKS:
// This component provides a real-time chat interface for project communication
// It uses Socket.IO to send and receive messages in real-time

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const ChatWindow = ({ projectId, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    
    // Join project room
    socketRef.current.emit('joinProjectRoom', projectId);
    
    // Listen for new messages
    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leaveProjectRoom', projectId);
        socketRef.current.disconnect();
      }
    };
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    const message = {
      text: newMessage,
      sender: user?._id,
      senderName: user?.name,
      timestamp: new Date(),
      projectId
    };
    
    // Emit message to server
    socketRef.current.emit('sendMessage', message);
    
    // Add to local messages
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="card h-96 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold">Project Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 ${message.sender === user?._id ? 'text-right' : ''}`}
          >
            <div className="text-xs text-gray-500 mb-1">
              {message.senderName} • {formatTime(message.timestamp)}
            </div>
            <div 
              className={`inline-block p-2 rounded-lg max-w-xs md:max-w-md ${
                message.sender === user?._id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
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
  );
};

export default ChatWindow;