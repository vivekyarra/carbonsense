/**
 * @file Routes for tips.
 */

const express = require('express');
const { param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/authenticate');
const tipsController = require('../controllers/tipsController');

const router = express.Router();

router.use(authenticate);

router.get('/', tipsController.getPersonalizedTips);
router.get('/all', tipsController.getAllTips);

router.post(
  '/:id/save',
  [param('id').isInt().withMessage('Invalid ID')],
  validate,
  tipsController.saveTip
);

router.delete(
  '/:id/save',
  [param('id').isInt().withMessage('Invalid ID')],
  validate,
  tipsController.unsaveTip
);

module.exports = router;
