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
      // Handle both array response and { data: [] } format
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
  
  // Keep other potential methods in mind for future
  createPost: async (data: FormData) => {
    try {
      const response = await client.post('/posts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('createPost error:', error);
      throw error;
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
  }
};
