// HOW IT WORKS:
// This is the entry point for the Express.js server
// It connects to MongoDB, sets up middleware, routes, and starts the server
// Socket.io is also initialized here for real-time communication

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store IO instance for use in other files
app.set('io', io);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collabverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Configure CORS middleware with more permissive settings for file uploads
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
const projectRoutes = require('./src/routes/projectRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/projects', projectRoutes);
app.use('/api/projects', taskRoutes); // Mount task routes under /api/projects
app.use('/api/uploads', require('./src/routes/uploadRoutes'));
app.use('/api/match', require('./src/routes/matchRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/teacher', require('./src/routes/teacherRoutes'));
app.use('/api/student', require('./src/routes/studentRoutes'));
app.use('/api/messages', require('./src/routes/messageRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle socket connections
require('./src/socket/chatHandler')(io);