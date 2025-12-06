// HOW IT WORKS:
// This controller manages project operations including creation, retrieval, updating, and team management
// It handles project visibility, member invitations, and join requests

const Project = require('../models/Project');
const User = require('../models/User');
const { authUser } = require('../services/authService');

// Create a new project
const createProject = async (req, res) => {
  try {
    const currentUser = await authUser(req);
    
    const project = new Project({
      ...req.body,
      ownerId: currentUser._id,
      members: [{
        userId: currentUser._id,
        role: 'owner'
      }]
    });
    
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ visibility: 'public' })
      .populate('ownerId', 'name email')
      .populate('members.userId', 'name email avatarUrl');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('ownerId', 'name email')
      .populate('members.userId', 'name email avatarUrl');
      
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const currentUser = await authUser(req);
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is the owner (with null safety)
    if (!project.ownerId || !currentUser._id || 
        project.ownerId.toString() !== currentUser._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'title', 'description', 'requiredSkills', 'visibility', 'status'
    ];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }
    
    updates.forEach(update => {
      project[update] = req.body[update];
    });
    
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Invite user to project
const inviteUser = async (req, res) => {
  try {
    const currentUser = await authUser(req);
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is the owner (with null safety)
    if (!project.ownerId || !currentUser._id || 
        project.ownerId.toString() !== currentUser._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { userId, role } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is already a member (with null safety)
    const isMember = project.members.some(member => 
      member.userId && member.userId.toString() === userId
    );
    
    if (isMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }
    
    // Add user to project
    project.members.push({ userId, role });
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Request to join project
const requestToJoin = async (req, res) => {
  try {
    const currentUser = await authUser(req);
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is already a member (with null safety)
    const isMember = project.members.some(member => 
      member.userId && currentUser._id && 
      member.userId.toString() === currentUser._id.toString()
    );
    
    if (isMember) {
      return res.status(400).json({ message: 'You are already a member' });
    }
    
    // For simplicity, we'll auto-accept join requests
    // In a real app, this would send a notification to the owner
    project.members.push({ 
      userId: currentUser._id, 
      role: 'member' 
    });
    
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  inviteUser,
  requestToJoin
};