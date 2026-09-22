import React, { useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { HeroSpotlight } from './components/HeroSpotlight.jsx';
import { FilterBar } from './components/FilterBar.jsx';
import { MovieGrid } from './components/MovieGrid.jsx';
import { MovieDetailsModal } from './components/MovieDetailsModal.jsx';
import { WishlistView } from './components/WishlistView.jsx';
import { MovieGridSkeleton } from './components/LoadingSkeleton.jsx';
import { EmptyState } from './components/EmptyState.jsx';
import { ErrorAlert } from './components/ErrorAlert.jsx';
import { useWishlist } from './hooks/useWishlist.js';
import { useMovies } from './hooks/useMovies.js';

export function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Wishlist state & operations
  const {
    wishlistItems,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
  } = useWishlist();

  // Movie discovery, filters, search, and pagination
  const {
    movies,
    genres,
    spotlightMovie,
    selectedGenre,
    setSelectedGenre,
    selectedYear,
    setSelectedYear,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    totalResults,
    hasMore,
    loadMore,
    isLoading,
    isLoadingMore,
    error,
    dataSource,
    resetFilters,
    refresh,
  } = useMovies({ activeTab, searchQuery });

  // Handle open details modal
  const handleOpenDetails = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseDetails = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cinema-bg text-slate-100">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        wishlistCount={wishlistCount}
        dataSource={dataSource}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Wishlist View */}
        {activeTab === 'wishlist' ? (
          <WishlistView
            wishlistItems={wishlistItems}
            onOpenDetails={handleOpenDetails}
            onRemoveFromWishlist={removeFromWishlist}
            onBrowseMovies={() => setActiveTab('discover')}
          />
        ) : (
          /* Movie Discovery Views (Discover, Trending, Top Rated, Search) */
          <>
            {/* Error Notification Banner */}
            {error && <ErrorAlert message={error} onRetry={refresh} />}

            {/* Spotlight Banner (Show on Page 1 when not searching and spotlight available) */}
            {!searchQuery && spotlightMovie && !selectedGenre && minRating === 0 && (
              <HeroSpotlight
                movie={spotlightMovie}
                onOpenDetails={handleOpenDetails}
                isInWishlist={isInWishlist}
                onToggleWishlist={toggleWishlist}
              />
            )}

            {/* Title & Section Header */}
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {searchQuery ? (
                  <span>
                    Search Results for <span className="text-brand-400">"{searchQuery}"</span>
                  </span>
                ) : activeTab === 'trending' ? (
                  '🔥 Trending This Week'
                ) : activeTab === 'top_rated' ? (
                  '⭐ Top Rated Cinema'
                ) : (
                  '✨ Explore & Discover Movies'
                )}
              </h2>
            </div>

            {/* Filter & Sorting Controls Bar */}
            <FilterBar
              genres={genres}
              selectedGenre={selectedGenre}
              onSelectGenre={setSelectedGenre}
              sortBy={sortBy}
              onSelectSort={setSortBy}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
              minRating={minRating}
              onSelectMinRating={setMinRating}
              onResetFilters={resetFilters}
              totalResults={totalResults}
            />

            {/* Loading Skeleton */}
            {isLoading && <MovieGridSkeleton count={10} />}

            {/* Empty State */}
            {!isLoading && movies.length === 0 && (
              <EmptyState
                title={searchQuery ? `No titles matching "${searchQuery}"` : 'No movies found'}
                description="Try selecting a different genre, lowering your rating filter, or checking your spelling."
                onReset={resetFilters}
              />
            )}

            {/* Movie Grid */}
            {!isLoading && movies.length > 0 && (
              <MovieGrid
                movies={movies}
                onOpenDetails={handleOpenDetails}
                isInWishlist={isInWishlist}
                onToggleWishlist={toggleWishlist}
                hasMore={hasMore}
                onLoadMore={loadMore}
                isLoadingMore={isLoadingMore}
              />
            )}
          </>
        )}
      </main>

      {/* Detailed Movie Modal */}
      {selectedMovieId && (
        <MovieDetailsModal
          movieId={selectedMovieId}
          onClose={handleCloseDetails}
          isInWishlist={isInWishlist}
          onToggleWishlist={toggleWishlist}
          onSelectMovie={handleOpenDetails}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-cinema-border/50 bg-cinema-card/50 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            🎬 <span className="font-semibold text-slate-300">CineScope Discovery</span> — Built with React, Node.js, Express & SQLite.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>In-Memory Caching</span>
            <span>•</span>
            <span>SQLite Wishlist</span>
            <span>•</span>
            <span>TMDB Resilient Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
