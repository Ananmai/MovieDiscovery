import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '../api/client.js';
import { useDebounce } from './useDebounce.js';

export function useMovies({ activeTab, searchQuery }) {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [spotlightMovie, setSpotlightMovie] = useState(null);
  
  // Filters
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity.desc');

  // Pagination & Loading
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('live-tmdb');

  // Debounce search query by 350ms
  const debouncedSearch = useDebounce(searchQuery, 350);

  // Active abort controller reference to cancel in-flight requests
  const abortControllerRef = useRef(null);

  // Fetch genres list once on mount
  useEffect(() => {
    let isMounted = true;
    async function loadGenres() {
      try {
        const data = await apiClient.getGenres();
        if (isMounted && Array.isArray(data.genres)) {
          setGenres(data.genres);
        }
      } catch (err) {
        console.warn('Failed to load genres:', err);
      }
    }
    loadGenres();
    return () => {
      isMounted = false;
    };
  }, []);

  // Reset pagination when primary query or filters change
  const fetchMovies = useCallback(
    async (pageToLoad = 1, append = false) => {
      // Abort previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        let responseData = null;

        if (debouncedSearch && debouncedSearch.trim().length > 0) {
          // Search mode
          responseData = await apiClient.search(
            { query: debouncedSearch.trim(), page: pageToLoad },
            signal
          );
        } else if (activeTab === 'trending') {
          responseData = await apiClient.getTrending(
            { page: pageToLoad },
            signal
          );
        } else if (activeTab === 'top_rated') {
          responseData = await apiClient.getDiscover(
            {
              page: pageToLoad,
              sortBy: 'vote_average.desc',
              genre: selectedGenre,
              year: selectedYear,
              minRating: minRating > 0 ? minRating : 7,
            },
            signal
          );
        } else {
          // Default Discover mode
          responseData = await apiClient.getDiscover(
            {
              page: pageToLoad,
              sortBy,
              genre: selectedGenre,
              year: selectedYear,
              minRating,
            },
            signal
          );
        }

        if (signal.aborted) return;

        const results = responseData.results || [];
        setPage(responseData.page || pageToLoad);
        setTotalPages(responseData.totalPages || 1);
        setTotalResults(responseData.totalResults || results.length);
        if (responseData.dataSource) {
          setDataSource(responseData.dataSource);
        }

        if (append) {
          setMovies((prev) => [...prev, ...results]);
        } else {
          setMovies(results);
          // Set spotlight movie from the top result if on page 1
          if (results.length > 0 && pageToLoad === 1) {
            setSpotlightMovie(results[0]);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch movies error:', err);
          setError(err.message || 'Failed to fetch movies');
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [debouncedSearch, activeTab, sortBy, selectedGenre, selectedYear, minRating]
  );

  // Trigger fetch when tab, search, or filters change
  useEffect(() => {
    fetchMovies(1, false);
  }, [fetchMovies]);

  // Load more / pagination
  const loadMore = useCallback(() => {
    if (!isLoadingMore && page < totalPages) {
      fetchMovies(page + 1, true);
    }
  }, [isLoadingMore, page, totalPages, fetchMovies]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSelectedGenre('');
    setSelectedYear('');
    setMinRating(0);
    setSortBy('popularity.desc');
  }, []);

  return {
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
    page,
    totalPages,
    totalResults,
    hasMore: page < totalPages,
    isLoading,
    isLoadingMore,
    error,
    dataSource,
    loadMore,
    resetFilters,
    refresh: () => fetchMovies(1, false),
  };
}
