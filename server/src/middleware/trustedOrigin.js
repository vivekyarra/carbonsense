/**
 * @file Origin validation for browser requests that rely on cookies.
 */

const { config } = require('../config/env');

/**
 * Rejects cross-site browser requests to cookie-authenticated endpoints.
 * Requests without an Origin header remain available to non-browser clients.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function requireTrustedOrigin(req, res, next) {
  const origin = req.get('origin');
  if (!origin || config.allowedOrigins.includes(origin)) {
    next();
    return;
  }

  res.status(403).json({ message: 'Untrusted request origin' });
}

module.exports = { requireTrustedOrigin };
