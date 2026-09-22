import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client.js';

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all wishlist items from backend on mount
  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.getWishlist();
      if (res.success && Array.isArray(res.items)) {
        setWishlistItems(res.items);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Check if a movie is in wishlist
  const isInWishlist = useCallback(
    (movieId) => {
      const id = parseInt(movieId, 10);
      return wishlistItems.some((item) => parseInt(item.movieId || item.id, 10) === id);
    },
    [wishlistItems]
  );

  // Optimistically toggle wishlist status
  const toggleWishlist = useCallback(
    async (movie) => {
      const numericId = parseInt(movie.id || movie.movieId, 10);
      if (!numericId) return;

      const alreadyIn = isInWishlist(numericId);
      const previousItems = [...wishlistItems];

      // Optimistic update
      if (alreadyIn) {
        setWishlistItems((prev) =>
          prev.filter((item) => parseInt(item.movieId || item.id, 10) !== numericId)
        );
      } else {
        const newItem = {
          id: String(numericId),
          movieId: numericId,
          title: movie.title,
          posterUrl: movie.posterUrl || movie.poster_path,
          backdropUrl: movie.backdropUrl || movie.backdrop_path,
          overview: movie.overview,
          releaseDate: movie.releaseDate || movie.release_date,
          rating: movie.rating || movie.vote_average || 0,
          voteCount: movie.voteCount || movie.vote_count || 0,
          genres: movie.genres || [],
          addedAt: new Date().toISOString(),
        };
        setWishlistItems((prev) => [newItem, ...prev]);
      }

      // Sync with backend SQLite
      try {
        if (alreadyIn) {
          await apiClient.removeFromWishlist(numericId);
        } else {
          await apiClient.addToWishlist(movie);
        }
      } catch (err) {
        console.error('Wishlist sync failed, rolling back:', err);
        // Rollback on failure
        setWishlistItems(previousItems);
        alert(`Could not update wishlist: ${err.message}`);
      }
    },
    [isInWishlist, wishlistItems]
  );

  const removeFromWishlist = useCallback(
    async (movieId) => {
      const numericId = parseInt(movieId, 10);
      const previousItems = [...wishlistItems];
      setWishlistItems((prev) =>
        prev.filter((item) => parseInt(item.movieId || item.id, 10) !== numericId)
      );

      try {
        await apiClient.removeFromWishlist(numericId);
      } catch (err) {
        console.error('Failed to remove from wishlist:', err);
        setWishlistItems(previousItems);
      }
    },
    [wishlistItems]
  );

  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isLoading,
    error,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    refreshWishlist: fetchWishlist,
  };
}
