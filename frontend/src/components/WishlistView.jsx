import React, { useState, useMemo } from 'react';
import { Heart, Search, Trash2, Star, Calendar, ArrowRight, Film, Sparkles } from 'lucide-react';

export function WishlistView({
  wishlistItems = [],
  onOpenDetails,
  onOpenTrailer,
  onRemoveFromWishlist,
  onBrowseMovies,
}) {
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, rating, title

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
      <div className="py-24 px-4 text-center max-w-lg mx-auto space-y-6 animate-fadeIn">
        <div className="relative w-24 h-24 mx-auto">
          <div className="w-24 h-24 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center shadow-lg">
            <Heart className="w-12 h-12 text-rose-500" />
          </div>
        </div>

        <div className="space-y-2.5">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Wishlist is Empty</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            Browse through films, click the heart on anything you want to watch, and your personal collection will be saved right here in your local database.
          </p>
        </div>

        <button
          onClick={onBrowseMovies}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-xl shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Discover Movies Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500 border border-rose-200">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <span>My Wishlist</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'title' : 'titles'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Saved permanently in your SQLite database. Retained across browser sessions.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search wishlist..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 w-48 transition-all"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="rating">Highest Rated</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid of Wishlist Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {filteredItems.map((movie) => {
          const movieId = movie.movieId || movie.id;
          return (
            <div
              key={movieId}
              onClick={() => onOpenDetails(movieId)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-orange-400 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer flex flex-col h-full transform hover:-translate-y-1.5"
            >
              {/* Poster */}
              <div className="relative aspect-poster w-full bg-slate-100 overflow-hidden">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-slate-100">
                    <Film className="w-8 h-8 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-600 line-clamp-2">{movie.title}</span>
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-2.5 left-2.5 pointer-events-none">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold border border-amber-200 bg-amber-50 text-amber-800 shadow-sm">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{typeof movie.rating === 'number' ? movie.rating.toFixed(1) : 'N/A'}</span>
                  </div>
                </div>

                {/* Remove from Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromWishlist(movieId, movie.title);
                  }}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 shadow-md transition-all active:scale-90"
                  title="Remove from Wishlist"
                  aria-label="Remove from Wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Release Year Tag */}
                {movie.releaseDate && (
                  <div className="absolute bottom-2 left-2.5 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-800 border border-slate-200 shadow-sm">
                      {movie.releaseDate.slice(0, 4)}
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
                <div>
                  <h3
                    className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight"
                    title={movie.title}
                  >
                    {movie.title}
                  </h3>
                  {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {movie.genres.slice(0, 2).map((genre, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {movie.overview && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
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
