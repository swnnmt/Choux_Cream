const express = require('express');
const router = express.Router();
const { createPost, getFeed, getMemories } = require('../controllers/post.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/', createPost);
router.get('/feed', getFeed);
router.get('/memories', getMemories);

module.exports = router;
