/**
 * @file Input sanitization middleware to prevent NoSQL/XSS injection.
 */

/**
 * Recursively sanitizes an object by removing keys starting with $ and trimming strings.
 * @param {any} obj - The object to sanitize.
 * @returns {any} The sanitized object.
 */
function sanitizeInput(obj) {
  if (typeof obj === 'string') {
    return obj.trim();
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeInput);
  }
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (!key.startsWith('$')) {
        sanitized[key] = sanitizeInput(value);
      }
    }
    return sanitized;
  }
  return obj;
}

/**
 * Express middleware that sanitizes req.body, req.query, and req.params.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 */
function sanitizeMiddleware(req, res, next) {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.query) req.query = sanitizeInput(req.query);
  if (req.params) req.params = sanitizeInput(req.params);
  next();
}

module.exports = { sanitizeMiddleware };
