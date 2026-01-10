const Friendship = require('../models/Friendship.model');
const notificationService = require('./notification.service');
const User = require('../models/User.model');

/**
 * Send friend request
 */
const sendFriendRequest = async (userId, friendId) => {
  if (userId === friendId) {
    throw new Error('Cannot send friend request to yourself');
  }

  // Check if target user exists
  const friendExists = await User.findById(friendId);
  if (!friendExists) {
    throw new Error('User not found');
  }

  // Check if friendship already exists (in either direction)
  const existingFriendship = await Friendship.findOne({
    $or: [
      { userId: userId, friendId: friendId },
      { userId: friendId, friendId: userId },
    ],
  });

  if (existingFriendship) {
    if (existingFriendship.status === 'pending') {
        throw new Error('Friend request already pending');
    }
    if (existingFriendship.status === 'accepted') {
        throw new Error('Already friends');
    }
    if (existingFriendship.status === 'blocked') {
        throw new Error('Cannot send request');
    }
  }

  // Create new request
  const friendship = await Friendship.create({
    userId: userId, // Requester
    friendId: friendId, // Recipient
    status: 'pending',
  });

  // Create notification
  await notificationService.createNotification(
      friendId,
      userId,
      'friend_request'
  );

  return friendship;
};

/**
 * Accept friend request
 */
const acceptFriendRequest = async (userId, requesterId) => {
  // Find the pending request where current user is the recipient (friendId)
  const friendship = await Friendship.findOne({
    userId: requesterId,
    friendId: userId,
    status: 'pending',
  });

  if (!friendship) {
    throw new Error('Friend request not found');
  }

  friendship.status = 'accepted';
  await friendship.save();

  return friendship;
};

/**
 * Get friend list
 */
const getFriends = async (userId) => {
  // Find accepted friendships where user is either sender or receiver
  const friendships = await Friendship.find({
    $or: [{ userId: userId }, { friendId: userId }],
    status: 'accepted',
  }).populate('userId friendId', 'username email avatarUrl');

  // Map to get the *other* user
  const friends = friendships.map((f) => {
    if (f.userId._id.toString() === userId.toString()) {
      return f.friendId;
    } else {
      return f.userId;
    }
  });

  return friends;
};

/**
 * Get pending requests (received)
 */
const getPendingRequests = async (userId) => {
    const requests = await Friendship.find({
        friendId: userId,
        status: 'pending'
    }).populate('userId', 'username email avatarUrl');

    return requests;
}

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  getPendingRequests
};
