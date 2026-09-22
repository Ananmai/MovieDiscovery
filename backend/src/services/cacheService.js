import NodeCache from 'node-cache';
import { config } from '../config/index.js';

// Standard in-memory TTL cache
const cache = new NodeCache({
  stdTTL: config.cache.ttlDefault,
  checkperiod: 120, // cleanup expired keys every 2 minutes
  useClones: false, // higher performance
});

export const cacheService = {
  get(key) {
    return cache.get(key);
  },

  set(key, value, ttl = config.cache.ttlDefault) {
    return cache.set(key, value, ttl);
  },

  has(key) {
    return cache.has(key);
  },

  del(key) {
    return cache.del(key);
  },

  flush() {
    return cache.flushAll();
  },

  getStats() {
    return {
      keys: cache.keys().length,
      hits: cache.getStats().hits,
      misses: cache.getStats().misses,
      ksize: cache.getStats().ksize,
      vsize: cache.getStats().vsize,
    };
  },
};
