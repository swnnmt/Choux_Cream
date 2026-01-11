import client from './client';

export interface User {
  _id: string;
  username: string;
  avatar?: string;
  avatarUrl?: string;
  // Add other fields as needed
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
  }
};
