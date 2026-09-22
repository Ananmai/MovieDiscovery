import React from 'react';
import { ArrowUpDown, Calendar, Star, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';

const GENRE_ICONS = {
  Action: '💥',
  Adventure: '🧭',
  Animation: '🎨',
  Comedy: '🍿',
  Crime: '🕵️',
  Documentary: '📽️',
  Drama: '🎭',
  Family: '🎈',
  Fantasy: '🧙',
  History: '📜',
  Horror: '😱',
  Music: '🎵',
  Mystery: '🔍',
  Romance: '💖',
  'Sci-Fi': '🚀',
  'TV Movie': '📺',
  Thriller: '⚡',
  War: '⚔️',
  Western: '🤠',
};

export function FilterBar({
  genres = [],
  selectedGenre,
  onSelectGenre,
  sortBy,
  onSelectSort,
  selectedYear,
  onSelectYear,
  minRating,
  onSelectMinRating,
  onResetFilters,
  totalResults,
}) {
  const sortOptions = [
    { value: 'popularity.desc', label: '🔥 Most Popular' },
    { value: 'vote_average.desc', label: '⭐ Highest Rated' },
    { value: 'primary_release_date.desc', label: '📅 Release Date (Newest)' },
    { value: 'primary_release_date.asc', label: '⏳ Release Date (Oldest)' },
    { value: 'title.asc', label: '🔤 Title (A-Z)' },
  ];

  const yearOptions = [
    { value: '', label: 'All Release Years' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2014', label: '2014' },
    { value: '2010', label: '2010' },
    { value: '2008', label: '2008' },
    { value: '1999', label: '1999' },
    { value: '1994', label: '1994' },
    { value: '1972', label: '1972' },
  ];

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 8, label: '⭐ 8.0+ Exceptional' },
    { value: 7, label: '⭐ 7.0+ Great' },
    { value: 6, label: '⭐ 6.0+ Good' },
  ];

  const hasActiveFilters = Boolean(
    selectedGenre ||
    selectedYear ||
    minRating > 0 ||
    sortBy !== 'popularity.desc'
  );

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-8 shadow-xl space-y-4">
      
      {/* Top Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider pr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-400" />
            <span>Filters</span>
          </div>

          {/* Sort By Select */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value)}
              className="px-3.5 py-2 bg-cinema-card/90 hover:bg-cinema-surface border border-cinema-border/70 hover:border-brand-500/50 rounded-xl text-xs text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer transition-all"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-cinema-card text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => onSelectYear(e.target.value)}
              className="px-3.5 py-2 bg-cinema-card/90 hover:bg-cinema-surface border border-cinema-border/70 hover:border-brand-500/50 rounded-xl text-xs text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer transition-all"
            >
              {yearOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-cinema-card text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="relative">
            <select
              value={minRating}
              onChange={(e) => onSelectMinRating(Number(e.target.value))}
              className="px-3.5 py-2 bg-cinema-card/90 hover:bg-cinema-surface border border-cinema-border/70 hover:border-brand-500/50 rounded-xl text-xs text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer transition-all"
            >
              {ratingOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-cinema-card text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Results Counter */}
        {typeof totalResults === 'number' && (
          <div className="text-xs font-medium text-slate-400">
            <span className="font-bold text-white text-sm">{totalResults}</span> films available
          </div>
        )}
      </div>

      {/* Genre Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1 scrollbar-thin">
        <button
          onClick={() => onSelectGenre('')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            !selectedGenre
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/30 border border-brand-400/40'
              : 'bg-cinema-card/80 hover:bg-cinema-surface text-slate-300 border border-cinema-border/60 hover:border-slate-600'
          }`}
        >
          <span>🎬</span>
          <span>All Genres</span>
          {!selectedGenre && <Check className="w-3 h-3 text-brand-200 ml-0.5" />}
        </button>

        {genres.map((g) => {
          const isSelected = String(selectedGenre) === String(g.id);
          const icon = GENRE_ICONS[g.name] || '🎞️';
          return (
            <button
              key={g.id}
              onClick={() => onSelectGenre(isSelected ? '' : String(g.id))}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/30 border border-brand-400/40 scale-105'
                  : 'bg-cinema-card/80 hover:bg-cinema-surface text-slate-300 border border-cinema-border/60 hover:border-slate-600'
              }`}
            >
              <span>{icon}</span>
              <span>{g.name}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
