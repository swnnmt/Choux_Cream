import client from './client';

export interface Post {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatarUrl?: string;
  } | string;
  imageUrl: string;
  caption?: string;
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const postApi = {
  getFeed: async () => {
    try {
      const response = await client.get('/posts/feed');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('getFeed error:', error);
      return [];
    }
  },

  createPost: async (data: { imageUrl: string; caption?: string; emotion?: string; privacy?: string }) => {
    try {
      const response = await client.post('/posts', data);
      return response.data;
    } catch (error) {
      console.error('createPost error:', error);
      throw error;
    } 
  },

  getMemories: async () => {
    try {
      const response = await client.get('/posts/memories');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('getMemories error:', error);
      return [];
    }
  },

  getUserPosts: async (userId: string) => {
    try {
      const response = await client.get(`/posts/user/${userId}`);
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('getUserPosts error:', error);
      return [];
    }
  },
};
