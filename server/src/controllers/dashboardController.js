/**
 * @file Dashboard operations and aggregations.
 */

const db = require('../models/db');
const NodeCache = require('node-cache');

const dashboardCache = new NodeCache({ stdTTL: 300, checkperiod: 120 }); // 5 minutes TTL

/**
 * Gets today's carbon score and breakdown.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function getTodayScore(req, res, next) {
  try {
    const userId = req.user.id;
    // Format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const stmt = db.prepare(`
      SELECT category, SUM(co2_kg) as total
      FROM activities
      WHERE user_id = ? AND activity_date = ?
      GROUP BY category
    `);
    const results = stmt.all(userId, today);

    let totalCO2 = 0;
    const breakdown = {
      transportation: 0,
      food: 0,
      energy: 0
    };

    results.forEach(row => {
      breakdown[row.category] = row.total;
      totalCO2 += row.total;
    });

    res.json({
      date: today,
      total_kg: Number(totalCO2.toFixed(2)),
      target_kg: req.user.daily_target_kg,
      breakdown
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Gets last 7 days data for chart.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function getWeeklyTrend(req, res, next) {
  try {
    const userId = req.user.id;
    const cacheKey = `weekly_${userId}`;

    const cachedData = dashboardCache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    const startDateStr = sevenDaysAgo.toISOString().split('T')[0];

    const stmt = db.prepare(`
      SELECT activity_date, SUM(co2_kg) as daily_total
      FROM activities
      WHERE user_id = ? AND activity_date >= ?
      GROUP BY activity_date
      ORDER BY activity_date ASC
    `);
    
    const results = stmt.all(userId, startDateStr);
    
    // Fill missing days with 0
    const trend = [];
    for (let i = 0; i <= 6; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      const found = results.find(r => r.activity_date === dateStr);
      trend.push({
        date: dateStr,
        total: found ? Number(found.daily_total.toFixed(2)) : 0
      });
    }

    const responseData = { trend };
    dashboardCache.set(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    next(error);
  }
}

/**
 * Gets last 30 days data.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function getMonthlyTrend(req, res, next) {
  try {
    const userId = req.user.id;
    const cacheKey = `monthly_${userId}`;

    const cachedData = dashboardCache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29);
    const startDateStr = thirtyDaysAgo.toISOString().split('T')[0];

    const stmt = db.prepare(`
      SELECT activity_date, SUM(co2_kg) as daily_total
      FROM activities
      WHERE user_id = ? AND activity_date >= ?
      GROUP BY activity_date
      ORDER BY activity_date ASC
    `);
    
    const results = stmt.all(userId, startDateStr);
    
    // Fill missing days with 0
    const trend = [];
    for (let i = 0; i <= 29; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      const found = results.find(r => r.activity_date === dateStr);
      trend.push({
        date: dateStr,
        total: found ? Number(found.daily_total.toFixed(2)) : 0
      });
    }

    const responseData = { trend };
    dashboardCache.set(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    next(error);
  }
}

/**
 * Gets overall stats and community comparison.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function getStats(req, res, next) {
  try {
    const userId = req.user.id;
    
    const stmt = db.prepare(`
      SELECT SUM(co2_kg) as total, COUNT(DISTINCT activity_date) as days
      FROM activities
      WHERE user_id = ?
    `);
    const result = stmt.get(userId);
    
    const totalCO2 = result.total || 0;
    const daysWithData = result.days || 1;
    const dailyAverage = totalCO2 / daysWithData;

    res.json({
      user_daily_average_kg: Number(dailyAverage.toFixed(2)),
      comparisons: {
        global_average_kg: 12.9,
        india_average_kg: 5.2,
        paris_agreement_kg: 5.5
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Gets current and best streak.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function getStreak(req, res, next) {
  try {
    const userId = req.user.id;
    const target = req.user.daily_target_kg;

    const stmt = db.prepare(`
      SELECT activity_date, SUM(co2_kg) as daily_total
      FROM activities
      WHERE user_id = ?
      GROUP BY activity_date
      ORDER BY activity_date DESC
    `);
    const days = stmt.all(userId);

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Calculate streaks based on staying under target
    for (let i = 0; i < days.length; i++) {
      if (days[i].daily_total <= target) {
        tempStreak++;
        if (i === tempStreak - 1) { // Current streak from today/most recent backwards
          currentStreak = tempStreak;
        }
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    res.json({ current_streak: currentStreak, best_streak: bestStreak });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTodayScore,
  getWeeklyTrend,
  getMonthlyTrend,
  getStats,
  getStreak
};
