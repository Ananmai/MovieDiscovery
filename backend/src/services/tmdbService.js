import axios from 'axios';
import { config } from '../config/index.js';
import { cacheService } from './cacheService.js';
import { mockMovieService } from './mockMovieService.js';
import { transformMovieSummary, transformMovieDetails } from './transformer.js';

// Setup dedicated Axios instance with timeouts
const tmdbClient = axios.create({
  baseURL: config.tmdb.baseUrl,
  timeout: config.tmdb.timeout,
  headers: {
    Accept: 'application/json',
  },
});

// Helper to determine if live API is configured
function hasValidApiKey() {
  return Boolean(config.tmdb.apiKey && config.tmdb.apiKey.length > 5);
}

export const tmdbService = {
  /**
   * Fetch genre list with 24-hour cache
   */
  async getGenres() {
    const cacheKey = 'genres_list';
    if (cacheService.has(cacheKey)) {
      return { genres: cacheService.get(cacheKey), dataSource: 'cache' };
    }

    if (!hasValidApiKey()) {
      const genres = mockMovieService.getGenres();
      cacheService.set(cacheKey, genres, config.cache.ttlGenres);
      return { genres, dataSource: 'mock-fallback' };
    }

    try {
      const response = await tmdbClient.get('/genre/movie/list', {
        params: { api_key: config.tmdb.apiKey },
      });
      const genres = response.data.genres || [];
      cacheService.set(cacheKey, genres, config.cache.ttlGenres);
      return { genres, dataSource: 'live-tmdb' };
    } catch (err) {
      console.warn(`[TMDB] Genres fetch failed: ${err.message}. Falling back to mock dataset.`);
      const genres = mockMovieService.getGenres();
      cacheService.set(cacheKey, genres, 300); // 5 min retry cache
      return { genres, dataSource: 'mock-fallback' };
    }
  },

  /**
   * Discover movies with filters, sorting, and pagination
   */
  async discover({ page = 1, sortBy = 'popularity.desc', genre = '', year = '', minRating = 0 }) {
    const cacheKey = `discover:${page}:${sortBy}:${genre}:${year}:${minRating}`;
    if (cacheService.has(cacheKey)) {
      return { ...cacheService.get(cacheKey), dataSource: 'cache' };
    }

    if (!hasValidApiKey()) {
      const result = mockMovieService.discover({ page, sortBy, genre, year, minRating });
      cacheService.set(cacheKey, result, config.cache.ttlDefault);
      return result;
    }

    try {
      const params = {
        api_key: config.tmdb.apiKey,
        page: Math.max(1, parseInt(page, 10) || 1),
        sort_by: sortBy,
        include_adult: false,
      };

      if (genre) params.with_genres = genre;
      if (year) params.primary_release_year = year;
      if (minRating > 0) params['vote_average.gte'] = minRating;

      const response = await tmdbClient.get('/discover/movie', { params });
      const { results = [], total_pages = 1, total_results = 0 } = response.data;

      const payload = {
        page: response.data.page,
        totalPages: total_pages,
        totalResults: total_results,
        results: results.map((m) => transformMovieSummary(m)),
        dataSource: 'live-tmdb',
      };

      cacheService.set(cacheKey, payload, config.cache.ttlDefault);
      return payload;
    } catch (err) {
      console.warn(`[TMDB] Discover API error (${err.message}). Using resilient mock fallback.`);
      const fallback = mockMovieService.discover({ page, sortBy, genre, year, minRating });
      cacheService.set(cacheKey, fallback, 120); // short fallback cache
      return fallback;
    }
  },

  /**
   * Trending movies of the week
   */
  async getTrending({ page = 1 } = {}) {
    const cacheKey = `trending:${page}`;
    if (cacheService.has(cacheKey)) {
      return { ...cacheService.get(cacheKey), dataSource: 'cache' };
    }

    if (!hasValidApiKey()) {
      const result = mockMovieService.trending({ page });
      cacheService.set(cacheKey, result, config.cache.ttlDefault);
      return result;
    }

    try {
      const response = await tmdbClient.get('/trending/movie/week', {
        params: {
          api_key: config.tmdb.apiKey,
          page: Math.max(1, parseInt(page, 10) || 1),
        },
      });

      const { results = [], total_pages = 1, total_results = 0 } = response.data;
      const payload = {
        page: response.data.page,
        totalPages: total_pages,
        totalResults: total_results,
        results: results.map((m) => transformMovieSummary(m)),
        dataSource: 'live-tmdb',
      };

      cacheService.set(cacheKey, payload, config.cache.ttlDefault);
      return payload;
    } catch (err) {
      console.warn(`[TMDB] Trending API error (${err.message}). Using resilient mock fallback.`);
      const fallback = mockMovieService.trending({ page });
      cacheService.set(cacheKey, fallback, 120);
      return fallback;
    }
  },

  /**
   * Search movies by title with query and pagination
   */
  async search({ query = '', page = 1 } = {}) {
    const cleanQuery = (query || '').trim();
    if (!cleanQuery) {
      return this.discover({ page });
    }

    const cacheKey = `search:${cleanQuery.toLowerCase()}:${page}`;
    if (cacheService.has(cacheKey)) {
      return { ...cacheService.get(cacheKey), dataSource: 'cache' };
    }

    if (!hasValidApiKey()) {
      const result = mockMovieService.search({ query: cleanQuery, page });
      cacheService.set(cacheKey, result, config.cache.ttlDefault);
      return result;
    }

    try {
      const response = await tmdbClient.get('/search/movie', {
        params: {
          api_key: config.tmdb.apiKey,
          query: cleanQuery,
          page: Math.max(1, parseInt(page, 10) || 1),
          include_adult: false,
        },
      });

      const { results = [], total_pages = 1, total_results = 0 } = response.data;
      const payload = {
        page: response.data.page,
        totalPages: total_pages,
        totalResults: total_results,
        results: results.map((m) => transformMovieSummary(m)),
        dataSource: 'live-tmdb',
      };

      cacheService.set(cacheKey, payload, config.cache.ttlDefault);
      return payload;
    } catch (err) {
      console.warn(`[TMDB] Search API error (${err.message}). Using resilient mock fallback.`);
      const fallback = mockMovieService.search({ query: cleanQuery, page });
      cacheService.set(cacheKey, fallback, 120);
      return fallback;
    }
  },

  /**
   * Movie details with appended credits and videos
   */
  async getDetails(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error('Invalid movie ID');
    }

    const cacheKey = `details:${numericId}`;
    if (cacheService.has(cacheKey)) {
      return { ...cacheService.get(cacheKey), dataSource: 'cache' };
    }

    if (!hasValidApiKey()) {
      const result = mockMovieService.getById(numericId);
      if (result) {
        cacheService.set(cacheKey, result, config.cache.ttlDetails);
        return result;
      }
      return null;
    }

    try {
      const response = await tmdbClient.get(`/movie/${numericId}`, {
        params: {
          api_key: config.tmdb.apiKey,
          append_to_response: 'credits,videos',
        },
      });

      const transformed = transformMovieDetails(
        response.data,
        response.data.credits,
        response.data.videos
      );

      const payload = {
        ...transformed,
        dataSource: 'live-tmdb',
      };

      cacheService.set(cacheKey, payload, config.cache.ttlDetails);
      return payload;
    } catch (err) {
      console.warn(`[TMDB] Movie details error for #${numericId} (${err.message}). Checking mock fallback.`);
      const fallback = mockMovieService.getById(numericId);
      if (fallback) {
        cacheService.set(cacheKey, fallback, 300);
        return fallback;
      }
      return null;
    }
  },

  /**
   * Recommendations for a given movie
   */
  async getRecommendations(id) {
    const numericId = parseInt(id, 10);
    const cacheKey = `recommendations:${numericId}`;
    if (cacheService.has(cacheKey)) {
      return cacheService.get(cacheKey);
    }

    if (!hasValidApiKey()) {
      const result = mockMovieService.getRecommendations(numericId);
      cacheService.set(cacheKey, result, config.cache.ttlDetails);
      return result;
    }

    try {
      const response = await tmdbClient.get(`/movie/${numericId}/recommendations`, {
        params: {
          api_key: config.tmdb.apiKey,
          page: 1,
        },
      });

      const list = (response.data.results || []).slice(0, 8).map((m) => transformMovieSummary(m));
      cacheService.set(cacheKey, list, config.cache.ttlDetails);
      return list;
    } catch (err) {
      console.warn(`[TMDB] Recommendations error for #${numericId}. Using fallback.`);
      const fallback = mockMovieService.getRecommendations(numericId);
      cacheService.set(cacheKey, fallback, 300);
      return fallback;
    }
  },
};
