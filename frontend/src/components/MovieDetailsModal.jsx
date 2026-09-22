import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client.js';
import { X, Star, Calendar, Clock, Heart, Play, User, Film, AlertCircle, Loader2, Sparkles, ExternalLink } from 'lucide-react';

export function MovieDetailsModal({
  movieId,
  onClose,
  onOpenTrailerDirect,
  isInWishlist,
  onToggleWishlist,
  onSelectMovie,
}) {
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmbeddedTrailer, setShowEmbeddedTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, cast, details

  useEffect(() => {
    if (!movieId) return;

    let isMounted = true;
    const controller = new AbortController();

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        setShowEmbeddedTrailer(false);

        const details = await apiClient.getMovieDetails(movieId, controller.signal);
        if (isMounted) {
          setMovie(details);
        }

        try {
          const recs = await apiClient.getRecommendations(movieId, controller.signal);
          if (isMounted && Array.isArray(recs.results)) {
            setRecommendations(recs.results);
          }
        } catch (e) {}
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          setError(err.message || 'Failed to load movie details');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    document.body.style.overflow = 'hidden';
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

  const formatRuntime = (mins) => {
    if (!mins) return null;
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    return `${hours}h ${remaining}m`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Click backdrop to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-cinema-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 hover:bg-rose-600 text-slate-300 hover:text-white backdrop-blur-md transition-all border border-white/10 shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-brand-400" />
            <p className="text-sm font-medium text-slate-400">Loading film details...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-16 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Unable to Load Title</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">{error}</p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-cinema-surface hover:bg-white/10 rounded-xl text-sm font-semibold text-white border border-white/10"
            >
              Close
            </button>
          </div>
        )}

        {/* Loaded Movie Body */}
        {!isLoading && !error && movie && (
          <div>
            {/* Top Backdrop / Video Section */}
            <div className="relative aspect-video max-h-[380px] w-full bg-black overflow-hidden">
              {showEmbeddedTrailer && movie.trailer?.embedUrl ? (
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
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-950 via-slate-900 to-cinema-card flex items-center justify-center">
                      <Film className="w-16 h-16 text-slate-700" />
                    </div>
                  )}

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cinema-card via-cinema-card/40 to-transparent" />

                  {/* Big Play Button on backdrop */}
                  {movie.trailer?.key && (
                    <button
                      onClick={() => setShowEmbeddedTrailer(true)}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-brand-600/90 hover:bg-brand-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 group"
                      aria-label="Play Trailer"
                    >
                      <Play className="w-7 h-7 fill-white ml-1 group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-[11px] font-bold uppercase tracking-wider">
                      {movie.status || 'Released'}
                    </span>
                    {movie.releaseYear && (
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[11px] font-semibold">
                        {movie.releaseYear}
                      </span>
                    )}
                    {formatRuntime(movie.runtime) && (
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[11px] font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatRuntime(movie.runtime)}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                    {movie.title}
                  </h2>

                  {movie.tagline && (
                    <p className="text-sm italic text-slate-400 font-normal">
                      "{movie.tagline}"
                    </p>
                  )}

                  {/* Rating display */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-sm">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{movie.rating.toFixed(1)} / 10</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Based on {movie.voteCount.toLocaleString()} ratings
                    </span>
                  </div>
                </div>

                {/* Wishlist Action Button */}
                <button
                  onClick={() => onToggleWishlist(movie)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-sm font-bold transition-all hover:scale-105 active:scale-95 shrink-0 ${
                    inWishlist
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-400 shadow-lg shadow-rose-600/20'
                      : 'glass-panel text-slate-200 hover:text-white hover:border-white/30'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Genre Pills */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-xl bg-cinema-surface/90 border border-white/10 text-brand-300 font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Navigation Tabs for Details Modal */}
              <div className="border-b border-cinema-border/60 flex items-center gap-6 text-sm font-semibold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 transition-colors relative ${
                    activeTab === 'overview'
                      ? 'text-white border-b-2 border-brand-500'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Overview & Cast
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-3 transition-colors relative ${
                    activeTab === 'details'
                      ? 'text-white border-b-2 border-brand-500'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Production Info
                </button>
              </div>

              {/* Tab 1: Overview & Cast */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Storyline
                    </h4>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                      {movie.overview}
                    </p>
                  </div>

                  {/* Top Cast Members */}
                  {movie.cast && movie.cast.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Lead Cast
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {movie.cast.slice(0, 4).map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 p-2.5 rounded-2xl glass-panel"
                          >
                            <div className="w-10 h-10 rounded-full bg-cinema-surface overflow-hidden shrink-0 flex items-center justify-center border border-white/10">
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
                              <p className="text-xs font-bold text-slate-200 truncate">
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

              {/* Tab 2: Production Info */}
              {activeTab === 'details' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs animate-fadeIn">
                  {movie.directors && movie.directors.length > 0 && (
                    <div className="p-4 rounded-2xl glass-panel space-y-1">
                      <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                        Director
                      </span>
                      <p className="text-sm font-semibold text-white">
                        {movie.directors.map((d) => d.name).join(', ')}
                      </p>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl glass-panel space-y-1">
                    <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                      Status
                    </span>
                    <p className="text-sm font-semibold text-white">{movie.status || 'Released'}</p>
                  </div>

                  {movie.releaseDate && (
                    <div className="p-4 rounded-2xl glass-panel space-y-1">
                      <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                        Release Date
                      </span>
                      <p className="text-sm font-semibold text-white">{movie.releaseDate}</p>
                    </div>
                  )}

                  {movie.budget > 0 && (
                    <div className="p-4 rounded-2xl glass-panel space-y-1">
                      <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                        Budget
                      </span>
                      <p className="text-sm font-semibold text-white">
                        ${(movie.budget / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  )}

                  {movie.revenue > 0 && (
                    <div className="p-4 rounded-2xl glass-panel space-y-1">
                      <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                        Box Office
                      </span>
                      <p className="text-sm font-semibold text-white">
                        ${(movie.revenue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* More Like This Recommendations */}
              {recommendations && recommendations.length > 0 && (
                <div className="pt-4 border-t border-cinema-border/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    <span>More Titles Like This</span>
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {recommendations.slice(0, 6).map((rec) => (
                      <button
                        key={rec.id}
                        onClick={() => onSelectMovie(rec.id)}
                        className="group text-left space-y-1.5 focus:outline-none"
                      >
                        <div className="aspect-poster rounded-xl overflow-hidden bg-cinema-surface border border-white/10 group-hover:border-brand-500/70 transition-all shadow-md">
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
                        <p className="text-[11px] font-semibold text-slate-300 group-hover:text-brand-300 truncate">
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
