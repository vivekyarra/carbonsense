/**
 * @file Server entry point.
 */

require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');
const db = require('./src/models/db');
const { config, validateAuthenticationConfig } = require('./src/config/env');

validateAuthenticationConfig();

const server = app.listen(config.port, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
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
