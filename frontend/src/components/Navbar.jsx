import React, { useState } from 'react';
import { Film, Search, Heart, Flame, Sparkles, Star, X, Menu } from 'lucide-react';

export function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  wishlistCount,
  dataSource,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'discover', label: 'Discover', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'top_rated', label: 'Top Rated', icon: Star },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlistCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#07090e]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <button
            onClick={() => {
              setActiveTab('discover');
              setSearchQuery('');
            }}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-rose-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 group-hover:shadow-brand-500/40 transition-all duration-300">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-tight text-white block leading-none">
                Cine<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-rose-400">Scope</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest font-bold uppercase mt-1 block">
                Movie Universe
              </span>
            </div>
          </button>

          {/* Centered Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative group">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-brand-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
              <input
                type="text"
                placeholder="Search by title, genre, director, or cast..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 bg-cinema-card/80 border border-white/[0.08] rounded-2xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-cinema-card/70 border border-white/[0.06]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'wishlist') setSearchQuery('');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/30 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-black bg-rose-500 text-white rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status Indicator Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cinema-card/90 border border-white/[0.08] text-[11px] font-semibold text-slate-300 shadow-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                dataSource === 'live-tmdb' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-amber-400 shadow-amber-400/50'
              } shadow-md animate-pulse`}
            />
            <span>{dataSource === 'live-tmdb' ? 'TMDB Live' : 'Offline Mode'}</span>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setActiveTab('wishlist')}
              className="p-2.5 relative rounded-xl text-slate-300 hover:text-white glass-panel"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-rose-400" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-black bg-rose-500 text-white rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white glass-panel"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-cinema-card border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-brand-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/[0.08] space-y-1 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-rose-500 text-white rounded-full font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
