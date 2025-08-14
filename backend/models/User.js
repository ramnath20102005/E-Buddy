const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  achievements: [{
    type: String
  }],
  certifications: [{
    type: String
  }],
  educationLevel: {
    type: String,
    enum: ['High School', 'Undergraduate', 'Graduate', 'Professional', 'Other', ''],
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    enum: ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years', ''],
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  profileCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
