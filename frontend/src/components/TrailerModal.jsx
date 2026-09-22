import React, { useEffect } from 'react';
import { X, Film } from 'lucide-react';

export function TrailerModal({ trailer, title, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!trailer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-cinema-card rounded-2xl overflow-hidden shadow-2xl border border-cinema-border/80 z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-cinema-surface/80 border-b border-cinema-border/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-none truncate max-w-md">
                {title} — Official Trailer
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{trailer.name || 'HD Official Preview'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-cinema-card hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-cinema-border/50 transition-all"
            aria-label="Close trailer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          {trailer.embedUrl ? (
            <iframe
              src={trailer.embedUrl}
              title={`${title} Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <Film className="w-12 h-12 text-slate-600 mb-2" />
              <p className="text-sm">Trailer unavailable for this title.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
