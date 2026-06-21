/**
 * @file Controller for activity routes.
 */

const { calculateCO2 } = require('../services/carbonService');
const {
  createActivity,
  getActivityById,
  getActivitiesByUser,
  countActivitiesByUser,
  updateActivity,
  deleteActivity,
} = require('../models/activityModel');
const { invalidateDashboardCache } = require('../services/dashboardCache');

/**
 * Logs a new activity.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function logActivity(req, res, next) {
  try {
    const userId = req.user.id;
    const { category, subcategory, quantity, unit, activity_date, notes } = req.body;

    const co2_kg = calculateCO2(category, subcategory, quantity);

    const activity = createActivity({
      user_id: userId,
      category,
      subcategory,
      quantity,
      unit,
      co2_kg,
      activity_date,
      notes: notes || null
    });
    invalidateDashboardCache(userId);

    res.status(201).json({ message: 'Activity logged successfully', activity });
  } catch (error) {
    next(error);
  }
}

/**
 * Gets paginated activities for the current user.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function getActivities(req, res, next) {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const activities = getActivitiesByUser(userId, limit, offset);
    const total = countActivitiesByUser(userId);

    res.json({
      data: activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Gets a single activity by ID.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function getActivity(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);

    const activity = getActivityById(id, userId);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({ activity });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates an activity.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function updateActivityHandler(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);
    const updates = req.body;

    const activity = getActivityById(id, userId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Recalculate CO2 if category, subcategory or quantity changed
    if (updates.category || updates.subcategory || updates.quantity !== undefined) {
      const category = updates.category || activity.category;
      const subcategory = updates.subcategory || activity.subcategory;
      const quantity = updates.quantity !== undefined ? updates.quantity : activity.quantity;
      updates.co2_kg = calculateCO2(category, subcategory, quantity);
    }

    const updatedActivity = updateActivity(id, userId, updates);
    invalidateDashboardCache(userId);

    res.json({ message: 'Activity updated', activity: updatedActivity });
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes an activity.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function deleteActivityHandler(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);

    const success = deleteActivity(id, userId);

    if (!success) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    invalidateDashboardCache(userId);

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  logActivity,
  getActivities,
  getActivity,
  updateActivityHandler,
  deleteActivityHandler
};
