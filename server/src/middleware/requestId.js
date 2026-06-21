/**
 * @file Middleware to attach a unique request ID for tracing.
 */

const crypto = require('crypto');

/**
 * Attaches a unique request ID to each request for tracing.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 */
function requestId(req, res, next) {
  const id = crypto.randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
}

module.exports = { requestId };
