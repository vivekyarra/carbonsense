/**
 * @file Routes for dashboard.
 */

const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.use(authenticate);

router.get('/today', dashboardController.getTodayScore);
router.get('/weekly', dashboardController.getWeeklyTrend);
router.get('/monthly', dashboardController.getMonthlyTrend);
router.get('/stats', dashboardController.getStats);
router.get('/streak', dashboardController.getStreak);

module.exports = router;
