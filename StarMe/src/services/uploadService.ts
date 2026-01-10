/**
 * Mock Upload Service
 * Giả lập việc upload file lên Cloud Storage (AWS S3, Cloudinary, Firebase Storage...)
 */

export const uploadImage = async (localUri: string): Promise<string> => {
  return new Promise((resolve) => {
    console.log(`[UploadService] Starting upload for: ${localUri}`);
    
    // Giả lập delay mạng (1.5 giây)
    setTimeout(() => {
      // Trong thực tế, bạn sẽ dùng fetch/axios để upload FormData
      // và server sẽ trả về URL ảnh online.
      
      // Ở đây ta giả lập server trả về một URL ảnh "remote"
      // Nếu là ảnh picsum (mock), ta giữ nguyên.
      // Nếu là file thật, ta giả vờ nó đã thành link http.
      const remoteUrl = localUri.startsWith('http') 
        ? localUri 
        : `https://fake-cloud-storage.com/${Date.now()}_image.jpg`;

      console.log(`[UploadService] Upload success: ${remoteUrl}`);
      resolve(remoteUrl);
    }, 1500);
  });
};
