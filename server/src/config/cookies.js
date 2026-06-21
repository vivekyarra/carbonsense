/**
 * @file Authentication cookie configuration.
 */

const { config } = require('./env');

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Returns consistent refresh-cookie options for set and clear operations.
 * @returns {import('express').CookieOptions} Secure cookie options.
 */
function refreshCookieOptions() {
  const production = config.nodeEnv === 'production';
  return {
    httpOnly: true,
    secure: production,
    sameSite: production ? 'none' : 'strict',
    path: '/api/auth',
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
  };
}

module.exports = {
  REFRESH_COOKIE_NAME,
  refreshCookieOptions,
};
