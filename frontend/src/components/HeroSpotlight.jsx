import React from 'react';
import { Star, Play, Heart, Info, Calendar } from 'lucide-react';

export function HeroSpotlight({
  movie,
  onOpenDetails,
  onOpenTrailer,
  isInWishlist,
  onToggleWishlist,
}) {
  if (!movie) return null;

  const inWishlist = isInWishlist(movie.id);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-8 border border-cinema-border/50 shadow-2xl bg-cinema-card">
      {/* Backdrop Image */}
      <div className="relative h-[380px] sm:h-[440px] md:h-[480px] w-full">
        {movie.backdropUrl ? (
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-900 to-indigo-950 flex items-center justify-center">
            <span className="text-slate-600 text-lg">No Backdrop Available</span>
          </div>
        )}

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg via-cinema-bg/60 to-transparent hidden sm:block" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 z-10">
        <div className="max-w-2xl space-y-3.5">
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-md bg-brand-600 text-white shadow-sm flex items-center gap-1">
              Featured Title
            </span>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{movie.rating.toFixed(1)} / 10</span>
            </div>
            {movie.releaseYear && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-slate-700 text-slate-300">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{movie.releaseYear}</span>
              </div>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <span className="text-slate-300 text-xs hidden md:inline">
                • {movie.genres.slice(0, 3).join(' / ')}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {movie.title}
          </h1>

          {/* Overview */}
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow">
            {movie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenTrailer ? onOpenTrailer(movie) : onOpenDetails(movie.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Trailer</span>
            </button>

            <button
              onClick={() => onOpenDetails(movie.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cinema-surface/90 hover:bg-cinema-surface border border-cinema-border text-slate-200 font-medium text-sm transition-all"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>Details</span>
            </button>

            <button
              onClick={() => onToggleWishlist(movie)}
              className={`p-2.5 rounded-xl border transition-all active:scale-90 ${
                inWishlist
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-sm'
                  : 'bg-black/60 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
