/**
 * @file JSON not-found middleware.
 */

/**
 * Returns a consistent response for unknown API routes.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @returns {void}
 */
function notFound(req, res) {
  res.status(404).json({ message: 'Route not found', requestId: req.id });
}

module.exports = { notFound };
