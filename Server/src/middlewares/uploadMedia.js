const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const createCloudinaryStorage = ({ folder, resourceType = 'image' }) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      resource_type: resourceType, // image | video
      allowed_formats:
        resourceType === 'image'
          ? ['jpg', 'png', 'jpeg', 'webp']
          : ['mp4', 'mov', 'webm'],
    },
  });

const createUploader = ({ folder, resourceType }) => {
  const storage = createCloudinaryStorage({ folder, resourceType });
  return multer({ storage });
};

module.exports = { createUploader };
