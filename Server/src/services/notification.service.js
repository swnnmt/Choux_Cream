const Notification = require('../models/Notification.model');

/**
 * Create notification
 */
const createNotification = async (toUserId, fromUserId, type, postId = null) => {
  try {
      await Notification.create({
        userId: toUserId,
        fromUserId,
        type,
        postId
      });
  } catch (error) {
      console.error('Error creating notification:', error);
      // Fail silently to not block main flow
  }
};

/**
 * Get user notifications
 */
const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('fromUserId', 'username avatarUrl')
    .populate('postId', 'imageUrl');
    
  return notifications;
};

/**
 * Mark notification as read
 */
const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOne({ _id: notificationId, userId });
    if (notification) {
        notification.isRead = true;
        await notification.save();
    }
    return notification;
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead
};
