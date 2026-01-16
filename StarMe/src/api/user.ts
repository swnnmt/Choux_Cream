import client from './client';

export interface User {
  _id: string;
  username: string;
  avatar?: string;
  avatarUrl?: string;
}

export const userApi = {
  getUserById: async (id: string) => {
    try {
      const response = await client.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('getUserById error:', error);
      return null;
    }
  },

  getFriends: async () => {
    try {
      const response = await client.get('/friends');
      return response.data;
    } catch (error) {
      console.error('getFriends error:', error);
      return [];
    }
  },
};
