import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export function ErrorAlert({ message, onRetry }) {
  return (
    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
        <span className="text-sm font-medium">
          {message || 'Unable to connect to movie services. Please check your network or try again.'}
        </span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs font-semibold text-rose-100 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
