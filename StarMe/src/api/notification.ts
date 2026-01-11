import client from './client';

export interface NotificationItem {
  _id: string;
  userId: string;
  fromUserId: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  type: 'new_post' | 'reaction' | 'friend_request';
  postId?: {
    _id: string;
    imageUrl?: string;
  };
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  getNotifications: async () => {
    try {
      const response = await client.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('getNotifications error:', error);
      return [];
    }
  },

  getUnreadCount: async () => {
      try {
          const response = await client.get('/notifications/unread-count');
          const data = response.data;
          // Handle various response structures
          if (data && typeof data.count === 'number') {
              return { count: data.count };
          }
          if (data && data.data && typeof data.data.count === 'number') {
              return { count: data.data.count };
          }
          return { count: 0 };
      } catch (error) {
          console.error('getUnreadCount error', error);
          return { count: 0 };
      }
  },

  markAsRead: async (id: string) => {
    try {
      const response = await client.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('markAsRead error:', error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await client.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('markAllAsRead error:', error);
      throw error;
    }
  }
};
