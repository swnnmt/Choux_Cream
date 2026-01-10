const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: 150,
    },
    deviceToken: {
      type: String, // Firebase Cloud Messaging Token
      default: '',
    },
    platform: {
      type: String,
      enum: ['ios', 'android', 'web', 'unknown'],
      default: 'unknown',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Indexes for faster search
// userSchema.index({ username: 1 }); // Already indexed by unique: true
// userSchema.index({ email: 1 }); // Already indexed by unique: true

module.exports = mongoose.model('User', userSchema ,'User');
