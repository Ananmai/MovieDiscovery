import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client.js';
import { X, Star, Calendar, Clock, Heart, Play, User, Film, AlertCircle, Loader2 } from 'lucide-react';

export function MovieDetailsModal({
  movieId,
  onClose,
  isInWishlist,
  onToggleWishlist,
  onSelectMovie,
}) {
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  // Fetch detailed movie info
  useEffect(() => {
    if (!movieId) return;

    let isMounted = true;
    const controller = new AbortController();

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        setShowTrailer(false);

        const details = await apiClient.getMovieDetails(movieId, controller.signal);
        if (isMounted) {
          setMovie(details);
        }

        // Fetch recommendations concurrently
        try {
          const recs = await apiClient.getRecommendations(movieId, controller.signal);
          if (isMounted && Array.isArray(recs.results)) {
            setRecommendations(recs.results);
          }
        } catch (e) {
          // ignore recommendations error
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          setError(err.message || 'Failed to load movie details');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Handle escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isMounted = false;
      controller.abort();
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [movieId, onClose]);

  if (!movieId) return null;

  const inWishlist = movie ? isInWishlist(movie.id) : false;

  // Format runtime into hours & minutes
  const formatRuntime = (mins) => {
    if (!mins) return 'N/A';
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    return `${hours}h ${remaining}m`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Click backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-cinema-card border border-cinema-border rounded-2xl shadow-2xl overflow-hidden z-10 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white backdrop-blur-md transition-all border border-white/10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="p-16 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
            <p className="text-sm text-slate-400">Loading film details...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-12 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-lg font-semibold text-white">Unable to load details</h3>
            <p className="text-sm text-slate-400">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-cinema-surface hover:bg-cinema-surface/80 rounded-xl text-sm font-medium"
            >
              Close
            </button>
          </div>
        )}

        {/* Loaded Details */}
        {!isLoading && !error && movie && (
          <div>
            {/* Backdrop / Trailer Header */}
            <div className="relative aspect-backdrop w-full max-h-[360px] bg-cinema-surface overflow-hidden">
              {showTrailer && movie.trailer?.embedUrl ? (
                <iframe
                  src={movie.trailer.embedUrl}
                  title={`${movie.title} Trailer`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  {movie.backdropUrl ? (
                    <img
                      src={movie.backdropUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center">
                      <Film className="w-16 h-16 text-slate-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-cinema-card via-cinema-card/50 to-transparent" />

                  {/* Play Trailer Floating Button */}
                  {movie.trailer?.key && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-brand-600/90 hover:bg-brand-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 group"
                      aria-label="Play Trailer"
                    >
                      <Play className="w-7 h-7 fill-white ml-1 group-hover:scale-105 transition-transform" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {movie.title}
                  </h2>
                  {movie.tagline && (
                    <p className="text-sm italic text-slate-400 font-normal">
                      "{movie.tagline}"
                    </p>
                  )}

                  {/* Badges & Stats */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{movie.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">
                        ({movie.voteCount.toLocaleString()} votes)
                      </span>
                    </div>

                    {movie.releaseDate && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cinema-surface border border-cinema-border">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{movie.releaseDate}</span>
                      </div>
                    )}

                    {movie.runtime && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cinema-surface border border-cinema-border">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(movie)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-95 shrink-0 ${
                    inWishlist
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 hover:bg-rose-500/30'
                      : 'bg-cinema-surface hover:bg-cinema-surface/80 border-cinema-border text-slate-200 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Genre Chips */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-cinema-surface border border-cinema-border/80 text-brand-300 font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Synopsis / Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Overview
                </h4>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  {movie.overview}
                </p>
              </div>

              {/* Cast & Director */}
              {((movie.directors && movie.directors.length > 0) || (movie.cast && movie.cast.length > 0)) && (
                <div className="space-y-4 pt-2 border-t border-cinema-border/60">
                  {movie.directors && movie.directors.length > 0 && (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Director:{' '}
                      </span>
                      <span className="text-sm font-medium text-slate-200 ml-1">
                        {movie.directors.map((d) => d.name).join(', ')}
                      </span>
                    </div>
                  )}

                  {movie.cast && movie.cast.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Top Cast
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {movie.cast.slice(0, 4).map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-cinema-surface/60 border border-cinema-border/50"
                          >
                            <div className="w-9 h-9 rounded-full bg-cinema-card overflow-hidden shrink-0 flex items-center justify-center border border-slate-700">
                              {member.profileUrl ? (
                                <img
                                  src={member.profileUrl}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-semibold text-slate-200 truncate">
                                {member.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {member.character || 'Cast'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations / More Like This */}
              {recommendations && recommendations.length > 0 && (
                <div className="pt-4 border-t border-cinema-border/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    More Like This
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {recommendations.slice(0, 6).map((rec) => (
                      <button
                        key={rec.id}
                        onClick={() => onSelectMovie(rec.id)}
                        className="group text-left space-y-1.5 focus:outline-none"
                      >
                        <div className="aspect-poster rounded-lg overflow-hidden bg-cinema-surface border border-cinema-border/50 group-hover:border-brand-500/60 transition-all">
                          {rec.posterUrl ? (
                            <img
                              src={rec.posterUrl}
                              alt={rec.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-2 text-[10px] text-slate-500 text-center">
                              {rec.title}
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-slate-300 group-hover:text-brand-300 truncate">
                          {rec.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
