const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  raterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String
  }
}, {
  timestamps: true
});

// Ensure a user can only rate another user once per project
ratingSchema.index({ projectId: 1, raterId: 1, ratedUserId: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;