/**
 * @file Validation middleware using express-validator.
 */

const { validationResult } = require('express-validator');

/**
 * Middleware to check for validation errors from express-validator.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { validate };
