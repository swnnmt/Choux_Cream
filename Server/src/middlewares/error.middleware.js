const { sendResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  
  console.error('Error:', err.message);

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
     return sendResponse(res, 404, false, 'Resource not found');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
      return sendResponse(res, 400, false, 'Duplicate field value entered');
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      return sendResponse(res, 400, false, message);
  }

  sendResponse(res, statusCode === 200 ? 500 : statusCode, false, err.message || 'Server Error', {
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
