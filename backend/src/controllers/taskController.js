// HOW IT WORKS:
// This controller manages task operations within projects
// It handles creating, updating, and retrieving tasks with Kanban board functionality

const Task = require('../models/Task');
const Project = require('../models/Project');
const { authUser } = require('../services/authService');

// Create a new task
const createTask = async (req, res) => {
  try {
    const currentUser = await authUser(req);
    const { projectId } = req.params;
    
    // Verify user is a member of the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Safely check if user is a member
    const isMember = project.members.some(member => 
      member.userId && currentUser._id && 
      member.userId.toString() === currentUser._id.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const task = new Task({
      ...req.body,
      projectId
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const currentUser = await authUser(req);
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify user is a member of the project
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Safely check if user is a member
    const isMember = project.members.some(member => 
      member.userId && currentUser._id && 
      member.userId.toString() === currentUser._id.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'status', 'assignedTo', 'dueDate'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }
    
    updates.forEach(update => {
      task[update] = req.body[update];
    });
    
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get tasks for a project
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const tasks = await Task.find({ projectId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  getTasksByProject
};