import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database/db.js';
import movieRoutes from './routes/movieRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

// Initialize SQLite database
initializeDatabase();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(requestLogger);

// Apply rate limiting to all /api/ requests
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api', healthRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Fallback for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handling
app.use(errorHandler);

export default app;
