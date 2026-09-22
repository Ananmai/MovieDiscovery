import { Router } from 'express';
import { cacheService } from '../services/cacheService.js';
import { config } from '../config/index.js';
import { db } from '../database/db.js';

const router = Router();

router.get('/health', (req, res) => {
  let dbStatus = 'healthy';
  let wishlistCount = 0;

  try {
    const row = db.prepare('SELECT COUNT(*) as count FROM wishlist').get();
    wishlistCount = row ? row.count : 0;
  } catch (e) {
    dbStatus = 'degraded: ' + e.message;
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mode: config.tmdb.apiKey ? 'live-tmdb' : 'mock-fallback',
    database: {
      status: dbStatus,
      wishlistCount,
    },
    cache: cacheService.getStats(),
  });
});

export default router;
