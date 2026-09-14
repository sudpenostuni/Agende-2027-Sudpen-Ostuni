import React from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { BookOpen, Sparkles, Scissors, SlidersHorizontal, ArrowRight, Lock } from 'lucide-react';

interface HeaderProps {
  activePage: 'catalog' | 'compare' | 'customize' | 'checkout';
  onGoToPage: (page: 'catalog' | 'compare' | 'customize' | 'checkout') => void;
  onOpenPriceManager?: () => void;
  onOpenPdfCropper?: () => void;
  compareCount: number;
  cartCount: number;
  googleUser: FirebaseUser | null;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onGoToPage,
  onOpenPriceManager,
  onOpenPdfCropper,
  compareCount,
  cartCount,
  googleUser,
  onOpenAuthModal
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-3">
          {/* Brand Logo & Auth Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              onClick={onOpenAuthModal}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-xs p-1 cursor-pointer hover:border-slate-400 hover:scale-105 transition-all relative group"
              title={googleUser ? `Area Riservata: ${googleUser.displayName} (Clicca per scollegare)` : "Accedi con Google"}
            >
              <img
                src="/sudpen-logo.png"
                alt="SUDPEN"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to icon if logo has issue
                  (e.currentTarget as HTMLImageElement).src = '/sudpen-icon.png';
                }}
              />
              {/* Status Dot badge */}
              <div className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold shadow-xs ${
                googleUser ? 'bg-emerald-500' : 'bg-amber-500'
              }`}>
                {googleUser ? '✓' : '🔑'}
              </div>
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
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
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
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                  : cartCount === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-slate-500 hover:text-slate-900'
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
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                  : cartCount === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-slate-500 hover:text-slate-900'
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
            {/* Quick Tools */}
            {onOpenPdfCropper && (
              <button
                onClick={googleUser ? onOpenPdfCropper : onOpenAuthModal}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
                  googleUser 
                    ? 'text-[#9e2a3b] bg-[#faebed] border border-[#f5c2c7] hover:opacity-90' 
                    : 'text-slate-400 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-600'
                }`}
                title="Scontorna e ritaglia immagini dal PDF (Richiede Accesso)"
              >
                {googleUser ? (
                  <Scissors className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span className="hidden xl:inline font-bold">Ritaglio PDF</span>
                {googleUser && (
                  <span className="bg-[#9e2a3b] text-white text-[9px] px-1 rounded font-mono">44/44</span>
                )}
              </button>
            )}

            {onOpenPriceManager && (
              <button
                onClick={googleUser ? onOpenPriceManager : onOpenAuthModal}
                className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
                  googleUser 
                    ? 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-950 shadow-3xs' 
                    : 'text-slate-400 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-600'
                }`}
                title="Modifica prezzi e disponibilità (Richiede Accesso)"
              >
                {googleUser ? (
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span className="font-bold">Listino</span>
              </button>
            )}

            {/* Cart Quick Indicator */}
            {cartCount > 0 && activePage !== 'checkout' && (
              <button
                onClick={() => onGoToPage('compare')}
                className="flex items-center gap-1.5 bg-[#9e2a3b] hover:bg-[#86202f] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95"
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
