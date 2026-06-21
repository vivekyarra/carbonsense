/**
 * @file Routes for activities.
 */

const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/authenticate');
const activityController = require('../controllers/activityController');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  [
    body('category').isIn(['transportation', 'food', 'energy']).withMessage('Invalid category'),
    body('subcategory').trim().isLength({ min: 1, max: 80 }).withMessage('Subcategory is required'),
    body('quantity').isFloat({ gt: 0 }).withMessage('Quantity must be positive'),
    body('unit').trim().isLength({ min: 1, max: 20 }).withMessage('Unit is required'),
    body('activity_date').isISO8601().withMessage('Valid date is required'),
    body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters')
  ],
  validate,
  activityController.logActivity
);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validate,
  activityController.getActivities
);

router.get(
  '/:id',
  [param('id').isInt().withMessage('Invalid ID')],
  validate,
  activityController.getActivity
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid ID'),
    body('category').optional().isIn(['transportation', 'food', 'energy']).withMessage('Invalid category'),
    body('subcategory').optional().trim().isLength({ min: 1, max: 80 }),
    body('quantity').optional().isFloat({ gt: 0 }).withMessage('Quantity must be positive'),
    body('unit').optional().trim().isLength({ min: 1, max: 20 }),
    body('activity_date').optional().isISO8601().withMessage('Valid date required'),
    body('notes').optional().trim().isLength({ max: 500 })
  ],
  validate,
  activityController.updateActivityHandler
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('Invalid ID')],
  validate,
  activityController.deleteActivityHandler
);

module.exports = router;
