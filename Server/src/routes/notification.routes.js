const express = require('express');
const router = express.Router();
const { getNotifications, markRead } = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markRead);

module.exports = router;
