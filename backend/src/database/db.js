import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In serverless (Vercel), only /tmp is writable
const rawDbPath = process.env.VERCEL ? '/tmp/movies.db' : config.databasePath;
const dbPath = path.isAbsolute(rawDbPath)
  ? rawDbPath
  : path.resolve(__dirname, '../../', rawDbPath);

let dbInstance = null;

// Dynamic import or fallback for node:sqlite across Node versions
try {
  const { DatabaseSync } = await import('node:sqlite');
  
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  dbInstance = new DatabaseSync(dbPath);
} catch (e) {
  console.warn('[Database] node:sqlite not available, using in-memory store:', e.message);

  // Fallback in-memory database implementation
  const store = new Map();
  dbInstance = {
    exec(sql) {},
    prepare(sql) {
      if (sql.includes('SELECT COUNT(*)')) {
        return {
          get() {
            return { count: store.size };
          },
        };
      }
      if (sql.includes('SELECT 1 FROM wishlist')) {
        return {
          get(movieId) {
            return store.has(Number(movieId)) ? { exists: 1 } : undefined;
          },
        };
      }
      if (sql.includes('SELECT') && sql.includes('FROM wishlist')) {
        return {
          all() {
            return Array.from(store.values());
          },
        };
      }
      if (sql.includes('INSERT INTO wishlist')) {
        return {
          run(id, movieId, title, posterPath, backdropPath, overview, releaseDate, voteAvg, voteCount, genres) {
            store.set(Number(movieId), {
              id,
              movieId: Number(movieId),
              title,
              posterUrl: posterPath,
              backdropUrl: backdropPath,
              overview,
              releaseDate,
              rating: voteAvg,
              voteCount,
              genres,
              addedAt: new Date().toISOString(),
            });
            return { changes: 1 };
          },
        };
      }
      if (sql.includes('DELETE FROM wishlist WHERE')) {
        return {
          run(movieId) {
            const deleted = store.delete(Number(movieId));
            return { changes: deleted ? 1 : 0 };
          },
        };
      }
      if (sql.includes('DELETE FROM wishlist')) {
        return {
          run() {
            const count = store.size;
            store.clear();
            return { changes: count };
          },
        };
      }
      return {
        all: () => [],
        get: () => undefined,
        run: () => ({ changes: 0 }),
      };
    },
  };
}

export const db = dbInstance;

// Initialize schema
export function initializeDatabase() {
  try {
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id TEXT PRIMARY KEY,
        movie_id INTEGER UNIQUE NOT NULL,
        title TEXT NOT NULL,
        poster_path TEXT,
        backdrop_path TEXT,
        overview TEXT,
        release_date TEXT,
        vote_average REAL,
        vote_count INTEGER,
        genres TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_wishlist_movie_id ON wishlist (movie_id);
      CREATE INDEX IF NOT EXISTS idx_wishlist_created_at ON wishlist (created_at DESC);
    `);
    console.log(`[Database] Database initialized at ${dbPath}`);
  } catch (err) {
    console.warn(`[Database] Initialization note: ${err.message}`);
  }
}
