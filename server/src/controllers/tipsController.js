/**
 * @file Controller for tips.
 */

const db = require('../models/db');

/**
 * Gets personalized tips based on user's highest emission category.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function getPersonalizedTips(req, res, next) {
  try {
    const userId = req.user.id;

    // Find highest emission category from last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const startDateStr = thirtyDaysAgo.toISOString().split('T')[0];

    const stmtCategory = db.prepare(`
      SELECT category, SUM(co2_kg) as total
      FROM activities
      WHERE user_id = ? AND activity_date >= ?
      GROUP BY category
      ORDER BY total DESC
      LIMIT 1
    `);
    const worstCategoryRow = stmtCategory.get(userId, startDateStr);

    let queryCategory = worstCategoryRow ? worstCategoryRow.category : null;

    let stmtTips;
    if (queryCategory) {
      // Get 3 tips from worst category, and 2 from others
      stmtTips = db.prepare(`
        SELECT t.*, 
          CASE WHEN ust.user_id IS NOT NULL THEN 1 ELSE 0 END as is_saved
        FROM tips t
        LEFT JOIN user_saved_tips ust ON t.id = ust.tip_id AND ust.user_id = ?
        ORDER BY CASE WHEN t.category = ? THEN 0 ELSE 1 END, t.potential_saving_kg DESC
        LIMIT 5
      `);
      const tips = stmtTips.all(userId, queryCategory);
      res.json({ tips });
    } else {
      // No activities yet, just return general tips
      stmtTips = db.prepare(`
        SELECT t.*, 
          CASE WHEN ust.user_id IS NOT NULL THEN 1 ELSE 0 END as is_saved
        FROM tips t
        LEFT JOIN user_saved_tips ust ON t.id = ust.tip_id AND ust.user_id = ?
        ORDER BY t.potential_saving_kg DESC
        LIMIT 5
      `);
      const tips = stmtTips.all(userId);
      res.json({ tips });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Gets all tips.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function getAllTips(req, res, next) {
  try {
    const userId = req.user.id;
    const stmt = db.prepare(`
      SELECT t.*, 
        CASE WHEN ust.user_id IS NOT NULL THEN 1 ELSE 0 END as is_saved
      FROM tips t
      LEFT JOIN user_saved_tips ust ON t.id = ust.tip_id AND ust.user_id = ?
      ORDER BY t.category, t.potential_saving_kg DESC
    `);
    const tips = stmt.all(userId);
    res.json({ tips });
  } catch (error) {
    next(error);
  }
}

/**
 * Saves a tip for the user.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function saveTip(req, res, next) {
  try {
    const userId = req.user.id;
    const tipId = parseInt(req.params.id, 10);

    const stmt = db.prepare('INSERT OR IGNORE INTO user_saved_tips (user_id, tip_id) VALUES (?, ?)');
    stmt.run(userId, tipId);

    res.json({ message: 'Tip saved successfully' });
  } catch (error) {
    next(error);
  }
}

/**
 * Unsaves a tip for the user.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function unsaveTip(req, res, next) {
  try {
    const userId = req.user.id;
    const tipId = parseInt(req.params.id, 10);

    const stmt = db.prepare('DELETE FROM user_saved_tips WHERE user_id = ? AND tip_id = ?');
    stmt.run(userId, tipId);

    res.json({ message: 'Tip unsaved successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPersonalizedTips,
  getAllTips,
  saveTip,
  unsaveTip
};
