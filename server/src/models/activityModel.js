/**
 * @file Activity operations for the database.
 */

const db = require('./db');

/**
 * Creates a new activity.
 * @param {object} data - The activity data.
 * @param {number} data.user_id - User ID
 * @param {string} data.category - Activity category
 * @param {string} data.subcategory - Activity subcategory
 * @param {number} data.quantity - Quantity
 * @param {string} data.unit - Unit of measurement
 * @param {number} data.co2_kg - CO2 emissions in kg
 * @param {string} data.activity_date - Date of activity
 * @param {string} [data.notes] - Optional notes
 * @returns {object} The created activity.
 */
function createActivity({ user_id, category, subcategory, quantity, unit, co2_kg, activity_date, notes }) {
  const stmt = db.prepare(`
    INSERT INTO activities (user_id, category, subcategory, quantity, unit, co2_kg, activity_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(user_id, category, subcategory, quantity, unit, co2_kg, activity_date, notes);
  return getActivityById(result.lastInsertRowid, user_id);
}

/**
 * Retrieves an activity by ID, ensuring user ownership.
 * @param {number} id - The activity ID.
 * @param {number} userId - The user ID for ownership check.
 * @returns {object | undefined} The activity.
 */
function getActivityById(id, userId) {
  const stmt = db.prepare('SELECT * FROM activities WHERE id = ? AND user_id = ?');
  return stmt.get(id, userId);
}

/**
 * Retrieves paginated activities for a user.
 * @param {number} userId - The user ID.
 * @param {number} limit - Items per page.
 * @param {number} offset - Number of items to skip.
 * @returns {Array<object>} List of activities.
 */
function getActivitiesByUser(userId, limit = 20, offset = 0) {
  const stmt = db.prepare('SELECT * FROM activities WHERE user_id = ? ORDER BY activity_date DESC, created_at DESC LIMIT ? OFFSET ?');
  return stmt.all(userId, limit, offset);
}

/**
 * Updates an activity.
 * @param {number} id - The activity ID.
 * @param {number} userId - The user ID.
 * @param {object} updates - The fields to update.
 * @returns {object | null} The updated activity, or null if not found.
 */
function updateActivity(id, userId, updates) {
  // We expect updates to contain category, subcategory, quantity, unit, co2_kg, activity_date, notes
  const current = getActivityById(id, userId);
  if (!current) return null;

  const stmt = db.prepare(`
    UPDATE activities
    SET category = ?, subcategory = ?, quantity = ?, unit = ?, co2_kg = ?, activity_date = ?, notes = ?
    WHERE id = ? AND user_id = ?
  `);
  
  stmt.run(
    updates.category || current.category,
    updates.subcategory || current.subcategory,
    updates.quantity || current.quantity,
    updates.unit || current.unit,
    updates.co2_kg !== undefined ? updates.co2_kg : current.co2_kg,
    updates.activity_date || current.activity_date,
    updates.notes || current.notes,
    id,
    userId
  );
  
  return getActivityById(id, userId);
}

/**
 * Deletes an activity.
 * @param {number} id - The activity ID.
 * @param {number} userId - The user ID.
 * @returns {boolean} True if deleted, false otherwise.
 */
function deleteActivity(id, userId) {
  const stmt = db.prepare('DELETE FROM activities WHERE id = ? AND user_id = ?');
  const info = stmt.run(id, userId);
  return info.changes > 0;
}

module.exports = {
  createActivity,
  getActivityById,
  getActivitiesByUser,
  updateActivity,
  deleteActivity
};
