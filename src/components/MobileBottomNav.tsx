import React from 'react';
import { BookOpen, Scale, Sparkles, ShoppingBag } from 'lucide-react';

interface MobileBottomNavProps {
  activePage: 'catalog' | 'compare' | 'customize' | 'checkout';
  onGoToPage: (page: 'catalog' | 'compare' | 'customize' | 'checkout') => void;
  compareCount: number;
  cartCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePage,
  onGoToPage,
  compareCount,
  cartCount
}) => {
  const navItems = [
    {
      id: 'catalog' as const,
      label: 'Catalogo',
      icon: BookOpen,
      badge: null,
      disabled: false
    },
    {
      id: 'compare' as const,
      label: 'Confronta',
      icon: Scale,
      badge: compareCount > 0 ? compareCount : null,
      disabled: false
    },
    {
      id: 'customize' as const,
      label: 'Personalizza',
      icon: Sparkles,
      badge: cartCount > 0 ? cartCount : null,
      disabled: cartCount === 0
    },
    {
      id: 'checkout' as const,
      label: 'Preventivo',
      icon: ShoppingBag,
      badge: null,
      disabled: cartCount === 0
    }
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-around safe-area-pb"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        return (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            onClick={() => onGoToPage(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative cursor-pointer active:scale-90 ${
              isActive
                ? 'text-[#9e2a3b] font-black'
                : item.disabled
                ? 'text-slate-300 opacity-40 cursor-not-allowed'
                : 'text-slate-500 hover:text-slate-800 font-semibold'
            }`}
          >
            <div className="relative">
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-[#9e2a3b]/10 text-[#9e2a3b]' : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              {item.badge !== null && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-mono font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border-2 border-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#9e2a3b] mt-0.5 animate-in zoom-in duration-200" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
