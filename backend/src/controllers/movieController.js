import { tmdbService } from '../services/tmdbService.js';

export const movieController = {
  async getGenres(req, res, next) {
    try {
      const data = await tmdbService.getGenres();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async discover(req, res, next) {
    try {
      const { page = 1, sortBy = 'popularity.desc', genre = '', year = '', minRating = 0 } = req.query;
      const data = await tmdbService.discover({
        page: parseInt(page, 10) || 1,
        sortBy,
        genre,
        year,
        minRating: parseFloat(minRating) || 0,
      });
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getTrending(req, res, next) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbService.getTrending({ page: parseInt(page, 10) || 1 });
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async search(req, res, next) {
    try {
      const { query = '', page = 1 } = req.query;
      const data = await tmdbService.search({
        query: String(query),
        page: parseInt(page, 10) || 1,
      });
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getDetails(req, res, next) {
    try {
      const { id } = req.params;
      const data = await tmdbService.getDetails(id);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getRecommendations(req, res, next) {
    try {
      const { id } = req.params;
      const data = await tmdbService.getRecommendations(id);
      res.json({ results: data });
    } catch (err) {
      next(err);
    }
  },
};
