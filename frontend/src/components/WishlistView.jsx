import React, { useState, useMemo } from 'react';
import { Heart, Search, Trash2, Star, Calendar, ArrowRight, Film } from 'lucide-react';

export function WishlistView({
  wishlistItems = [],
  onOpenDetails,
  onRemoveFromWishlist,
  onBrowseMovies,
}) {
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, rating, title

  // Filter and sort saved items
  const filteredItems = useMemo(() => {
    let result = [...wishlistItems];

    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.overview?.toLowerCase().includes(q) ||
          (Array.isArray(item.genres) && item.genres.some((g) => g.toLowerCase().includes(q)))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    return result;
  }, [wishlistItems, filterQuery, sortBy]);

  // Empty State
  if (wishlistItems.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto space-y-5">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <Heart className="w-10 h-10 text-rose-500/70" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Wishlist is Empty</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Explore movies, click the heart icon on any title you are interested in, and they will be saved here in your persistent library.
          </p>
        </div>
        <button
          onClick={onBrowseMovies}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-600/30 transition-all active:scale-95"
        >
          <span>Discover Movies</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cinema-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            <span>My Wishlist</span>
            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'title' : 'titles'}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Persistently saved in your local database. Access your saved movies anytime.
          </p>
        </div>

        {/* Filter and Sort bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick filter input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter wishlist..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-cinema-card border border-cinema-border rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 w-44"
            />
          </div>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-xs bg-cinema-card border border-cinema-border rounded-xl text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="rating">Highest Rated</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filtered Count if searching */}
      {filterQuery && (
        <p className="text-xs text-slate-400">
          Showing {filteredItems.length} of {wishlistItems.length} saved movies
        </p>
      )}

      {/* Grid of Wishlist Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {filteredItems.map((movie) => {
          const movieId = movie.movieId || movie.id;
          return (
            <div
              key={movieId}
              onClick={() => onOpenDetails(movieId)}
              className="group relative bg-cinema-card rounded-xl overflow-hidden border border-cinema-border/60 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
            >
              {/* Poster */}
              <div className="relative aspect-poster w-full bg-cinema-surface overflow-hidden">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-cinema-surface">
                    <Film className="w-8 h-8 text-slate-600 mb-1" />
                    <span className="text-xs text-slate-400 line-clamp-2">{movie.title}</span>
                  </div>
                )}

                {/* Rating badge */}
                <div className="absolute top-2.5 left-2.5 pointer-events-none">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border border-amber-500/40 bg-black/70 backdrop-blur-md text-amber-300">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{typeof movie.rating === 'number' ? movie.rating.toFixed(1) : 'N/A'}</span>
                  </div>
                </div>

                {/* Remove from Wishlist button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromWishlist(movieId);
                  }}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/60 hover:bg-rose-600 border border-white/20 hover:border-rose-500 text-slate-300 hover:text-white backdrop-blur-md transition-all active:scale-90"
                  title="Remove from wishlist"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Release date if available */}
                {movie.releaseDate && (
                  <div className="absolute bottom-2 left-2.5 pointer-events-none">
                    <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-medium text-slate-300 border border-white/10">
                      {movie.releaseDate.slice(0, 4)}
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                <div>
                  <h3
                    className="text-sm font-semibold text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-2 leading-tight"
                    title={movie.title}
                  >
                    {movie.title}
                  </h3>
                  {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {movie.genres.slice(0, 2).map((genre, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-cinema-surface text-slate-400 font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {movie.overview && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {movie.overview}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
