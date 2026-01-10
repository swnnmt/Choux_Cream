const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'blocked'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique friendship pair (avoid duplicates like A->B and A->B again)
friendshipSchema.index({ userId: 1, friendId: 1 }, { unique: true });

// Index for fetching friend lists quickly
friendshipSchema.index({ userId: 1, status: 1 });
friendshipSchema.index({ friendId: 1, status: 1 });

module.exports = mongoose.model('Friendship', friendshipSchema, 'Friendship');
