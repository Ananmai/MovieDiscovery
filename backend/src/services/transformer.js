import { config } from '../config/index.js';

// Standard TMDB genre mapping dictionary for instant resolution
export const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

/**
 * Format image path to complete CDN URL
 */
export function formatImageUrl(path, size = 'w500') {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${config.tmdb.imageBaseUrl}/${size}${path}`;
}

/**
 * Extract 4-digit release year safely
 */
export function extractReleaseYear(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return 'N/A';
  const match = dateStr.match(/^(\d{4})/);
  return match ? match[1] : 'N/A';
}

/**
 * Transform a movie list item into normalized format
 */
export function transformMovieSummary(rawMovie, genreDict = GENRE_MAP) {
  if (!rawMovie) return null;

  // Resolve genre names
  let genres = [];
  if (Array.isArray(rawMovie.genres)) {
    genres = rawMovie.genres.map((g) => (typeof g === 'object' ? g.name : g));
  } else if (Array.isArray(rawMovie.genre_ids)) {
    genres = rawMovie.genre_ids.map((id) => genreDict[id] || `Genre ${id}`).filter(Boolean);
  }

  return {
    id: rawMovie.id,
    title: (rawMovie.title || rawMovie.name || 'Untitled').trim(),
    originalTitle: rawMovie.original_title || rawMovie.original_name || null,
    overview: rawMovie.overview && rawMovie.overview.trim().length > 0 
      ? rawMovie.overview.trim() 
      : 'No synopsis available for this title.',
    posterUrl: formatImageUrl(rawMovie.poster_path, 'w500'),
    backdropUrl: formatImageUrl(rawMovie.backdrop_path, 'w1280'),
    releaseDate: rawMovie.release_date || rawMovie.first_air_date || '',
    releaseYear: extractReleaseYear(rawMovie.release_date || rawMovie.first_air_date),
    rating: typeof rawMovie.vote_average === 'number' ? Math.round(rawMovie.vote_average * 10) / 10 : 0,
    voteCount: rawMovie.vote_count || 0,
    popularity: rawMovie.popularity || 0,
    genres,
  };
}

/**
 * Transform detailed movie record with credits, runtime, videos
 */
export function transformMovieDetails(rawMovie, credits = null, videos = null) {
  const base = transformMovieSummary(rawMovie);
  if (!base) return null;

  // Cast members (top 8)
  const cast = [];
  if (credits && Array.isArray(credits.cast)) {
    for (const member of credits.cast.slice(0, 10)) {
      cast.push({
        id: member.id,
        name: member.name,
        character: member.character,
        profileUrl: formatImageUrl(member.profile_path, 'w185'),
      });
    }
  }

  // Directors
  const directors = [];
  if (credits && Array.isArray(credits.crew)) {
    for (const member of credits.crew) {
      if (member.job === 'Director') {
        directors.push({
          id: member.id,
          name: member.name,
          profileUrl: formatImageUrl(member.profile_path, 'w185'),
        });
      }
    }
  }

  // Find official trailer (prefer YouTube)
  let trailer = null;
  if (videos && Array.isArray(videos.results)) {
    const youtubeVideos = videos.results.filter(
      (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );
    // Prefer official trailer
    const officialTrailer = youtubeVideos.find((v) => v.official && v.type === 'Trailer') || youtubeVideos[0];
    if (officialTrailer) {
      trailer = {
        key: officialTrailer.key,
        name: officialTrailer.name,
        site: officialTrailer.site,
        type: officialTrailer.type,
        url: `https://www.youtube.com/watch?v=${officialTrailer.key}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${officialTrailer.key}?autoplay=1&rel=0`,
      };
    }
  }

  return {
    ...base,
    tagline: rawMovie.tagline || '',
    runtime: rawMovie.runtime || null,
    status: rawMovie.status || 'Released',
    budget: rawMovie.budget || 0,
    revenue: rawMovie.revenue || 0,
    homepage: rawMovie.homepage || null,
    imdbId: rawMovie.imdb_id || null,
    cast,
    directors,
    trailer,
  };
}
