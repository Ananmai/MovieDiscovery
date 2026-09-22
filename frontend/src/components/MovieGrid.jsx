import React from 'react';
import { MovieCard } from './MovieCard.jsx';
import { Loader2 } from 'lucide-react';

export function MovieGrid({
  movies = [],
  onOpenDetails,
  onOpenTrailer,
  isInWishlist,
  onToggleWishlist,
  hasMore,
  onLoadMore,
  isLoadingMore,
}) {
  return (
    <div className="space-y-10">
      {/* Grid of Movie Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onOpenDetails={onOpenDetails}
            onOpenTrailer={onOpenTrailer}
            isInWishlist={isInWishlist}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-2 pb-10">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="group flex items-center gap-2.5 px-8 py-3.5 rounded-2xl glass-panel hover:bg-white/10 text-slate-200 hover:text-white text-sm font-bold transition-all shadow-xl active:scale-95 disabled:opacity-50 border border-white/10 hover:border-brand-500/50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                <span>Fetching more films...</span>
              </>
            ) : (
              <>
                <span>Load More Movies</span>
                <span className="text-brand-400 group-hover:translate-x-1 transition-transform">↓</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
