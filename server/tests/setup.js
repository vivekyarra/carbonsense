process.env.JWT_SECRET = 'test-secret-key-that-is-long-enough-for-tests';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-that-is-long-enough-for-tests';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '1000';
process.env.AUTH_RATE_LIMIT_MAX = '500';

