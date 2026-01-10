const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User.model');
const { sendResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
        return sendResponse(res, 401, false, 'Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      return sendResponse(res, 401, false, 'Not authorized, token failed');
    }
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Not authorized, no token');
  }
};

module.exports = { protect };
