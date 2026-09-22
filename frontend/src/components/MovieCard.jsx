import React, { useState } from 'react';
import { Star, Heart, Film, Play, Eye } from 'lucide-react';

export function MovieCard({
  movie,
  onOpenDetails,
  onOpenTrailer,
  isInWishlist,
  onToggleWishlist,
}) {
  const [imageError, setImageError] = useState(false);
  const inWishlist = isInWishlist(movie.id);

  // Rating badge styling
  const getRatingBadge = (rating) => {
    if (rating >= 8.0) {
      return {
        bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-emerald-950/50',
        starColor: 'fill-emerald-400 text-emerald-400',
      };
    }
    if (rating >= 7.0) {
      return {
        bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300 shadow-amber-950/50',
        starColor: 'fill-amber-400 text-amber-400',
      };
    }
    return {
      bg: 'bg-slate-900/80 border-slate-600/50 text-slate-300 shadow-black/50',
      starColor: 'fill-slate-400 text-slate-400',
    };
  };

  const ratingStyle = getRatingBadge(movie.rating);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    onToggleWishlist(movie);
  };

  const handleTrailerClick = (e) => {
    e.stopPropagation();
    if (onOpenTrailer) {
      onOpenTrailer(movie);
    } else {
      onOpenDetails(movie.id);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(movie.id)}
      className="group relative bg-cinema-card rounded-2xl overflow-hidden border border-white/[0.07] hover:border-brand-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10 cursor-pointer flex flex-col h-full transform hover:-translate-y-1.5"
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
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-cinema-surface to-cinema-card">
            <Film className="w-10 h-10 text-slate-600 mb-2" />
            <span className="text-xs font-semibold text-slate-400 line-clamp-3">
              {movie.title}
            </span>
            <span className="text-[10px] text-slate-600 mt-1">No Poster Available</span>
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center gap-2.5 p-4 z-10">
          <button
            onClick={handleTrailerClick}
            className="p-3 rounded-full bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-600/40 hover:scale-110 active:scale-95 transition-all"
            title="Watch Trailer"
            aria-label="Watch Trailer"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(movie.id);
            }}
            className="p-3 rounded-full glass-panel hover:bg-white/20 text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
            title="View Details"
            aria-label="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
          {/* Rating Pill */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold border backdrop-blur-md shadow-md pointer-events-auto ${ratingStyle.bg}`}
          >
            <Star className={`w-3 h-3 ${ratingStyle.starColor}`} />
            <span>{movie.rating.toFixed(1)}</span>
          </div>

          {/* Quick Wishlist Toggle Button */}
          <button
            onClick={handleWishlistClick}
            className={`p-2 rounded-full backdrop-blur-md border transition-all active:scale-90 pointer-events-auto ${
              inWishlist
                ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/40 scale-105'
                : 'bg-black/50 border-white/20 text-slate-300 hover:text-white hover:bg-black/80 hover:border-white/40'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist toggle"
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-white text-white' : ''}`} />
          </button>
        </div>

        {/* Release Year Tag on Poster Bottom */}
        {movie.releaseYear && (
          <div className="absolute bottom-2 left-2.5 pointer-events-none z-20">
            <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-semibold text-slate-200 border border-white/10">
              {movie.releaseYear}
            </span>
          </div>
        )}
      </div>

      {/* Movie Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Title */}
          <h3
            className="text-sm font-bold text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-2 leading-tight"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {/* Genre Tags */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {movie.genres.slice(0, 2).map((genre, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-cinema-surface border border-cinema-border/70 text-slate-300 font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Overview Snippet */}
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-normal">
          {movie.overview}
        </p>
      </div>
    </div>
  );
}
