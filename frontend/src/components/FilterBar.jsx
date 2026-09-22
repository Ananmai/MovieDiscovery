import React from 'react';
import { Filter, ArrowUpDown, Calendar, Star, RotateCcw } from 'lucide-react';

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
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'primary_release_date.desc', label: 'Release Date (Newest)' },
    { value: 'primary_release_date.asc', label: 'Release Date (Oldest)' },
    { value: 'title.asc', label: 'Title (A-Z)' },
  ];

  const yearOptions = [
    { value: '', label: 'All Years' },
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
    { value: 8, label: '8.0+ Stars' },
    { value: 7, label: '7.0+ Stars' },
    { value: 6, label: '6.0+ Stars' },
  ];

  const hasActiveFilters = Boolean(
    selectedGenre ||
    selectedYear ||
    minRating > 0 ||
    sortBy !== 'popularity.desc'
  );

  return (
    <div className="bg-cinema-card/70 border border-cinema-border/60 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm space-y-4">
      
      {/* Top row: Dropdown controls and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Sort By */}
          <div className="relative">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cinema-surface rounded-xl border border-cinema-border text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => onSelectSort(e.target.value)}
                className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer pr-2"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-cinema-surface text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Year Filter */}
          <div className="relative">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cinema-surface rounded-xl border border-cinema-border text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-slate-400">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => onSelectYear(e.target.value)}
                className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer pr-2"
              >
                {yearOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-cinema-surface text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="relative">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cinema-surface rounded-xl border border-cinema-border text-xs text-slate-300">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Rating:</span>
              <select
                value={minRating}
                onChange={(e) => onSelectMinRating(Number(e.target.value))}
                className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer pr-2"
              >
                {ratingOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-cinema-surface text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Results count */}
        {typeof totalResults === 'number' && (
          <div className="text-xs text-slate-400">
            Found <span className="font-semibold text-slate-200">{totalResults}</span> titles
          </div>
        )}
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
        <button
          onClick={() => onSelectGenre('')}
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            !selectedGenre
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-cinema-surface hover:bg-cinema-surface/80 text-slate-300 border border-cinema-border/50'
          }`}
        >
          All Genres
        </button>
        {genres.map((g) => {
          const isSelected = String(selectedGenre) === String(g.id);
          return (
            <button
              key={g.id}
              onClick={() => onSelectGenre(isSelected ? '' : String(g.id))}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-cinema-surface hover:bg-cinema-surface/80 text-slate-300 border border-cinema-border/50'
              }`}
            >
              {g.name}
            </button>
          );
        })}
      </div>

    </div>
  );
}
