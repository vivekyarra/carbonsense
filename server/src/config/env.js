/**
 * @file Validated runtime configuration.
 */

const DEFAULT_ORIGIN = 'http://localhost:5173';
const JWT_ISSUER = 'carbonsense-api';
const JWT_AUDIENCE = 'carbonsense-web';
const MINIMUM_SECRET_LENGTH = 32;

/**
 * Parses a positive integer environment variable.
 * @param {string | undefined} value - Raw environment value.
 * @param {number} fallback - Value used when input is invalid.
 * @returns {number} Parsed positive integer.
 */
function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Parses and normalizes the configured browser origins.
 * @param {string | undefined} value - Comma-separated origin list.
 * @returns {string[]} Valid normalized origins.
 */
function parseAllowedOrigins(value) {
  const origins = (value || DEFAULT_ORIGIN)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set(origins.map((origin) => new URL(origin).origin))];
}

/**
 * Ensures authentication secrets are present and sufficiently strong.
 * @returns {void}
 */
function validateAuthenticationConfig() {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  for (const name of ['JWT_SECRET', 'JWT_REFRESH_SECRET']) {
    const value = process.env[name];
    if (!value || value.length < MINIMUM_SECRET_LENGTH) {
      throw new Error(`${name} must contain at least ${MINIMUM_SECRET_LENGTH} characters`);
    }
  }
}

const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: positiveInteger(process.env.PORT, 5000),
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
  jwt: Object.freeze({
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    accessSecret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  }),
  rateLimit: Object.freeze({
    windowMs: positiveInteger(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    maxRequests: positiveInteger(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
    maxAuthRequests: positiveInteger(process.env.AUTH_RATE_LIMIT_MAX, 5),
  }),
});

module.exports = {
  config,
  parseAllowedOrigins,
  positiveInteger,
  validateAuthenticationConfig,
};
