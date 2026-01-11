const Notification = require('../models/Notification.model');
const { getIO } = require('../socket');

/**
 * Create notification
 */
const createNotification = async (toUserId, fromUserId, type, postId = null) => {
  try {
      const notification = await Notification.create({
        userId: toUserId,
        fromUserId,
        type,
        postId
      });

      // Populate data for frontend
      const populatedNotification = await Notification.findById(notification._id)
        .populate('fromUserId', 'username avatarUrl')
        .populate('postId', 'imageUrl');

      // Emit socket event
      try {
        const io = getIO();
        io.to(`user_${toUserId}`).emit('new_notification', populatedNotification);
      } catch (socketError) {
        console.error('Socket emit error:', socketError.message);
      }
      
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
 * Get unread count
 */
const getUnreadCount = async (userId) => {
    const count = await Notification.countDocuments({ userId, isRead: false });
    return count;
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

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (userId) => {
    await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
    );
    return { success: true };
};

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};
