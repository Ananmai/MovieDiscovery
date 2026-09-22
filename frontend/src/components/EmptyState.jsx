import React from 'react';
import { Film, RotateCcw } from 'lucide-react';

export function EmptyState({
  title = 'No Movies Found',
  description = 'Try broadening your search, changing genres, or clearing your current filters.',
  onReset,
}) {
  return (
    <div className="py-20 px-4 text-center max-w-md mx-auto space-y-4">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-cinema-surface border border-cinema-border flex items-center justify-center">
        <Film className="w-8 h-8 text-slate-500" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cinema-surface hover:bg-cinema-surface/80 border border-cinema-border text-sm font-semibold text-slate-200 hover:text-white transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-brand-400" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
}
