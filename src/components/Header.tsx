import React from 'react';

interface HeaderProps {
  activePage: 'catalog' | 'compare' | 'customize' | 'checkout';
  onGoToPage: (page: 'catalog' | 'compare' | 'customize' | 'checkout') => void;
  compareCount: number;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onGoToPage,
  compareCount,
  cartCount
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              onClick={() => onGoToPage('catalog')}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-xs p-1 cursor-pointer hover:border-slate-400 hover:scale-105 transition-all"
            >
              <img
                src="/sudpen-logo.png"
                alt="SUDPEN"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/sudpen-icon.png';
                }}
              />
            </div>
            
            <div className="cursor-pointer" onClick={() => onGoToPage('catalog')}>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  AGENDE <span className="text-[#9e2a3b]">SUDPEN</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  2027
                </span>
              </div>
            </div>
          </div>

          {/* 4-Step Page Navigator */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold">
            <button
              onClick={() => onGoToPage('catalog')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activePage === 'catalog'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
                activePage === 'catalog' ? 'bg-[#9e2a3b] text-white' : 'bg-slate-200 text-slate-600'
              }`}>1</span>
              <span>Catalogo</span>
            </button>

            <span className="text-slate-400 px-1">›</span>

            <button
              onClick={() => onGoToPage('compare')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activePage === 'compare'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
                activePage === 'compare' ? 'bg-[#9e2a3b] text-white' : 'bg-slate-200 text-slate-600'
              }`}>2</span>
              <span>Confronta</span>
              {compareCount > 0 && (
                <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                  {compareCount}
                </span>
              )}
            </button>

            <span className="text-slate-400 px-1">›</span>

            <button
              onClick={() => {
                if (cartCount > 0) onGoToPage('customize');
              }}
              disabled={cartCount === 0}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activePage === 'customize'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold cursor-pointer'
                  : cartCount === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-slate-500 hover:text-slate-900 cursor-pointer'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
                activePage === 'customize' ? 'bg-[#9e2a3b] text-white' : 'bg-slate-200 text-slate-600'
              }`}>3</span>
              <span>Personalizza</span>
              {cartCount > 0 && (
                <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <span className="text-slate-400 px-1">›</span>

            <button
              onClick={() => {
                if (cartCount > 0) onGoToPage('checkout');
              }}
              disabled={cartCount === 0}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activePage === 'checkout'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold cursor-pointer'
                  : cartCount === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-slate-500 hover:text-slate-900 cursor-pointer'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
                activePage === 'checkout' ? 'bg-[#9e2a3b] text-white' : 'bg-slate-200 text-slate-600'
              }`}>4</span>
              <span>Check Out</span>
            </button>
          </nav>

          {/* Right Tools & CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Quick Indicator */}
            {cartCount > 0 && activePage !== 'checkout' && (
              <button
                onClick={() => onGoToPage('compare')}
                className="flex items-center gap-1.5 bg-[#9e2a3b] hover:bg-[#86202f] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer shadow-xs"
              >
                <span>Carrello ({cartCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
