import React, { useState } from 'react';
import { Star, Heart, Film } from 'lucide-react';

export function MovieCard({
  movie,
  onOpenDetails,
  isInWishlist,
  onToggleWishlist,
}) {
  const [imageError, setImageError] = useState(false);
  const inWishlist = isInWishlist(movie.id);

  // Determine badge color by rating
  const getRatingColor = (rating) => {
    if (rating >= 8.0) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60';
    if (rating >= 7.0) return 'text-amber-300 border-amber-500/40 bg-amber-950/60';
    return 'text-slate-300 border-slate-700 bg-slate-900/60';
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation(); // prevent modal from opening
    onToggleWishlist(movie);
  };

  return (
    <div
      onClick={() => onOpenDetails(movie.id)}
      className="group relative bg-cinema-card rounded-xl overflow-hidden border border-cinema-border/50 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-poster w-full bg-cinema-surface overflow-hidden">
        {movie.posterUrl && !imageError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Fallback Poster Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-cinema-surface to-cinema-card">
            <Film className="w-10 h-10 text-slate-600 mb-2" />
            <span className="text-xs font-semibold text-slate-400 line-clamp-3">
              {movie.title}
            </span>
            <span className="text-[10px] text-slate-600 mt-1">No Image Available</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Rating Pill */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border backdrop-blur-md shadow-sm pointer-events-auto ${getRatingColor(
              movie.rating
            )}`}
          >
            <Star className="w-3 h-3 fill-current" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>

          {/* Quick Wishlist Toggle Button */}
          <button
            onClick={handleWishlistClick}
            className={`p-2 rounded-full backdrop-blur-md border transition-all active:scale-90 pointer-events-auto ${
              inWishlist
                ? 'bg-rose-600/90 border-rose-500 text-white shadow-md'
                : 'bg-black/50 border-white/20 text-slate-300 hover:text-white hover:bg-black/80 hover:border-white/40'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label="Wishlist toggle"
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-white text-white' : ''}`} />
          </button>
        </div>

        {/* Release Year Pill on Poster Bottom */}
        {movie.releaseYear && (
          <div className="absolute bottom-2 left-2.5 pointer-events-none">
            <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-medium text-slate-300 border border-white/10">
              {movie.releaseYear}
            </span>
          </div>
        )}
      </div>

      {/* Movie Details Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Title */}
          <h3
            className="text-sm font-semibold text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-2 leading-tight"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {/* Genre Chips */}
          {movie.genres && movie.genres.length > 0 && (
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

        {/* Overview snippet */}
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
          {movie.overview}
        </p>
      </div>
    </div>
  );
}
