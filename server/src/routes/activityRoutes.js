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
    body('subcategory').notEmpty().withMessage('Subcategory is required').escape(),
    body('quantity').isFloat({ gt: 0 }).withMessage('Quantity must be positive'),
    body('unit').notEmpty().withMessage('Unit is required').escape(),
    body('activity_date').isISO8601().withMessage('Valid date is required'),
    body('notes').optional().isString().escape()
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
    body('subcategory').optional().notEmpty().escape(),
    body('quantity').optional().isFloat({ gt: 0 }).withMessage('Quantity must be positive'),
    body('unit').optional().notEmpty().escape(),
    body('activity_date').optional().isISO8601().withMessage('Valid date required'),
    body('notes').optional().isString().escape()
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
