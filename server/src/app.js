/**
 * @file Main application setup and middleware configuration.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { rateLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const tipsRoutes = require('./routes/tipsRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  /**
   * CORS origin check function.
   * @param {string} origin - The origin to check.
   * @param {import('express').NextFunction} callback - The callback function.
   */
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Parsers & compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// General Rate Limiting
app.use('/api', rateLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/export', exportRoutes);

// Error Handling Middleware (must be last)
app.use(errorHandler);

module.exports = app;
