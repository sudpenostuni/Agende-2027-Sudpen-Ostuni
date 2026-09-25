import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Plus,
  BookOpen,
  Eye
} from 'lucide-react';
import { AgendaModel, ColorOption } from '../types';
import { resolveAgendaCoverImage } from '../utils/colorUtils';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  agenda: AgendaModel | null;
  initialColor?: ColorOption | null;
  availableCoverFiles?: string[];
  onAddToCompare?: (agenda: AgendaModel, color: ColorOption) => void;
  isAddedToCompare?: boolean;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  onClose,
  agenda,
  initialColor,
  availableCoverFiles = [],
  onAddToCompare,
  isAddedToCompare = false
}) => {
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [viewMode, setViewMode] = useState<'cover' | 'interior'>('cover');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch tracking for pinch-to-zoom
  const touchDistanceRef = useRef<number | null>(null);
  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync color when modal opens
  useEffect(() => {
    if (isOpen && agenda) {
      setSelectedColor(initialColor || agenda.colori?.[0] || null);
      setViewMode('cover');
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen, agenda, initialColor]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 0.5, 3.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(z - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Double tap to zoom toggle
  const handleDoubleTap = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.stopPropagation();
      if (zoom > 1) {
        handleResetZoom();
      } else {
        setZoom(2.2);
      }
    },
    [zoom, handleResetZoom]
  );

  // Touch gestures (Pinch-to-zoom & double tap & drag)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2 fingers = pinch
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
    } else if (e.touches.length === 1) {
      // 1 finger: detect double tap
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        handleDoubleTap(e);
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;

      // Start drag if zoomed
      if (zoom > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - pan.x,
          y: e.touches[0].clientY - pan.y
        });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      // Pinching
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / touchDistanceRef.current;
      setZoom((z) => {
        const next = Math.min(Math.max(z * ratio, 1), 3.5);
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
      touchDistanceRef.current = currentDist;
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      // Dragging while zoomed
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
    setIsDragging(false);
  };

  // Mouse drag for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || !agenda) return null;

  const activeColor = selectedColor || agenda.colori?.[0] || null;
  const coverResult = activeColor
    ? resolveAgendaCoverImage(agenda, activeColor, availableCoverFiles)
    : { url: agenda.immagine, isVariant: false };

  const currentImageSrc =
    viewMode === 'interior' && agenda.immagineInterno
      ? agenda.immagineInterno
      : coverResult.url || agenda.immagine;

  const hasInterior = Boolean(agenda.immagineInterno);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Zoom immagine ${agenda.nome}`}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md select-none touch-none animate-in fade-in duration-200"
    >
      {/* 1. TOP HEADER BAR */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-white/10 z-20">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-white/90 px-1.5 py-0.5 rounded">
              {agenda.codice}
            </span>
            <span className="text-xs font-semibold text-slate-300 truncate">
              {agenda.formato}
            </span>
          </div>
          <h2 className="text-sm font-bold text-white truncate mt-0.5">
            {agenda.nome}
          </h2>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition cursor-pointer shrink-0"
          title="Chiudi zoom"
          aria-label="Chiudi zoom"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. SUB-HEADER: TABS (COPERTINA / INTERNO) & ZOOM CONTROLS */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-white/5 z-20">
        {/* View toggle (Copertina vs Interno) */}
        {hasInterior ? (
          <div className="flex items-center bg-white/10 rounded-xl p-0.5 text-xs font-bold text-white">
            <button
              type="button"
              onClick={() => {
                setViewMode('cover');
                handleResetZoom();
              }}
              className={`px-3 py-1 rounded-lg transition ${
                viewMode === 'cover'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Copertina
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('interior');
                handleResetZoom();
              }}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'interior'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interno</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Vista dettagliata copertina</span>
          </div>
        )}

        {/* Quick Zoom Buttons */}
        <div className="flex items-center gap-1 bg-white/10 rounded-xl p-0.5">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/90 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            title="Riduci zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="px-2 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold text-amber-300 hover:bg-white/10 transition cursor-pointer"
            title="Ripristina 100%"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 3.5}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/90 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            title="Aumenta zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {zoom > 1 && (
            <button
              type="button"
              onClick={handleResetZoom}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/10 transition cursor-pointer ml-0.5"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE IMAGE CANVAS */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing p-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative transition-transform duration-75 ease-out max-w-full max-h-full flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <img
            src={currentImageSrc}
            alt={`${agenda.nome} - ${activeColor?.nome || ''}`}
            className="max-h-[62vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl pointer-events-none border border-white/10 bg-white/5"
            draggable={false}
          />
        </div>

        {/* Tap hint overlay at the top of the canvas */}
        {zoom === 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none bg-black/60 backdrop-blur-xs text-white/80 text-[11px] font-medium px-3 py-1 rounded-full border border-white/10 shadow-lg">
            Doppio tocco o pizzica per ingrandire
          </div>
        )}
      </div>

      {/* 4. BOTTOM BAR: COLOR SWATCHES & ADD TO CART/COMPARE */}
      <div className="shrink-0 p-3 bg-slate-900/90 border-t border-white/10 z-20 flex flex-col gap-2.5">
        {/* Color Palette (if more than 1 color) */}
        {agenda.colori && agenda.colori.length > 1 && viewMode === 'cover' && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none justify-start sm:justify-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Colore:
            </span>
            {agenda.colori.map((col) => {
              const isSelected = activeColor?.nome === col.nome;
              return (
                <button
                  key={col.nome}
                  type="button"
                  onClick={() => {
                    setSelectedColor(col);
                    handleResetZoom();
                  }}
                  className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    isSelected
                      ? 'border-white ring-2 ring-amber-400 scale-110 shadow-md'
                      : 'border-white/30 hover:border-white/70 opacity-75 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.nome}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              );
            })}
            {activeColor && (
              <span className="text-xs font-semibold text-white ml-1 shrink-0">
                {activeColor.nome}
              </span>
            )}
          </div>
        )}

        {/* Action Button: Add to Compare */}
        <div className="flex items-center gap-2">
          {onAddToCompare && activeColor && (
            <button
              type="button"
              onClick={() => {
                onAddToCompare(agenda, activeColor);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition active:scale-95 shadow-md cursor-pointer ${
                isAddedToCompare
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#9e2a3b] hover:bg-[#86202f] text-white'
              }`}
            >
              {isAddedToCompare ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Aggiunto al Confronto</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Aggiungi al Confronto ({agenda.prezzoIvaInclusa?.toFixed(2) ?? agenda.prezzoBaseUnitario.toFixed(2)} €)</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
