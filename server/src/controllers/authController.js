/**
 * @file Controller for authentication routes.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, getUserById, updateDailyTarget } = require('../models/userModel');
const { config } = require('../config/env');
const { REFRESH_COOKIE_NAME, refreshCookieOptions } = require('../config/cookies');

const TOKEN_OPTIONS = Object.freeze({
  algorithm: 'HS256',
  audience: config.jwt.audience,
  issuer: config.jwt.issuer,
});

/**
 * Generates JWT tokens for a user.
 * @param {number} userId - The user ID.
 * @returns {object} The access and refresh tokens.
 */
function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, config.jwt.accessSecret, {
    ...TOKEN_OPTIONS,
    expiresIn: config.jwt.accessExpiresIn,
  });

  const refreshToken = jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    ...TOKEN_OPTIONS,
    expiresIn: config.jwt.refreshExpiresIn,
  });

  return { accessToken, refreshToken };
}

/**
 * Sets the rotating refresh token using the shared cookie policy.
 * @param {import('express').Response} res - Express response.
 * @param {string} refreshToken - Signed refresh token.
 * @returns {void}
 */
function setRefreshCookie(res, refreshToken) {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions());
  res.set('Cache-Control', 'no-store');
}

/**
 * Clears the refresh token using the same scope as the set operation.
 * @param {import('express').Response} res - Express response.
 * @returns {void}
 */
function clearRefreshCookie(res) {
  const clearOptions = refreshCookieOptions();
  delete clearOptions.maxAge;
  res.clearCookie(REFRESH_COOKIE_NAME, clearOptions);
}

/**
 * Verifies a refresh token and resolves its current user.
 * @param {string} refreshToken - Signed refresh token.
 * @returns {object | undefined} Current user when the token is valid.
 */
function getRefreshTokenUser(refreshToken) {
  const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret, {
    algorithms: ['HS256'],
    audience: config.jwt.audience,
    issuer: config.jwt.issuer,
  });
  return getUserById(decoded.id);
}

/**
 * Handles user registration.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
async function register(req, res, next) {
  try {
    const { email, password, name, daily_target_kg } = req.body;

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const user = createUser({ email, password_hash, name, daily_target_kg });
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Send refresh token as httpOnly cookie
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, daily_target_kg: user.daily_target_kg }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handles user login.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    setRefreshCookie(res, refreshToken);

    res.json({
      message: 'Login successful',
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, daily_target_kg: user.daily_target_kg }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handles token refresh.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @returns {void}
 */
function refresh(req, res) {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    const user = getRefreshTokenUser(refreshToken);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const tokens = generateTokens(user.id);

    setRefreshCookie(res, tokens.refreshToken);

    res.json({ accessToken: tokens.accessToken });
  } catch {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
}

/**
 * Restores a browser session without producing expected authorization errors
 * for signed-out visitors.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @returns {void}
 */
function session(req, res) {
  const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    res.set('Cache-Control', 'no-store');
    res.json({ user: null });
    return;
  }

  try {
    const user = getRefreshTokenUser(refreshToken);
    if (!user) {
      clearRefreshCookie(res);
      res.json({ user: null });
      return;
    }

    const tokens = generateTokens(user.id);
    setRefreshCookie(res, tokens.refreshToken);
    res.json({ user, accessToken: tokens.accessToken });
  } catch {
    clearRefreshCookie(res);
    res.json({ user: null });
  }
}

/**
 * Handles user logout.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function logout(req, res, next) {
  try {
    clearRefreshCookie(res);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

/**
 * Gets the current user profile.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @returns {void}
 */
function getMe(req, res) {
  res.json({ user: req.user });
}

/**
 * Updates user daily target.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function updateTarget(req, res, next) {
  try {
    const { target } = req.body;
    const updatedUser = updateDailyTarget(req.user.id, target);
    res.json({ message: 'Target updated', user: updatedUser });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  session,
  refresh,
  logout,
  getMe,
  updateTarget
};
