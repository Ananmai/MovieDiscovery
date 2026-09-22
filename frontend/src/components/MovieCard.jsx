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

  // Rating badge styling for light theme
  const getRatingBadge = (rating) => {
    if (rating >= 8.0) {
      return {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm',
        starColor: 'fill-emerald-500 text-emerald-500',
      };
    }
    if (rating >= 7.0) {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-800 shadow-sm',
        starColor: 'fill-amber-500 text-amber-500',
      };
    }
    return {
      bg: 'bg-slate-100 border-slate-200 text-slate-700 shadow-sm',
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
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-orange-400 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer flex flex-col h-full transform hover:-translate-y-1.5"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-poster w-full bg-slate-100 overflow-hidden">
        {movie.posterUrl && !imageError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-100">
            <Film className="w-10 h-10 text-slate-400 mb-2" />
            <span className="text-xs font-semibold text-slate-600 line-clamp-3">
              {movie.title}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">No Poster Available</span>
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center gap-2.5 p-4 z-10">
          <button
            onClick={handleTrailerClick}
            className="p-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/40 hover:scale-110 active:scale-95 transition-all"
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
            className="p-3 rounded-full bg-white hover:bg-slate-100 text-slate-800 shadow-xl hover:scale-110 active:scale-95 transition-all"
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
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border backdrop-blur-md pointer-events-auto ${ratingStyle.bg}`}
          >
            <Star className={`w-3 h-3 ${ratingStyle.starColor}`} />
            <span>{movie.rating.toFixed(1)}</span>
          </div>

          {/* Quick Wishlist Toggle Button */}
          <button
            onClick={handleWishlistClick}
            className={`p-2 rounded-full backdrop-blur-md border transition-all active:scale-90 pointer-events-auto shadow-md ${
              inWishlist
                ? 'bg-rose-50 border-rose-300 text-rose-600 scale-105'
                : 'bg-white/95 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist toggle"
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Release Year Tag on Poster Bottom */}
        {movie.releaseYear && (
          <div className="absolute bottom-2 left-2.5 pointer-events-none z-20">
            <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-800 border border-slate-200 shadow-sm">
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
            className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight"
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
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Overview Snippet */}
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
          {movie.overview}
        </p>
      </div>
    </div>
  );
}
