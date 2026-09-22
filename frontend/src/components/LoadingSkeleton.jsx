import React from 'react';

export function MovieGridSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-cinema-card rounded-xl overflow-hidden border border-cinema-border/40 flex flex-col"
        >
          {/* Poster placeholder */}
          <div className="aspect-poster w-full bg-cinema-surface/80" />
          
          {/* Text lines */}
          <div className="p-3.5 space-y-2.5">
            <div className="h-4 bg-cinema-surface rounded-md w-3/4" />
            <div className="h-3 bg-cinema-surface/60 rounded-md w-1/2" />
            <div className="h-3 bg-cinema-surface/40 rounded-md w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
