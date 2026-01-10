const postService = require('../services/post.service');
const { sendResponse } = require('../utils/response');

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { imageUrl, caption, emotion, privacy } = req.body;

    if (!imageUrl) {
        return sendResponse(res, 400, false, 'Image URL is required');
    }

    const post = await postService.createPost(userId, { imageUrl, caption, emotion, privacy });
    sendResponse(res, 201, true, 'Post created', post);
  } catch (error) {
    next(error);
  }
};

// @desc    Get friends feed
// @route   GET /api/posts/feed
// @access  Private
const getFeed = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page, limit } = req.query;
    
    const posts = await postService.getFriendsFeed(userId, parseInt(page) || 1, parseInt(limit) || 10);
    sendResponse(res, 200, true, 'Feed retrieved', posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get my memories
// @route   GET /api/posts/memories
// @access  Private
const getMemories = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { page, limit } = req.query;

        const posts = await postService.getUserMemories(userId, parseInt(page) || 1, parseInt(limit) || 20);
        sendResponse(res, 200, true, 'Memories retrieved', posts);
    } catch (error) {
        next(error);
    }
}

module.exports = {
  createPost,
  getFeed,
  getMemories
};
