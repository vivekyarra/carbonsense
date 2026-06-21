/**
 * @file Custom application error class with HTTP status codes.
 */

/**
 * Application error with HTTP status code.
 * @augments Error
 */
class AppError extends Error {
  /**
   * Creates an AppError.
   * @param {string} message - Error message.
   * @param {number} statusCode - HTTP status code.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

module.exports = { AppError };
