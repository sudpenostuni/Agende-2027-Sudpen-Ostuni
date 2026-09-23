import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Download,
  Palette,
  Check,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { AgendaModel, ColorOption } from '../types';
import {
  TOTAL_PAGES,
  getPageImage,
  getModelsForPage,
  getCatalogPageForModel,
  ModelCatalogInfo
} from '../data/catalogPagesMap';

interface CatalogPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAgenda?: AgendaModel | null;
  initialColor?: ColorOption | null;
  allModels?: AgendaModel[];
  onAddToCompare?: (agenda: AgendaModel, color: ColorOption) => void;
  isAddedToCompare?: boolean;
}

export const CatalogPageModal: React.FC<CatalogPageModalProps> = ({
  isOpen,
  onClose,
  initialAgenda,
  initialColor,
  allModels = [],
  onAddToCompare,
  isAddedToCompare = false
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaModel | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // When opened or initialAgenda changes, resolve page
  useEffect(() => {
    if (isOpen && initialAgenda) {
      setSelectedAgenda(initialAgenda);
      setSelectedColor(initialColor || initialAgenda.colori?.[0] || null);
      const page = getCatalogPageForModel(initialAgenda.codice);
      setCurrentPage(page);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [isOpen, initialAgenda, initialColor]);

  // Reset zoom & pan when page changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setImageLoaded(false);
  }, [currentPage]);

  // Handle keyboard events (ESC, arrows)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentPage(p => (p > 1 ? p - 1 : TOTAL_PAGES));
      } else if (e.key === 'ArrowRight') {
        setCurrentPage(p => (p < TOTAL_PAGES ? p + 1 : 1));
      } else if (e.key === '+' || e.key === '=') {
        setZoom(z => Math.min(z + 0.25, 3));
      } else if (e.key === '-') {
        setZoom(z => {
          const newZ = Math.max(z - 0.25, 1);
          if (newZ === 1) setPan({ x: 0, y: 0 });
          return newZ;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom(z => Math.min(z + 0.35, 3));
  };

  const handleZoomOut = () => {
    setZoom(z => {
      const newZ = Math.max(z - 0.35, 1);
      if (newZ === 1) setPan({ x: 0, y: 0 });
      return newZ;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleDoubleClick = () => {
    if (zoom > 1) {
      handleResetZoom();
    } else {
      setZoom(2);
    }
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan & swipe handlers (optimised for mobile total swipe)
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const [swipeOffset, setSwipeOffset] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX - pan.x,
        y: touch.clientY - pan.y,
        time: Date.now()
      };

      if (zoom > 1) {
        setIsDragging(true);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];

    if (isDragging && zoom > 1) {
      setPan({
        x: touch.clientX - touchStartRef.current.x,
        y: touch.clientY - touchStartRef.current.y
      });
    } else if (zoom <= 1) {
      // Provide subtle swipe feedback when swiping horizontally on mobile
      const currentX = touch.clientX;
      const initialStartX = touchStartRef.current.x;
      const deltaX = currentX - initialStartX;
      if (Math.abs(deltaX) > 10) {
        setSwipeOffset(deltaX * 0.3); // dampened preview
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (zoom > 1) {
      setIsDragging(false);
    } else {
      // Evaluate swipe gesture for mobile total swipe
      const touch = e.changedTouches[0];
      if (touch) {
        const deltaX = (touch.clientX - touchStartRef.current.x);
        const deltaY = (touch.clientY - touchStartRef.current.y);
        const elapsed = Date.now() - touchStartRef.current.time;

        // Reset visual swipe offset
        setSwipeOffset(0);

        // Horizontal swipe threshold: > 45px in < 600ms and horizontal > vertical
        if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) && elapsed < 650) {
          if (deltaX < 0) {
            // Swipe Left -> Next Page
            setCurrentPage(p => (p < TOTAL_PAGES ? p + 1 : 1));
          } else {
            // Swipe Right -> Prev Page
            setCurrentPage(p => (p > 1 ? p - 1 : TOTAL_PAGES));
          }
        } else if (deltaY > 100 && Math.abs(deltaY) > Math.abs(deltaX) * 1.5 && elapsed < 500) {
          // Swipe Down on mobile -> Dismiss Modal
          onClose();
        }
      }
    }
  };

  if (!isOpen) return null;

  const currentModelsOnPage: ModelCatalogInfo[] = getModelsForPage(currentPage);
  const pageImageUrl = getPageImage(currentPage);

  // Helper to switch selected model when clicking page model chips
  const handleSelectModelFromPage = (modelInfo: ModelCatalogInfo) => {
    const fullModel = allModels.find(m => m.codice === modelInfo.code);
    if (fullModel) {
      setSelectedAgenda(fullModel);
      setSelectedColor(fullModel.colori?.[0] || null);
    }
  };

  return (
    <div
      id="catalog-page-modal"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col font-sans select-none overflow-hidden animate-in fade-in duration-200"
      onMouseUp={handleMouseUp}
    >
      {/* Top Header Bar */}
      <header className="h-16 sm:h-18 border-b border-slate-800 bg-slate-900/95 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 shrink-0 shadow-lg z-20">
        {/* Left: Title and Context Info */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Approfondimento Catalogo Ufficiale
              </span>
              <span className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                Pagina {currentPage} di {TOTAL_PAGES}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white truncate flex items-center gap-2">
              <span>{selectedAgenda ? selectedAgenda.nome : `Catalogo Agende 2027`}</span>
              {selectedAgenda && (
                <span className="text-xs text-blue-400 font-mono font-semibold">
                  (Cod. {selectedAgenda.codice})
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Center/Right: Quick Actions & Close */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Add to compare button if applicable */}
          {selectedAgenda && onAddToCompare && (
            <button
              type="button"
              id="modal-add-to-compare-btn"
              onClick={() => {
                const colorToUse = selectedColor || selectedAgenda.colori?.[0];
                if (colorToUse) {
                  onAddToCompare(selectedAgenda, colorToUse);
                }
              }}
              className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95 ${
                isAddedToCompare
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#9e2a3b] hover:bg-[#86202f] text-white'
              }`}
            >
              {isAddedToCompare ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Nel Confronto</span>
                </>
              ) : (
                <>
                  <Palette className="w-3.5 h-3.5" />
                  <span>Aggiungi al confronto</span>
                </>
              )}
            </button>
          )}

          {/* Download / Open full PDF */}
          <a
            href="/catalogo.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition shadow-xs"
            title="Apri o scarica il catalogo PDF completo in nuova scheda"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">PDF Completo</span>
          </a>

          {/* Close button */}
          <button
            type="button"
            id="close-catalog-page-modal"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 hover:bg-rose-950/50 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 text-slate-300 flex items-center justify-center transition cursor-pointer active:scale-95 ml-1"
            title="Chiudi approfondimento (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        {/* Left Side / Viewer Canvas */}
        <div
          ref={containerRef}
          className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden p-2 sm:p-4"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Floating Navigation Arrows */}
          <button
            type="button"
            onClick={() => setCurrentPage(p => (p > 1 ? p - 1 : TOTAL_PAGES))}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-900/85 hover:bg-blue-600 border border-slate-700/80 hover:border-blue-400 text-white flex items-center justify-center shadow-xl backdrop-blur-xs transition active:scale-90 cursor-pointer group"
            title="Pagina precedente (Freccia Sinistra)"
          >
            <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(p => (p < TOTAL_PAGES ? p + 1 : 1))}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-900/85 hover:bg-blue-600 border border-slate-700/80 hover:border-blue-400 text-white flex items-center justify-center shadow-xl backdrop-blur-xs transition active:scale-90 cursor-pointer group"
            title="Pagina successiva (Freccia Destra)"
          >
            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Page Image Display with Pan & Zoom and Mobile Swipe Animation */}
          <div
            className={`max-h-full max-w-full flex items-center justify-center transition-transform ${
              swipeOffset !== 0 ? 'duration-0' : 'duration-150'
            } ease-out ${
              zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
            }`}
            style={{
              transform: `translate3d(${pan.x + (zoom === 1 ? swipeOffset : 0)}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: 'center center'
            }}
            onDoubleClick={handleDoubleClick}
          >
            <img
              ref={imageRef}
              src={pageImageUrl}
              alt={`Pagina ${currentPage} del Catalogo Agende 2027`}
              onLoad={() => setImageLoaded(true)}
              className="max-h-[72vh] md:max-h-[82vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-slate-800 pointer-events-none select-none"
            />
          </div>

          {/* Mobile Swipe Guide Badge */}
          <div className="md:hidden absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-slate-900/80 backdrop-blur-xs border border-slate-700/80 rounded-full text-[10px] font-semibold text-slate-300 flex items-center gap-1.5 shadow pointer-events-none">
            <span>👈 Scorri per sfogliare 👉</span>
          </div>

          {/* Loading indicator */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs z-10 pointer-events-none">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold shadow-lg">
                <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span>Caricamento pagina {currentPage}...</span>
              </div>
            </div>
          )}

          {/* Floating Zoom & Pan Controls Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer active:scale-95"
              title="Rimpicciolisci (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2.5 py-1 text-xs font-mono font-bold text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Reimposta zoom (100%)"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer active:scale-95"
              title="Ingrandisci (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-slate-700 mx-1" />

            <button
              type="button"
              onClick={handleResetZoom}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer active:scale-95"
              title="Ripristina posizione e zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Contextual Details & Models on this Page */}
        <aside className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900/80 p-4 flex flex-col gap-4 overflow-y-auto shrink-0 max-h-[35vh] md:max-h-full">
          {/* Current Page Selector */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
            <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Sfoglia Pagine Catalogo
            </label>
            <div className="flex items-center gap-2">
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-xl focus:outline-hidden focus:border-amber-500"
              >
                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => {
                  const pModels = getModelsForPage(p);
                  const labels = pModels.map(m => m.code).join(', ');
                  return (
                    <option key={p} value={p}>
                      Pagina {p} {labels ? `(${labels})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Models present on this specific page */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Modelli illustrati in Pagina {currentPage} ({currentModelsOnPage.length})
            </span>

            {currentModelsOnPage.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Nessun modello specifico mappato in questa pagina.
              </p>
            ) : (
              <div className="space-y-2">
                {currentModelsOnPage.map((m) => {
                  const isCurrent = selectedAgenda?.codice === m.code;
                  return (
                    <button
                      key={m.code}
                      type="button"
                      onClick={() => handleSelectModelFromPage(m)}
                      className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                          : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400">
                            {m.code}
                          </span>
                          <span className="text-xs font-bold truncate">
                            {m.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Formato: {m.format} • {m.category}
                        </span>
                      </div>
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Agenda Specs Card */}
          {selectedAgenda && (
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-3 mt-auto">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  Scheda Tecnica Selezionata
                </span>
                <h4 className="text-sm font-extrabold text-white mt-0.5">
                  {selectedAgenda.nome}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Formato</span>
                  <span className="font-bold text-slate-200">{selectedAgenda.dimensioniCm}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Interno</span>
                  <span className="font-bold text-slate-200">{selectedAgenda.layout}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Pagine</span>
                  <span className="font-bold text-slate-200">{selectedAgenda.pagine} pag.</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Materiale</span>
                  <span className="font-bold text-slate-200 truncate block">{selectedAgenda.copertina}</span>
                </div>
              </div>

              {/* Color variants */}
              {selectedAgenda.colori && selectedAgenda.colori.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-semibold">Colori disponibili:</span>
                    <span className="text-slate-300 font-bold">
                      {selectedColor?.nome || selectedAgenda.colori[0].nome}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedAgenda.colori.map((c, i) => {
                      const isColActive = selectedColor?.nome === c.nome;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`w-5 h-5 rounded-md border transition cursor-pointer ${
                            isColActive
                              ? 'border-white ring-2 ring-amber-400 scale-110'
                              : 'border-slate-700 opacity-70 hover:opacity-100 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.nome}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mobile / Tablet button to Add to compare */}
              {onAddToCompare && (
                <button
                  type="button"
                  onClick={() => {
                    const colorToUse = selectedColor || selectedAgenda.colori?.[0];
                    if (colorToUse) {
                      onAddToCompare(selectedAgenda, colorToUse);
                    }
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 mt-2 ${
                    isAddedToCompare
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-[#9e2a3b] hover:bg-[#86202f] text-white'
                  }`}
                >
                  {isAddedToCompare ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Già aggiunto al confronto</span>
                    </>
                  ) : (
                    <>
                      <Palette className="w-4 h-4" />
                      <span>Aggiungi al confronto</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Hint on how to interact */}
          <div className="text-[11px] text-slate-500 leading-relaxed text-center hidden md:block pt-1">
            💡 <span className="font-semibold">Suggerimento:</span> Fai doppio clic sulla pagina per ingrandire o ridurre, oppure trascina l'immagine per esaminare da vicino dettagli e tabelle.
          </div>
        </aside>
      </div>
    </div>
  );
};
