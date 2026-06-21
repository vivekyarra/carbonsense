/**
 * @file User model operations for database.
 */

const db = require('./db');

/**
 * Creates a new user in the database.
 * @param {object} userData - The user data.
 * @param {string} userData.email - The user's email.
 * @param {string} userData.password_hash - The hashed password.
 * @param {string} userData.name - The user's name.
 * @param {number} [userData.daily_target_kg] - Initial daily emissions target.
 * @returns {object} The created user object.
 */
function createUser({ email, password_hash, name, daily_target_kg = 10 }) {
  const stmt = db.prepare(`
    INSERT INTO users (email, password_hash, name, daily_target_kg)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(email, password_hash, name, daily_target_kg);
  return getUserById(result.lastInsertRowid);
}

/**
 * Retrieves a user by email for authentication, including password_hash.
 * Non-authentication flows must use getUserById(), which excludes the hash.
 * @param {string} email - The user's email.
 * @returns {object | undefined} The user object (including password_hash) or undefined if not found.
 */
function getUserByEmail(email) {
  // SELECT * is intentional here - password_hash is needed for auth verification
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
}

/**
 * Retrieves a user by their ID.
 * @param {number} id - The user ID.
 * @returns {object | undefined} The user object or undefined.
 */
function getUserById(id) {
  const stmt = db.prepare('SELECT id, email, name, daily_target_kg, created_at FROM users WHERE id = ?');
  return stmt.get(id);
}

/**
 * Updates a user's daily target.
 * @param {number} id - The user ID.
 * @param {number} target - The new daily target in kg.
 * @returns {object} The updated user.
 */
function updateDailyTarget(id, target) {
  const stmt = db.prepare('UPDATE users SET daily_target_kg = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  stmt.run(target, id);
  return getUserById(id);
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateDailyTarget
};
