import { randomUUID } from 'crypto';
import { db } from '../database/db.js';

export const wishlistService = {
  /**
   * Get all wishlist items ordered by added date
   */
  getAll() {
    const stmt = db.prepare(`
      SELECT 
        id,
        movie_id AS movieId,
        title,
        poster_path AS posterUrl,
        backdrop_path AS backdropUrl,
        overview,
        release_date AS releaseDate,
        vote_average AS rating,
        vote_count AS voteCount,
        genres,
        created_at AS addedAt
      FROM wishlist
      ORDER BY created_at DESC
    `);

    const rows = stmt.all();
    return rows.map((row) => ({
      ...row,
      genres: row.genres ? JSON.parse(row.genres) : [],
    }));
  },

  /**
   * Check if movie is currently in wishlist
   */
  isMovieInWishlist(movieId) {
    const numericId = parseInt(movieId, 10);
    const stmt = db.prepare('SELECT 1 FROM wishlist WHERE movie_id = ? LIMIT 1');
    const row = stmt.get(numericId);
    return Boolean(row);
  },

  /**
   * Add a movie to the wishlist
   */
  add(movie) {
    const numericId = parseInt(movie.id || movie.movieId, 10);
    if (!numericId || isNaN(numericId)) {
      throw new Error('Valid movie ID is required');
    }

    // Check if already in wishlist
    if (this.isMovieInWishlist(numericId)) {
      return { success: true, message: 'Movie already in wishlist', movieId: numericId };
    }

    const id = randomUUID();
    const genresJson = JSON.stringify(Array.isArray(movie.genres) ? movie.genres : []);

    const stmt = db.prepare(`
      INSERT INTO wishlist (
        id, movie_id, title, poster_path, backdrop_path,
        overview, release_date, vote_average, vote_count, genres
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      numericId,
      movie.title || 'Untitled',
      movie.posterUrl || movie.poster_path || null,
      movie.backdropUrl || movie.backdrop_path || null,
      movie.overview || '',
      movie.releaseDate || movie.release_date || '',
      typeof movie.rating === 'number' ? movie.rating : (typeof movie.vote_average === 'number' ? movie.vote_average : 0),
      movie.voteCount || movie.vote_count || 0,
      genresJson
    );

    return {
      success: true,
      message: 'Movie added to wishlist',
      item: {
        id,
        movieId: numericId,
        title: movie.title,
        posterUrl: movie.posterUrl || movie.poster_path,
        genres: Array.isArray(movie.genres) ? movie.genres : [],
      },
    };
  },

  /**
   * Remove movie from wishlist
   */
  remove(movieId) {
    const numericId = parseInt(movieId, 10);
    if (!numericId || isNaN(numericId)) {
      throw new Error('Valid movie ID is required');
    }

    const stmt = db.prepare('DELETE FROM wishlist WHERE movie_id = ?');
    const result = stmt.run(numericId);

    return {
      success: true,
      deletedCount: result.changes,
      movieId: numericId,
    };
  },

  /**
   * Clear all items
   */
  clear() {
    const stmt = db.prepare('DELETE FROM wishlist');
    const result = stmt.run();
    return { success: true, deletedCount: result.changes };
  },
};
