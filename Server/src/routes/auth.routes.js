const express = require('express');
const router = express.Router();
const { register, login, getMe, verify, resendOtp, updateProfile, requestOtp } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/request-otp', requestOtp);
router.post('/verify', verify);
router.post('/resend-otp', resendOtp);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
