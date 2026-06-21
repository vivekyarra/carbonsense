/**
 * @file Main application setup and middleware configuration.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { rateLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { requestId } = require('./middleware/requestId');
const { sanitizeMiddleware } = require('./middleware/sanitize');
const { notFound } = require('./middleware/notFound');
const { config } = require('./config/env');
const { AppError } = require('./utils/AppError');

// Routes
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const tipsRoutes = require('./routes/tipsRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();

// Defense-in-depth: disable x-powered-by (also done by helmet)
app.disable('x-powered-by');

// Trust first proxy (needed for rate limiter behind reverse proxies)
app.set('trust proxy', 1);

// Request tracing - attach unique ID to every request
app.use(requestId);

// Security middleware - hardened Helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-site' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// CORS configuration
app.use(cors({
  /**
   * CORS origin check function.
   * @param {string} origin - The origin to check.
   * @param {import('express').NextFunction} callback - The callback function.
   */
  origin: (origin, callback) => {
    if (!origin || config.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError('Origin is not allowed', 403));
    }
  },
  credentials: true,
}));

// Cookie parser (app-level so all routes can access cookies)
app.use(cookieParser());

// Parsers with body size limits to prevent large payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(compression());

// Input sanitization - strip $ keys and trim strings
app.use(sanitizeMiddleware);

// General Rate Limiting
app.use('/api', rateLimiter);

/**
 * Returns service health for deployment probes.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @returns {void}
 */
function health(req, res) {
  res.json({ status: 'ok', requestId: req.id });
}

app.get('/health', health);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/export', exportRoutes);

app.use(notFound);

// Error Handling Middleware (must be last)
app.use(errorHandler);

module.exports = app;
