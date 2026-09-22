import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve db path: in serverless (Vercel), only /tmp is writable
const rawDbPath = process.env.VERCEL ? '/tmp/movies.db' : config.databasePath;
const dbPath = path.isAbsolute(rawDbPath)
  ? rawDbPath
  : path.resolve(__dirname, '../../', rawDbPath);

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);

// Initialize schema
export function initializeDatabase() {
  // Enable WAL mode for high performance concurrency
  db.exec('PRAGMA journal_mode = WAL;');

  // Create wishlist table
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

  console.log(`[Database] SQLite database initialized at ${dbPath}`);
}
