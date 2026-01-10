const express = require('express');
const router = express.Router();
const { createUploader } = require('../middlewares/uploadMedia');
const { uploadMedia } = require('../controllers/upload.controller');
const { protect } = require('../middlewares/auth.middleware');

// Upload avatar
router.post('/avatar',createUploader({ folder: 'avatars', resourceType: 'image' }).single('file'),uploadMedia);

// Upload post image
router.post('/post/image',protect,createUploader({ folder: 'posts/images', resourceType: 'image' }).single('file'),uploadMedia);

// Upload post video
router.post( '/post/video',protect,createUploader({ folder: 'posts/videos', resourceType: 'video' }).single('file'),uploadMedia);

module.exports = router;
