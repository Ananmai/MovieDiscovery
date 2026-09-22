import { wishlistService } from '../services/wishlistService.js';

export const wishlistController = {
  getWishlist(req, res, next) {
    try {
      const items = wishlistService.getAll();
      res.json({
        success: true,
        count: items.length,
        items,
      });
    } catch (err) {
      next(err);
    }
  },

  checkWishlist(req, res, next) {
    try {
      const { movieId } = req.params;
      const inWishlist = wishlistService.isMovieInWishlist(movieId);
      res.json({ inWishlist });
    } catch (err) {
      next(err);
    }
  },

  addToWishlist(req, res, next) {
    try {
      const movieData = req.body;
      if (!movieData || (!movieData.id && !movieData.movieId)) {
        return res.status(400).json({ success: false, message: 'Movie data with an ID is required' });
      }

      const result = wishlistService.add(movieData);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  removeFromWishlist(req, res, next) {
    try {
      const { movieId } = req.params;
      const result = wishlistService.remove(movieId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  clearWishlist(req, res, next) {
    try {
      const result = wishlistService.clear();
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
