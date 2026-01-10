const notificationService = require('../services/notification.service');
const { sendResponse } = require('../utils/response');

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page, limit } = req.query;

    const notifications = await notificationService.getUserNotifications(userId, parseInt(page) || 1, parseInt(limit) || 20);
    sendResponse(res, 200, true, 'Notifications retrieved', notifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markRead = async (req, res, next) => {
  try {
      const { id } = req.params;
      const userId = req.user._id;
      
      await notificationService.markAsRead(id, userId);
      sendResponse(res, 200, true, 'Notification marked as read');
  } catch (error) {
      next(error);
  }
}

module.exports = {
  getNotifications,
  markRead
};
