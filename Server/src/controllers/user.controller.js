const User = require('../models/User.model');
const { sendResponse } = require('../utils/response');

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public (or Private depending on needs, usually Protected but for now Public/Protected)
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-passwordHash -otp -otpExpires');

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'User fetched successfully', user);
  } catch (error) {
    if (error.kind === 'ObjectId') {
        return sendResponse(res, 404, false, 'User not found');
    }
    next(error);
  }
};

module.exports = {
  getUserById,
};
