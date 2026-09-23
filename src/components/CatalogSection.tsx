import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AgendaModel, ColorOption } from '../types';
import html2canvas from 'html2canvas-pro';
import { CATEGORIE_ORGANIZZATE, OrganizedCategory, getAgendaHeaderDisplay } from '../data/catalog';
import { resolveAgendaCoverImage } from '../utils/colorUtils';
import {
  SlidersHorizontal,
  Scissors,
  MessageCircle,
  Camera,
  Sparkles,
  Loader2,
  Search,
  X,
  Layers,
  Palette,
  Heart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ZoomIn,
  ArrowRight
} from 'lucide-react';

interface CatalogSectionProps {
  models: AgendaModel[];
  compareItems: { id: string; agenda: AgendaModel; colore: ColorOption; qty: number }[];
  onAddToCompare: (agenda: AgendaModel, colore: ColorOption) => void;
  onOpenPriceManager?: () => void;
  onOpenPdfCropper?: () => void;
  availableCoverFiles?: string[];
  onGoToComparePage: () => void;
  onOpenCatalogPage?: (agenda: AgendaModel, colore?: ColorOption) => void;
}

const SUDPEN_WHATSAPP = '393917972545';

// Componente dedicato per il rendering ad alta fedeltà dell'immagine con fallback resiliente
const ProductImage: React.FC<{
  src?: string;
  fallbackSrc?: string;
  alt: string;
  code: string;
  primaryColor?: string;
}> = ({ src, fallbackSrc, alt, code, primaryColor }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    // If a variant image 404s, seamlessly fallback to base model image
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  if (hasError || !currentSrc) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-3 select-none">
        <div 
          className="w-28 h-40 rounded-xl shadow-lg border border-black/15 flex flex-col items-center justify-between p-3 text-white transition-transform duration-300 group-hover/img:scale-105"
          style={{ backgroundColor: primaryColor || '#1e293b' }}
        >
          <div className="text-[10px] tracking-widest font-black uppercase text-amber-300 opacity-90 drop-shadow-xs">
            2027
          </div>
          <div className="text-center">
            <span className="font-mono text-xs font-bold bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs block">
              {code}
            </span>
          </div>
          <div className="text-[9px] tracking-wider uppercase font-semibold text-white/80">
            SUDPEN
          </div>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 mt-2">
          Anteprima Modello
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-[#9e2a3b]/20 border-t-[#9e2a3b] rounded-full animate-spin" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        className={`max-h-full max-w-full object-contain drop-shadow-md transition-all duration-300 group-hover/img:scale-105 ${
          isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      />
    </div>
  );
};

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  models,
  compareItems,
  onAddToCompare,
  onOpenPriceManager,
  onOpenPdfCropper,
  availableCoverFiles = [],
  onGoToComparePage,
  onOpenCatalogPage
}) => {
  const [toastInfo, setToastInfo] = useState<{ text: string; waUrl?: string } | null>(null);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCardColors, setSelectedCardColors] = useState<Record<string, ColorOption>>({});
  const [carouselActiveIndices, setCarouselActiveIndices] = useState<Record<string, number>>({});
  const [savedForLaterIds, setSavedForLaterIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_for_later_agendas') || '[]');
    } catch {
      return [];
    }
  });

  // Handle mobile swipe tracking for carousel dots
  const handleCarouselScroll = (categoryId: string, e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const cardWidth = target.firstElementChild ? (target.firstElementChild as HTMLElement).offsetWidth + 20 : 300;
    const scrollLeft = target.scrollLeft;
    const activeIdx = Math.round(scrollLeft / cardWidth);
    setCarouselActiveIndices(prev => {
      if (prev[categoryId] === activeIdx) return prev;
      return { ...prev, [categoryId]: activeIdx };
    });
  };

  // Helper to cycle colors via swipe on mobile
  const cycleAgendaColor = (agendaId: string, colors: ColorOption[], direction: 'next' | 'prev') => {
    if (!colors || colors.length <= 1) return;
    const currentColor = selectedCardColors[agendaId] || colors[0];
    const currentIndex = colors.findIndex(c => c.nome === currentColor.nome);
    let nextIndex = 0;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % colors.length;
    } else {
      nextIndex = (currentIndex - 1 + colors.length) % colors.length;
    }
    setSelectedCardColors(prev => ({ ...prev, [agendaId]: colors[nextIndex] }));
  };

  // Riferimenti ai container di scroll per i caroselli
  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Indicatore Swipe dopo 2 secondi di inattività
  const [showSwipeHint, setShowSwipeHint] = useState<boolean>(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    setShowSwipeHint(false);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      setShowSwipeHint(true);
    }, 2000);
  }, []);

  useEffect(() => {
    resetInactivityTimer();

    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    window.addEventListener('touchmove', handleUserActivity, { passive: true });
    window.addEventListener('scroll', handleUserActivity, { passive: true });
    window.addEventListener('mousedown', handleUserActivity, { passive: true });
    window.addEventListener('pointerdown', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('touchmove', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('pointerdown', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [resetInactivityTimer]);

  const showToast = (text: string, waUrl?: string) => {
    setToastInfo({ text, waUrl });
    setTimeout(() => {
      setToastInfo(null);
    }, 7000);
  };

  const toggleSaveForLater = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedForLaterIds(prev => {
      const updated = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('saved_for_later_agendas', JSON.stringify(updated));
      return updated;
    });
  };

  const scrollCarousel = (categoryId: string, direction: 'left' | 'right') => {
    const el = carouselRefs.current[categoryId];
    if (el) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getFormattedPrice = (agenda: AgendaModel): string => {
    return (agenda.prezzoBaseUnitario * 1.22).toFixed(2).replace('.', ',');
  };

  // Costruzione delle categorie carosello da visualizzare
  // Mappa i modelli attuali (che contengono eventuali modifiche del listino prezzi)
  const modelsMap = new Map<string, AgendaModel>();
  models.forEach((m) => {
    modelsMap.set(m.codice, m);
    modelsMap.set(m.id, m);
  });

  // Crea i gruppi per ciascuna categoria organizzata
  const displayedCategories = CATEGORIE_ORGANIZZATE.map((cat) => {
    // Risolvi i modelli con i dati aggiornati dallo stato `models`
    const resolvedModels = cat.modelli.map((m) => {
      const fromCurrent = modelsMap.get(m.codice) || modelsMap.get(m.id);
      if (fromCurrent) {
        return {
          ...m,
          ...fromCurrent,
          // Allinea il prezzo Iva inclusa dinamicamente in base a quello base unitario impostato manualmente
          prezzoIvaInclusa: Number((fromCurrent.prezzoBaseUnitario * 1.22).toFixed(2))
        };
      }
      return null;
    }).filter(Boolean) as AgendaModel[];

    return {
      category: cat,
      models: resolvedModels
    };
  }).filter((group) => group.models.length > 0);

  // Raccogli anche i restanti modelli (altre linee che l'utente sta imputando manualmente)
  const organizedCodes = new Set(
    CATEGORIE_ORGANIZZATE.flatMap((c) => c.modelli.map((m) => m.codice))
  );

  const remainingModels = models.filter((m) => !organizedCodes.has(m.codice));

  const allSections: {
    category: OrganizedCategory;
    models: AgendaModel[];
  }[] = [
    ...displayedCategories,
    ...(remainingModels.length > 0
      ? [
          {
            category: {
              id: 'cat-altre-linee',
              titolo: 'Altri Formati & Planning',
              sottotitolo: 'Altri modelli a catalogo (in fase di inserimento manuale). Già consultabili e ordinabili.',
              formatoLabel: 'Vari Formati',
              tipoLayout: 'Altro' as const,
              modelli: remainingModels
            },
            models: remainingModels
          }
        ]
      : [])
  ];

  // Filtro ricerca e filtro tab categoria
  const q = searchQuery.trim().toLowerCase();

  const filteredSections = allSections
    .filter((sec) => {
      if (selectedCategoryTab !== 'all' && sec.category.id !== selectedCategoryTab) {
        return false;
      }
      return true;
    })
    .map((sec) => {
      if (!q) return sec;
      const matchingModels = sec.models.filter(
        (m) =>
          m.nome.toLowerCase().includes(q) ||
          m.codice.toLowerCase().includes(q) ||
          m.formato.toLowerCase().includes(q) ||
          (m.sottotitolo && m.sottotitolo.toLowerCase().includes(q)) ||
          (m.categoria && m.categoria.toLowerCase().includes(q)) ||
          m.colori.some((c) => c.nome.toLowerCase().includes(q))
      );
      return {
        ...sec,
        models: matchingModels
      };
    })
    .filter((sec) => sec.models.length > 0);

  const totalShownModels = filteredSections.reduce((acc, sec) => acc + sec.models.length, 0);

  const handleSelectMobileCategory = (catId: string) => {
    setSelectedCategoryTab(catId);
    if (catId !== 'all') {
      const targetEl = document.getElementById(`categoria-${catId}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="catalogo" className="py-10 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">

      {compareItems.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-black animate-bounce shadow">
              {compareItems.length}
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Agende selezionate per il confronto!</h4>
              <p className="text-xs text-slate-500">Hai aggiunto {compareItems.length} {compareItems.length === 1 ? "modello" : "modelli"} alle tue selezioni. Ora procedi per definire quantità e carrello.</p>
            </div>
          </div>
          <button
            onClick={onGoToComparePage}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Procedi al Confronto →</span>
          </button>
        </div>
      )}

      {/* Navigazione Rapida Formati & Ricerca */}
      <div className="mb-6 space-y-3">
        {/* Ricerca e Filtro Desktop Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Menu a Tendina Scegli Formato (Desktop) */}
          <div className="hidden sm:flex flex-col gap-1.5 w-full sm:w-72">
            <label htmlFor="select-formato" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Scegli formato
            </label>
            <div className="relative">
              <select
                id="select-formato"
                value={selectedCategoryTab}
                onChange={(e) => setSelectedCategoryTab(e.target.value)}
                className="w-full h-10 pl-3.5 pr-10 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#9e2a3b]/10 focus:border-[#9e2a3b] cursor-pointer transition appearance-none"
              >
                <option value="all">Tutti i Formati ({models.length})</option>
                {CATEGORIE_ORGANIZZATE.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.formatoLabel} • {cat.tipoLayout} ({cat.modelli.length})
                  </option>
                ))}
                {remainingModels.length > 0 && (
                  <option value="cat-altre-linee">
                    Altre Linee ({remainingModels.length})
                  </option>
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {searchQuery && (
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>
              Trovati <strong>{totalShownModels}</strong> modelli per <em>"{searchQuery}"</em>
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#9e2a3b] font-bold hover:underline"
            >
              Azzera ricerca
            </button>
          </div>
        )}
      </div>

      {/* Caroselli Categorie */}
      {filteredSections.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-8">
          <p className="text-slate-500 text-sm">Nessun modello trovato per "{searchQuery}".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoryTab('all');
            }}
            className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Mostra tutti i modelli
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {filteredSections.map(({ category, models: catModels }) => {
            return (
              <div
                key={category.id}
                id={`categoria-${category.id}`}
                className="relative bg-white/70 backdrop-blur-xs rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs transition animate-in fade-in duration-300"
              >
                {/* Intestazione di Categoria / Formato Riorganizzata in modo Evidente */}
                <div className="mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-3.5 sm:p-4.5 shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
                  {/* Barra d'accento laterale bordeaux */}
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#9e2a3b]" />
                  
                  <div className="flex items-center gap-3 pl-1.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-amber-400 shrink-0 font-mono font-black text-xs shadow-xs">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-mono">
                          Categoria Formato
                        </span>
                        <span className="bg-white/15 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                          {catModels.length} {catModels.length === 1 ? 'modello' : 'modelli'}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                        {category.titolo}
                      </h3>
                    </div>
                  </div>

                  {/* Frecce Desktop per scorrimento rapido */}
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollCarousel(category.id, 'left')}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition cursor-pointer active:scale-95 shadow-xs"
                      title="Scorri a sinistra"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCarousel(category.id, 'right')}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition cursor-pointer active:scale-95 shadow-xs"
                      title="Scorri a destra"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Etichetta di suggerimento Swipe + Freccia a destra dopo 2 secondi di inattività */}
                {showSwipeHint && catModels.length > 1 && (
                  <div className="sm:hidden absolute top-20 right-5 z-20 pointer-events-none animate-in fade-in slide-in-from-right-3 duration-300">
                    <div className="flex items-center gap-1.5 bg-[#9e2a3b] text-white px-3 py-1.5 rounded-full shadow-lg border border-white/25 text-xs font-black tracking-wide uppercase">
                      <span>Swipe</span>
                      <ArrowRight className="w-4 h-4 text-amber-300 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Contenitore Carosello Orizzontale Swipeable */}
                <div
                  ref={(el) => {
                    carouselRefs.current[category.id] = el;
                  }}
                  onScroll={(e) => handleCarouselScroll(category.id, e)}
                  className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory py-2 px-1 scroll-smooth"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 transparent'
                  }}
                >
                  {catModels.map((agenda) => {
                    const visibleColors = agenda.colori;

                    // Active preview color for this card
                    const activeColor = selectedCardColors[agenda.id] || agenda.colori[0];
                    const isSelected = compareItems.some(item => item.agenda.id === agenda.id);
                    const isAddedThisColor = compareItems.some(
                      item => item.agenda.id === agenda.id && item.colore.nome === activeColor.nome
                    );

                    const coverResult = resolveAgendaCoverImage(agenda, activeColor, availableCoverFiles);

                    // Prezzo formattato (IVA inclusa)
                    const prezzoDisplay = getFormattedPrice(agenda);
                    // Intestazione formattata secondo le specifiche richieste:
                    // Riga 1: Agendina/Agenda [Tipo] [Nome Linea] (senza codice)
                    // Riga 2: cm [Formato] - cod [Codice]    € [Prezzo] iva incl.
                    const headerInfo = getAgendaHeaderDisplay(agenda);

                    return (
                      <div
                        id={`card-model-${agenda.id}`}
                        key={agenda.id}
                        className={`w-[84vw] max-w-[320px] sm:w-[325px] md:w-[335px] shrink-0 snap-center sm:snap-start bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between p-4 sm:p-5 shadow-sm hover:shadow-lg relative ${
                          isAddedThisColor
                            ? 'border-[#9e2a3b] ring-2 ring-[#9e2a3b]/20 shadow-md'
                            : isSelected
                            ? 'border-slate-400'
                            : 'border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          {/* 1. IN CIMA: NOME PRODOTTO RIFORMATTATO SENZA CODICE + MISURA, CODICE E PREZZO */}
                          <div className="mb-3 border-b border-slate-100 pb-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <h4
                                className="font-extrabold text-slate-900 text-[15px] sm:text-base tracking-tight leading-snug flex-1"
                                title={headerInfo.titolo}
                              >
                                {headerInfo.titolo}
                              </h4>
                              <button
                                type="button"
                                onClick={(e) => toggleSaveForLater(agenda.id, e)}
                                className={`p-1 rounded-lg transition-all active:scale-90 cursor-pointer shrink-0 ${
                                  savedForLaterIds.includes(agenda.id)
                                    ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                                    : 'text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-100'
                                }`}
                                title={savedForLaterIds.includes(agenda.id) ? "Rimuovi da Seleziona per dopo" : "Seleziona per dopo"}
                              >
                                <Heart className={`w-3.5 h-3.5 transition-colors ${savedForLaterIds.includes(agenda.id) ? 'fill-rose-600' : ''}`} />
                              </button>
                            </div>

                            {/* Riga 2: cm [Formato] - cod [Codice]    € [Prezzo] iva incl. */}
                            <div className="flex items-baseline justify-between gap-2 mt-1.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-semibold text-slate-600 font-mono tracking-tight">
                                  {headerInfo.misuraCodice}
                                </span>
                                {typeof agenda.giacenza === 'number' && (
                                  <span className={`hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                    agenda.giacenza === 0
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : agenda.giacenza <= 10
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-slate-50 text-slate-600 border-slate-200'
                                  }`}>
                                    {agenda.giacenza === 0 ? 'Giacenza 0' : `Giac. ${agenda.giacenza} pz`}
                                  </span>
                                )}
                              </div>

                              {/* Prezzo iva incl. */}
                              <div className="text-right whitespace-nowrap">
                                <span className="text-base font-black text-slate-900">
                                  € {prezzoDisplay}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                                  iva incl.
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 2. COLORI DISPONIBILI (INTERATTIVI CON ANTEPRIMA DINAMICA) */}
                          <div className="mb-2.5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {visibleColors.map((col, idx) => {
                                const isActive = activeColor?.nome === col.nome;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    title={`${col.nome} (clicca per visualizzare l'anteprima colore)`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedCardColors(prev => ({ ...prev, [agenda.id]: col }));
                                    }}
                                    className={`w-4 h-3.5 rounded-xs border transition-all cursor-pointer ${
                                      isActive
                                        ? 'border-slate-950 ring-2 ring-slate-950/30 scale-125 z-10'
                                        : 'border-slate-300 hover:scale-115 opacity-80 hover:opacity-100'
                                    }`}
                                    style={{ backgroundColor: col.hex }}
                                  />
                                );
                              })}
                            </div>
                            {activeColor && (
                              <span className="text-[10px] font-semibold text-slate-600 truncate max-w-[120px] text-right" title={activeColor.nome}>
                                {activeColor.nome}
                              </span>
                            )}
                          </div>

                          {/* 3. IMMAGINE PRODOTTO CON APPROFONDIMENTO PAGINA CATALOGO PDF */}
                          <div
                            id={`agenda-img-${agenda.id}`}
                            onClick={() => {
                              if (onOpenCatalogPage) {
                                onOpenCatalogPage(agenda, activeColor);
                              } else {
                                onAddToCompare(agenda, activeColor);
                              }
                            }}
                            className="relative w-full h-56 bg-white hover:bg-slate-50/70 rounded-2xl flex items-center justify-center p-3 my-2 cursor-pointer group/img transition border border-slate-200/80 hover:border-amber-400/60 shadow-inner"
                            title="Clicca per aprire l'approfondimento della pagina catalogo PDF relativa a quest'agenda"
                          >
                            <ProductImage
                              src={coverResult.url}
                              fallbackSrc={agenda.immagine}
                              alt={`${agenda.nome} - ${activeColor?.nome}`}
                              code={agenda.codice}
                              primaryColor={activeColor?.hex || agenda.colori?.[0]?.hex}
                            />

                            {/* Icona Zoom per visualizzazione pagina PDF */}
                            <div 
                              className="absolute bottom-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/95 backdrop-blur-xs text-slate-700 border border-slate-200/90 shadow-xs flex items-center justify-center transition-all group-hover/img:scale-110 group-hover/img:text-[#9e2a3b] pointer-events-none"
                              title="Ingrandisci pagina catalogo PDF"
                            >
                              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700 group-hover/img:text-[#9e2a3b]" />
                            </div>

                            {agenda.statoDisponibilita === 'esaurito' ? (
                              <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                                Esaurito
                              </span>
                            ) : agenda.statoDisponibilita === 'in_esaurimento' ? (
                              <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                                In esaurimento
                              </span>
                            ) : null}
                            {isAddedThisColor && (
                              <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                Selezionata
                              </span>
                            )}
                          </div>

                          {/* 4. SOTTO L'IMMAGINE: DESCRIZIONE PRODOTTO (visibile su desktop) */}
                          <p className="hidden sm:block text-xs text-slate-600 leading-relaxed line-clamp-2 min-h-[34px] my-2">
                            {agenda.sottotitolo || `Agenda personalizzabile formato ${agenda.dimensioniCm}, copertina in ${agenda.copertina}, carta pregiata.`}
                          </p>
                        </div>

                        {/* 5. IN FONDO: TASTO "AGGIUNGI AL CONFRONTO" */}
                        <div className="pt-2 mt-auto">
                          <button
                            type="button"
                            onClick={() => onAddToCompare(agenda, activeColor)}
                            className={`w-full h-9 py-1.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 ${
                              isAddedThisColor
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-[#9e2a3b] hover:bg-[#86202f] text-white'
                            }`}
                            title="Aggiungi alla lista di confronto per scegliere quantità e personalizzazione"
                          >
                            <Palette className="w-3.5 h-3.5 text-white" />
                            <span>{isAddedThisColor ? '✓ Selezionata (Aggiungi ancora)' : 'Seleziona per Confronto'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MOBILE: Barra di selezione rapida formati posizionata sul fondo (sopra la barra di navigazione) */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar snap-x scroll-smooth px-1">
          <button
            type="button"
            onClick={() => handleSelectMobileCategory('all')}
            className={`snap-start px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              selectedCategoryTab === 'all'
                ? 'bg-[#9e2a3b] text-white shadow-xs scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tutti ({models.length})
          </button>
          {CATEGORIE_ORGANIZZATE.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectMobileCategory(cat.id)}
              className={`snap-start px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                selectedCategoryTab === cat.id
                  ? 'bg-[#9e2a3b] text-white shadow-xs scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{cat.formatoLabel}</span>
              <span className="text-[9px] opacity-75 font-mono">({cat.modelli.length})</span>
            </button>
          ))}
          {remainingModels.length > 0 && (
            <button
              type="button"
              onClick={() => handleSelectMobileCategory('cat-altre-linee')}
              className={`snap-start px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                selectedCategoryTab === 'cat-altre-linee'
                  ? 'bg-[#9e2a3b] text-white shadow-xs scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Altre Linee</span>
              <span className="text-[9px] opacity-75 font-mono">({remainingModels.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Banner Toast Flottante Notifiche Screenshot / WhatsApp */}
      {toastInfo && (
        <div className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md z-50 bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-md border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs font-semibold leading-tight text-slate-200">{toastInfo.text}</p>
          </div>
          {toastInfo.waUrl && (
            <a
              href={toastInfo.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Apri WhatsApp</span>
            </a>
          )}
        </div>
      )}
    </section>
  );
};
