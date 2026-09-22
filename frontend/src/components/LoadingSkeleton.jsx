import React from 'react';

export function MovieGridSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col"
        >
          {/* Poster placeholder */}
          <div className="aspect-poster w-full bg-slate-100" />
          
          {/* Text lines */}
          <div className="p-4 space-y-2.5">
            <div className="h-4 bg-slate-200 rounded-md w-3/4" />
            <div className="h-3 bg-slate-100 rounded-md w-1/2" />
            <div className="h-3 bg-slate-100 rounded-md w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
