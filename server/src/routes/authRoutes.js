/**
 * @file Authentication routes.
 */

const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/authenticate');
const { authRateLimiter } = require('../middleware/rateLimiter');
const { requireTrustedOrigin } = require('../middleware/trustedOrigin');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  authRateLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password')
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and a number'),
    body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be between 2 and 80 characters'),
    body('daily_target_kg').optional().isFloat({ gt: 0, max: 1000 }).withMessage('Daily target must be between 0 and 1000'),
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  authRateLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

router.post('/session', requireTrustedOrigin, authController.session);

router.post('/refresh', authRateLimiter, requireTrustedOrigin, authController.refresh);

router.post('/logout', requireTrustedOrigin, authController.logout);

router.get('/me', authenticate, authController.getMe);

router.put(
  '/target',
  authenticate,
  [body('target').isFloat({ gt: 0 }).withMessage('Target must be positive')],
  validate,
  authController.updateTarget
);

module.exports = router;
