import React, { useState, useEffect } from 'react';
import { Star, Play, Heart, Info, Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export function HeroSpotlight({
  movies = [],
  onOpenDetails,
  onOpenTrailer,
  isInWishlist,
  onToggleWishlist,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const featuredList = movies.slice(0, 5);
  const currentMovie = featuredList[currentIndex] || movies[0];

  // Auto-advance carousel every 7 seconds when not paused
  useEffect(() => {
    if (featuredList.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [featuredList.length, isPaused]);

  if (!currentMovie) return null;

  const inWishlist = isInWishlist(currentMovie.id);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredList.length);
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden mb-10 border border-white/10 shadow-2xl bg-cinema-card group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Backdrop Image with Smooth Crossfade */}
      <div className="relative h-[420px] sm:h-[480px] md:h-[520px] w-full overflow-hidden">
        {currentMovie.backdropUrl ? (
          <img
            key={currentMovie.id}
            src={currentMovie.backdropUrl}
            alt={currentMovie.title}
            className="w-full h-full object-cover object-center animate-fadeIn scale-105 duration-1000 transform transition-transform"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-950 via-slate-900 to-cinema-bg" />
        )}

        {/* Ambient Dark Gradient Overlays for Cinematic Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-[#07090e]/65 to-transparent hidden sm:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,_transparent_20%,_#07090e_90%)]" />
      </div>

      {/* Carousel Navigation Arrows */}
      {featuredList.length > 1 && (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 sm:px-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-full glass-panel text-white hover:bg-white/20 transition-all pointer-events-auto shadow-lg"
            aria-label="Previous featured movie"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-full glass-panel text-white hover:bg-white/20 transition-all pointer-events-auto shadow-lg"
            aria-label="Next featured movie"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-12 z-10">
        <div className="max-w-2xl space-y-4">
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-brand-600 to-rose-600 text-white shadow-lg shadow-brand-500/25 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3 h-3" />
              Spotlight #{currentIndex + 1}
            </span>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-amber-500/40 text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{currentMovie.rating.toFixed(1)}</span>
            </div>

            {currentMovie.releaseYear && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentMovie.releaseYear}</span>
              </div>
            )}

            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 uppercase font-mono tracking-wider">
              4K Ultra HD
            </span>

            {currentMovie.genres && currentMovie.genres.length > 0 && (
              <span className="text-slate-300 text-xs hidden md:inline font-medium">
                • {currentMovie.genres.slice(0, 3).join(' • ')}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
            {currentMovie.title}
          </h1>

          {/* Overview */}
          <p className="text-xs sm:text-sm md:text-base text-slate-300/90 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow max-w-xl font-normal">
            {currentMovie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => onOpenTrailer(currentMovie)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all hover:scale-105 active:scale-95 group/btn"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </div>
              <span>Watch Trailer</span>
            </button>

            <button
              onClick={() => onOpenDetails(currentMovie.id)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl glass-panel hover:bg-white/15 text-slate-200 hover:text-white font-semibold text-sm transition-all"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>Details</span>
            </button>

            <button
              onClick={() => onToggleWishlist(currentMovie)}
              className={`p-3 rounded-2xl border transition-all hover:scale-105 active:scale-90 ${
                inWishlist
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-lg shadow-rose-500/20'
                  : 'glass-panel text-slate-300 hover:text-white hover:border-white/30'
              }`}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

        </div>

        {/* Carousel Indicators / Dots */}
        {featuredList.length > 1 && (
          <div className="flex items-center gap-2 mt-6">
            {featuredList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-8 bg-brand-500 shadow-md shadow-brand-500/50'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
