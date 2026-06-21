/**
 * @file Centralized error handling middleware.
 */

const logger = require('../utils/logger');

/**
 * Global error handler middleware.
 * @param {Error} err - Error object.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(err.message, { requestId: req.id, stack: err.stack });

  const statusCode = err.statusCode || 500;
  
  // Do not expose internal error details in production
  const response = {
    message: statusCode === 500 ? 'Internal Server Error' : err.message,
    requestId: req.id,
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = { errorHandler };
