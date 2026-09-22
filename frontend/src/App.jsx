import React, { useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { HeroSpotlight } from './components/HeroSpotlight.jsx';
import { FilterBar } from './components/FilterBar.jsx';
import { MovieGrid } from './components/MovieGrid.jsx';
import { MovieDetailsModal } from './components/MovieDetailsModal.jsx';
import { TrailerModal } from './components/TrailerModal.jsx';
import { WishlistView } from './components/WishlistView.jsx';
import { MovieGridSkeleton } from './components/LoadingSkeleton.jsx';
import { EmptyState } from './components/EmptyState.jsx';
import { ErrorAlert } from './components/ErrorAlert.jsx';
import { Toast } from './components/Toast.jsx';
import { useWishlist } from './hooks/useWishlist.js';
import { useMovies } from './hooks/useMovies.js';
import { apiClient } from './api/client.js';

export function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  
  // Dedicated Trailer Modal state
  const [activeTrailer, setActiveTrailer] = useState(null); // { trailer, title }

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Wishlist state & operations
  const {
    wishlistItems,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
  } = useWishlist();

  // Movies data, discovery filters, search, and pagination
  const {
    movies,
    genres,
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

  // Handle wishlist toggle with toast notification
  const handleToggleWishlistWithToast = async (movie) => {
    const isCurrentlyIn = isInWishlist(movie.id);
    await toggleWishlist(movie);

    setToast({
      type: isCurrentlyIn ? 'remove' : 'add',
      title: movie.title,
      posterUrl: movie.posterUrl || movie.poster_path,
    });

    // Auto-hide toast after 3.5s
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Handle remove with toast
  const handleRemoveFromWishlistWithToast = async (movieId, movieTitle) => {
    await removeFromWishlist(movieId);
    setToast({
      type: 'remove',
      title: movieTitle || 'Movie',
    });
    setTimeout(() => setToast(null), 3500);
  };

  // Open trailer directly
  const handleOpenTrailer = async (movie) => {
    try {
      const details = await apiClient.getMovieDetails(movie.id);
      if (details.trailer) {
        setActiveTrailer({
          trailer: details.trailer,
          title: details.title,
        });
      } else {
        // Fallback to opening details modal
        setSelectedMovieId(movie.id);
      }
    } catch (err) {
      setSelectedMovieId(movie.id);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#07090e] text-slate-100 overflow-x-hidden">
      
      {/* Ambient background glow orbs for high-end cinematic atmosphere */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        wishlistCount={wishlistCount}
        dataSource={dataSource}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-10">
        
        {/* Wishlist View */}
        {activeTab === 'wishlist' ? (
          <WishlistView
            wishlistItems={wishlistItems}
            onOpenDetails={(id) => setSelectedMovieId(id)}
            onOpenTrailer={handleOpenTrailer}
            onRemoveFromWishlist={handleRemoveFromWishlistWithToast}
            onBrowseMovies={() => setActiveTab('discover')}
          />
        ) : (
          /* Movie Discovery Views */
          <>
            {/* Error Notification Banner */}
            {error && <ErrorAlert message={error} onRetry={refresh} />}

            {/* Hero Carousel Spotlight (Visible on Page 1 when not searching and no genre selected) */}
            {!searchQuery && movies.length > 0 && !selectedGenre && minRating === 0 && (
              <HeroSpotlight
                movies={movies}
                onOpenDetails={(id) => setSelectedMovieId(id)}
                onOpenTrailer={handleOpenTrailer}
                isInWishlist={isInWishlist}
                onToggleWishlist={handleToggleWishlistWithToast}
              />
            )}

            {/* Section Header */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                  {searchQuery ? (
                    <span>
                      Results for <span className="text-gradient">"{searchQuery}"</span>
                    </span>
                  ) : activeTab === 'trending' ? (
                    <span>🔥 Trending Worldwide</span>
                  ) : activeTab === 'top_rated' ? (
                    <span>⭐ Critically Acclaimed Masterpieces</span>
                  ) : (
                    <span>✨ Explore & Discover</span>
                  )}
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {searchQuery
                    ? `Showing live results matching your query`
                    : `Curated cinematic collections updated in real-time`}
                </p>
              </div>
            </div>

            {/* Filter & Sorting Controls */}
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

            {/* Loading Skeletons */}
            {isLoading && <MovieGridSkeleton count={10} />}

            {/* Empty State */}
            {!isLoading && movies.length === 0 && (
              <EmptyState
                title={searchQuery ? `No titles found for "${searchQuery}"` : 'No movies found'}
                description="Try selecting a different genre, clearing your rating filter, or checking your spelling."
                onReset={resetFilters}
              />
            )}

            {/* Responsive Movie Grid */}
            {!isLoading && movies.length > 0 && (
              <MovieGrid
                movies={movies}
                onOpenDetails={(id) => setSelectedMovieId(id)}
                onOpenTrailer={handleOpenTrailer}
                isInWishlist={isInWishlist}
                onToggleWishlist={handleToggleWishlistWithToast}
                hasMore={hasMore}
                onLoadMore={loadMore}
                isLoadingMore={isLoadingMore}
              />
            )}
          </>
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovieId && (
        <MovieDetailsModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          onOpenTrailerDirect={handleOpenTrailer}
          isInWishlist={isInWishlist}
          onToggleWishlist={handleToggleWishlistWithToast}
          onSelectMovie={(id) => setSelectedMovieId(id)}
        />
      )}

      {/* Dedicated Trailer Modal */}
      {activeTrailer && (
        <TrailerModal
          trailer={activeTrailer.trailer}
          title={activeTrailer.title}
          onClose={() => setActiveTrailer(null)}
        />
      )}

      {/* Floating Wishlist Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Sleek Footer */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#07090e]/90 backdrop-blur-xl py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center text-white text-xs font-black">
              C
            </div>
            <p className="font-medium text-slate-300">
              CineScope Discovery &bull; Powered by React, Node.js & SQLite
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-medium">
            <span>In-Memory TTL Caching</span>
            <span>&bull;</span>
            <span>Full SQLite ACID Persistence</span>
            <span>&bull;</span>
            <span>Graceful Fallback Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
