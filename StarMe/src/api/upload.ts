import client from './client';

export const uploadApi = {
  uploadAvatar: async (imagePath: string) => {
    const formData = new FormData();

    formData.append('file', {
      uri: imagePath,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    const res = await client.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.data?.url || res.data.url;
  },

  uploadPostImage: async (imagePath: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: imagePath,
      type: 'image/jpeg',
      name: 'post.jpg',
    } as any);

    const res = await client.post('/upload/post/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.data?.url || res.data.url;
  },

  uploadPostVideo: async (videoPath: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: videoPath,
      type: 'video/mp4',
      name: 'video.mp4',
    } as any);

    const res = await client.post('/upload/post/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.url;
  },
};
