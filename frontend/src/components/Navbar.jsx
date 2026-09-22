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
    <header className="sticky top-0 z-40 bg-cinema-bg/85 backdrop-blur-md border-b border-cinema-border/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <button
            onClick={() => {
              setActiveTab('discover');
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
                Cine<span className="text-brand-400">Scope</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-medium uppercase">
                Discovery
              </span>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search movies, sagas, directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-cinema-card border border-cinema-border/70 rounded-full text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
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
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-cinema-surface/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-rose-500 text-white rounded-full leading-tight">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-cinema-surface/60 border border-cinema-border/40 text-[11px] text-slate-400">
            <span
              className={`w-2 h-2 rounded-full ${
                dataSource === 'live-tmdb' ? 'bg-emerald-400' : 'bg-amber-400'
              } animate-pulse`}
            />
            <span>{dataSource === 'live-tmdb' ? 'TMDB Online' : 'Offline Ready'}</span>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setActiveTab('wishlist')}
              className="p-2 relative rounded-lg text-slate-300 hover:text-white bg-cinema-surface"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-rose-400" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-cinema-surface"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile search bar */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-cinema-card border border-cinema-border rounded-full text-sm text-slate-200 focus:outline-none focus:border-brand-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-cinema-border space-y-1">
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
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-cinema-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-rose-500 text-white rounded-full">
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
