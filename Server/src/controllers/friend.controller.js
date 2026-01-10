const friendService = require('../services/friend.service');
const { sendResponse } = require('../utils/response');

// @desc    Send friend request
// @route   POST /api/friends/request
// @access  Private
const sendRequest = async (req, res, next) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id.toString();

    if (!friendId) {
        return sendResponse(res, 400, false, 'Friend ID is required');
    }

    const result = await friendService.sendFriendRequest(userId, friendId);
    sendResponse(res, 200, true, 'Friend request sent', result);
  } catch (error) {
    next(error);
  }
};

// @desc    Accept friend request
// @route   POST /api/friends/accept
// @access  Private
const acceptRequest = async (req, res, next) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user._id.toString();

    if (!requesterId) {
        return sendResponse(res, 400, false, 'Requester ID is required');
    }

    const result = await friendService.acceptFriendRequest(userId, requesterId);
    sendResponse(res, 200, true, 'Friend request accepted', result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get my friends
// @route   GET /api/friends
// @access  Private
const getFriends = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const friends = await friendService.getFriends(userId);
    sendResponse(res, 200, true, 'Friends list retrieved', friends);
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending friend requests
// @route   GET /api/friends/pending
// @access  Private
const getPending = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const requests = await friendService.getPendingRequests(userId);
        sendResponse(res, 200, true, 'Pending requests retrieved', requests);
    } catch (error) {
        next(error);
    }
}

module.exports = {
  sendRequest,
  acceptRequest,
  getFriends,
  getPending
};
