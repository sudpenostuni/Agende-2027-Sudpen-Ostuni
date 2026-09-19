import React, { useState, useRef, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';

interface CatalogSectionProps {
  models: AgendaModel[];
  compareItems: { id: string; agenda: AgendaModel; colore: ColorOption; qty: number }[];
  onAddToCompare: (agenda: AgendaModel, colore: ColorOption) => void;
  onOpenPriceManager?: () => void;
  onOpenPdfCropper?: () => void;
  availableCoverFiles?: string[];
  onGoToComparePage: () => void;
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
  onGoToComparePage
}) => {
  const [toastInfo, setToastInfo] = useState<{ text: string; waUrl?: string } | null>(null);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCardColors, setSelectedCardColors] = useState<Record<string, ColorOption>>({});
  const [savedForLaterIds, setSavedForLaterIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_for_later_agendas') || '[]');
    } catch {
      return [];
    }
  });

  // Riferimenti ai container di scroll per i caroselli
  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const animatedCarousels = useRef<Record<string, boolean>>({});

  // Resetta i caroselli già animati al cambio di tab o ricerca per consentire un nuovo suggerimento
  useEffect(() => {
    animatedCarousels.current = {};
  }, [selectedCategoryTab, searchQuery]);

  // Suggerimento visuale di scorrimento (Swipe Peek) su mobile quando l'elemento entra nello schermo
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!isMobile) return;

    const observers: IntersectionObserver[] = [];

    // Usiamo un piccolo timeout per attendere che gli elementi siano pronti e misurabili
    const initTimer = setTimeout(() => {
      Object.keys(carouselRefs.current).forEach((catId) => {
        const el = carouselRefs.current[catId];
        if (!el) return;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (el && el.scrollWidth > el.clientWidth && !animatedCarousels.current[catId]) {
                  animatedCarousels.current[catId] = true;

                  // Avvia l'effetto peek di scorrimento laterale
                  setTimeout(() => {
                    if (el) {
                      el.scrollTo({ left: 120, behavior: 'smooth' });
                      
                      setTimeout(() => {
                        if (el) {
                          el.scrollTo({ left: 0, behavior: 'smooth' });
                        }
                      }, 1000);
                    }
                  }, 200);
                }
                // Smettiamo di osservare una volta che l'animazione è stata avviata
                observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.5, // Si attiva quando almeno il 50% (la prima metà) del carosello è visibile
            rootMargin: '0px 0px -10px 0px'
          }
        );

        observer.observe(el);
        observers.push(observer);
      });
    }, 500);

    return () => {
      clearTimeout(initTimer);
      observers.forEach((obs) => obs.disconnect());
    };
  }, [selectedCategoryTab, searchQuery]);

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
      <div className="mb-8 space-y-4">
        {/* Ricerca e Filtro */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Menu a Tendina Scegli Formato */}
          <div className="flex flex-col gap-1.5 w-full sm:w-72">
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
                {/* Intestazione Formato con indicatore Swipe per mobile */}
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-3 rounded-xs bg-[#9e2a3b] inline-block" />
                      {category.titolo}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                      {category.sottotitolo}
                    </p>
                  </div>

                  {/* Frecce Desktop per scorrimento rapido */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => scrollCarousel(category.id, 'left')}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 transition cursor-pointer active:scale-95"
                      title="Scorri a sinistra"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCarousel(category.id, 'right')}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 transition cursor-pointer active:scale-95"
                      title="Scorri a destra"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contenitore Carosello Orizzontale Swipeable */}
                <div
                  ref={(el) => {
                    carouselRefs.current[category.id] = el;
                  }}
                  className="flex gap-5 overflow-x-auto snap-x snap-mandatory py-1 px-1 scroll-smooth"
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
                        className={`w-[295px] sm:w-[325px] md:w-[335px] shrink-0 snap-start bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between p-5 shadow-sm hover:shadow-lg relative ${
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
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
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

                          {/* 3. IMMAGINE PRODOTTO CON VARIANTI DINAMICHE */}
                          <div
                            onClick={() => onAddToCompare(agenda, activeColor)}
                            className="relative w-full h-56 bg-white hover:bg-slate-50/50 rounded-2xl flex items-center justify-center p-3 my-2 cursor-pointer group/img transition border border-slate-200/80 shadow-inner"
                            title="Clicca per aggiungere questo modello/colore al confronto"
                          >
                            <ProductImage
                              src={coverResult.url}
                              fallbackSrc={agenda.immagine}
                              alt={`${agenda.nome} - ${activeColor?.nome}`}
                              code={agenda.codice}
                              primaryColor={activeColor?.hex || agenda.colori?.[0]?.hex}
                            />
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

                          {/* 4. SOTTO L'IMMAGINE: DESCRIZIONE PRODOTTO */}
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 min-h-[34px] my-2">
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
