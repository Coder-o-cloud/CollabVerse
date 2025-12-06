const mongoose = require('mongoose');

const requiredSkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
});

const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [requiredSkillSchema],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [memberSchema],
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed'],
    default: 'planning'
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;