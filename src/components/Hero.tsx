import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick, onExploreCatalog }) => {
  return (
    <section className="relative overflow-hidden bg-card border-b border-app transition-colors">
      {/* Subtle decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-main tracking-tight leading-[1.15] mb-4">
            Crea la tua agenda <br className="hidden sm:inline" />
            <span className="text-accent-main">
              su misura per il tuo brand.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted leading-relaxed mb-6 max-w-2xl mx-auto">
            Scegli il modello ideale dal nostro catalogo interattivo, personalizza copertina, finiture e logo in tempo reale, e scarica subito la scheda tecnica d'ordine.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-0">
            <button
              onClick={onExploreCatalog}
              className="w-full sm:w-auto px-7 py-3 bg-accent-main hover:opacity-90 text-white rounded-xl font-bold shadow-md shadow-accent-main/20 transition active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <span>Esplora i 44 Modelli</span>
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={onStartClick}
              className="w-full sm:w-auto px-7 py-3 bg-surface-alt hover:bg-card text-main border border-app rounded-xl font-bold transition text-sm flex items-center justify-center gap-2"
            >
              <span>Configurazione & Scheda Ordine</span>
              <ArrowRight className="w-4 h-4 text-accent-main" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
