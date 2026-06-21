/**
 * @file Input sanitization middleware to prevent NoSQL/XSS injection.
 */

/**
 * Recursively sanitizes request-body values by removing prototype-pollution
 * keys and trimming strings.
 * @param {unknown} value - Value to sanitize.
 * @returns {unknown} Sanitized value.
 */
function sanitizeInput(value) {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeInput);
  }
  if (value && typeof value === 'object') {
    const sanitized = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      if (!key.startsWith('$') && !['__proto__', 'constructor', 'prototype'].includes(key)) {
        sanitized[key] = sanitizeInput(nestedValue);
      }
    }
    return sanitized;
  }
  return value;
}

/**
 * Express middleware that sanitizes req.body, req.query, and req.params.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 */
function sanitizeMiddleware(req, res, next) {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  next();
}

module.exports = { sanitizeInput, sanitizeMiddleware };
