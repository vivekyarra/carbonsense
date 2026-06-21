/**
 * @file Dashboard cache ownership and invalidation.
 */

const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

/**
 * Reads a cached dashboard response.
 * @param {string} key - Cache key.
 * @returns {object | undefined} Cached response when present.
 */
function getDashboardCache(key) {
  return cache.get(key);
}

/**
 * Stores a dashboard response.
 * @param {string} key - Cache key.
 * @param {object} value - Response value.
 * @returns {boolean} Whether the value was stored.
 */
function setDashboardCache(key, value) {
  return cache.set(key, value);
}

/**
 * Invalidates all derived dashboard entries for a user.
 * @param {number} userId - User whose dashboard data changed.
 * @returns {void}
 */
function invalidateDashboardCache(userId) {
  cache.del([`weekly_${userId}`, `monthly_${userId}`]);
}

module.exports = {
  getDashboardCache,
  setDashboardCache,
  invalidateDashboardCache,
};
