const express = require('express');
const router = express.Router();
const { sendRequest, acceptRequest, getFriends, getPending } = require('../controllers/friend.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect); // All routes are protected

router.post('/request', sendRequest);
router.post('/accept', acceptRequest);
router.get('/', getFriends);
router.get('/pending', getPending);

module.exports = router;
