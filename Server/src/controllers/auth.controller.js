const authService = require('../services/auth.service');
const { sendResponse } = require('../utils/response');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { username, email, password, avatarUrl, confirmPassword, deviceToken, platform } = req.body;

    if (!username || !email || !password) {
      return sendResponse(res, 400, false, 'Please provide all required fields');
    }

    if (password !== confirmPassword) {
      return sendResponse(res, 400, false, 'Passwords do not match');
    }

    const userData = { username, email, password, avatarUrl, deviceToken, platform };
    const result = await authService.register(userData);

    sendResponse(res, 201, true, 'OTP sent to email. Please verify.', result);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Email OTP
// @route   POST /api/auth/verify
// @access  Public
const verify = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return sendResponse(res, 400, false, 'Email and OTP are required');
        }

        const result = await authService.verifyEmail(email, otp);
        sendResponse(res, 200, true, 'Email verified successfully', result);
    } catch (error) {
        if (error.message === 'Verification record not found') {
            return sendResponse(res, 404, false, error.message);
        }
        if (error.message === 'Invalid OTP') {
            return sendResponse(res, 400, false, error.message);
        }
        if (error.message === 'OTP expired') {
            return sendResponse(res, 400, false, error.message);
        }
        next(error);
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return sendResponse(res, 400, false, 'Email is required');
        }

        const result = await authService.resendOtp(email);
        sendResponse(res, 200, true, 'OTP resent successfully', result);
    } catch (error) {
        if (error.message === 'Verification record not found') {
            return sendResponse(res, 404, false, error.message);
        }
        next(error);
    }
}

// @desc    Request OTP for email (pre-registration)
// @route   POST /api/auth/request-otp
// @access  Public
const requestOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return sendResponse(res, 400, false, 'Email is required');
        }
        const result = await authService.requestOtp(email);
        sendResponse(res, 200, true, 'OTP sent', result);
    } catch (error) {
        next(error);
    }
}

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password, deviceToken, platform } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, 'Please provide email and password');
    }

    const result = await authService.login(email, password, deviceToken, platform);

    sendResponse(res, 200, true, 'Login successful', result);
  } catch (error) {
    // Check for specific error message to return 401
    if (error.message === 'Invalid email or password') {
        return sendResponse(res, 401, false, error.message);
    }
    if (error.message === 'Email not verified') {
        return sendResponse(res, 403, false, error.message, { needsVerification: true });
    }
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    sendResponse(res, 200, true, 'User profile retrieved', req.user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { username, avatarUrl } = req.body;
        
        const result = await authService.updateProfile(userId, { username, avatarUrl });
        sendResponse(res, 200, true, 'Profile updated successfully', result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
  register,
  login,
  getMe,
  verify,
  resendOtp,
  updateProfile,
  requestOtp
};
