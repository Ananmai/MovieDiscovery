import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databasePath: process.env.DATABASE_PATH || './data/movies.db',
  tmdb: {
    apiKey: process.env.TMDB_API_KEY ? process.env.TMDB_API_KEY.trim() : '',
    baseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p',
    timeout: 5000,
  },
  cache: {
    ttlDefault: parseInt(process.env.CACHE_TTL_DEFAULT || '600', 10), // 10 mins
    ttlGenres: parseInt(process.env.CACHE_TTL_GENRES || '86400', 10), // 24 hours
    ttlDetails: parseInt(process.env.CACHE_TTL_DETAILS || '7200', 10), // 2 hours
  },
};
