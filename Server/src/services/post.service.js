const Post = require('../models/Post.model');
const friendService = require('./friend.service');
const notificationService = require('./notification.service');

/**
 * Create a new post
 */
const createPost = async (userId, postData) => {
  const post = await Post.create({
    userId,
    ...postData,
  });

    const friends = await friendService.getFriends(userId);

   for (const friend of friends) {
    await notificationService.createNotification(
      friend._id,   // toUserId
      userId,       // fromUserId
      'new_post',
      post._id
    );
  }
  
  return post;
};

/**
 * Get feed (posts from friends)
 */
const getFriendsFeed = async (userId, page = 1, limit = 10) => {
  const friends = await friendService.getFriends(userId);
  const friendIds = friends.map(f => f._id);

  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const query = {
    userId: { $in: friendIds },
    privacy: { $ne: 'private' },
    createdAt: { $gte: last24Hours },
  };

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('userId', 'username avatarUrl');

  return posts;
};


/**
 * Get user memories (my posts)
 */
const getUserMemories = async (userId, page = 1, limit = 20) => {
  const posts = await Post.find({ userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('userId', 'username avatarUrl');

  return posts;
};

module.exports = {
  createPost,
  getFriendsFeed,
  getUserMemories
};
