import rateLimit from 'express-rate-limit';

// Standard rate limiter for API endpoints (150 requests per 1 minute window)
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please wait a moment before trying again.',
  },
});
