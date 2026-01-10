const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    privacy: {
      type: String,
      enum: ['friends', 'public', 'private'],
      default: 'friends',
    },
    emotion: {
      type: String, // e.g., 'happy', 'sad', emoji codes
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index to query feed quickly
postSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema, 'Post');
