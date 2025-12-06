const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
});

const availabilitySchema = new mongoose.Schema({
  timezone: {
    type: String,
    required: true
  },
  hours: {
    type: String,
    required: true
  }
});

const ratingSchema = new mongoose.Schema({
  avg: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  skills: [skillSchema],
  interests: [{
    type: String
  }],
  bio: {
    type: String
  },
  availability: availabilitySchema,
  portfolioLinks: [{
    type: String
  }],
  avatarUrl: {
    type: String
  },
  rating: ratingSchema
}, {
  timestamps: true
});

userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Unable to login');
  }
  
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Unable to login');
  }
  
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;