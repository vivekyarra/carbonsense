/**
 * @fileoverview Server entry point.
 */

require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');
const db = require('./src/models/db');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    db.close();
    logger.info('Process terminated.');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully.');
  server.close(() => {
    db.close();
    logger.info('Process terminated.');
  });
});
