import React from 'react';
import { MovieCard } from './MovieCard.jsx';
import { Loader2 } from 'lucide-react';

export function MovieGrid({
  movies = [],
  onOpenDetails,
  isInWishlist,
  onToggleWishlist,
  hasMore,
  onLoadMore,
  isLoadingMore,
}) {
  return (
    <div className="space-y-8">
      {/* Grid of Movie Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onOpenDetails={onOpenDetails}
            isInWishlist={isInWishlist}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>

      {/* Pagination / Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4 pb-8">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cinema-card hover:bg-cinema-surface border border-cinema-border/70 hover:border-brand-500/50 text-slate-200 hover:text-white text-sm font-semibold transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                <span>Loading more movies...</span>
              </>
            ) : (
              <span>Load More Movies</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
