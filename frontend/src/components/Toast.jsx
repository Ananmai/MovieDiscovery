import React from 'react';
import { Heart, X, CheckCircle2 } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isAdd = toast.type === 'add';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className="flex items-center gap-3.5 p-3 pr-4 rounded-2xl bg-white shadow-2xl border border-slate-200 max-w-sm">
        {/* Movie poster thumbnail if provided */}
        {toast.posterUrl ? (
          <img
            src={toast.posterUrl}
            alt={toast.title}
            className="w-10 h-14 rounded-lg object-cover shadow-sm shrink-0 border border-slate-200"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isAdd ? 'bg-rose-50 text-rose-500 border border-rose-200' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${isAdd ? 'fill-rose-500 text-rose-500' : ''}`} />
          </div>
        )}

        {/* Message */}
        <div className="overflow-hidden">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isAdd ? 'Added to Wishlist' : 'Removed from Wishlist'}</span>
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5 max-w-[200px]">
            {toast.title}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="ml-auto text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
