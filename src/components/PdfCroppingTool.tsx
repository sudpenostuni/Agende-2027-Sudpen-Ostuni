import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Check,
  CheckCircle2,
  CheckCheck,
  AlertCircle,
  Download,
  Save,
  Eye,
  Scissors,
  Layers,
  Sparkles,
  Book,
  Grid,
  Square,
  Pentagon,
  Search,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  FileText,
  Clock,
  Palette
} from 'lucide-react';
import {
  CATALOG_MODELS_MAP,
  TOTAL_PAGES,
  getPageImage,
  getModelsForPage,
  ModelCatalogInfo
} from '../data/catalogPagesMap';
import { LISTA_UNIFICATA_AGENDE } from '../data/catalog';
import { ColorOption } from '../types';
import { getColorSlug, MODEL_TO_LINE_KEY } from '../utils/colorUtils';

interface Point {
  x: number; // percentage [0..100] relative to natural image
  y: number; // percentage [0..100] relative to natural image
}

interface RectBox {
  x: number; // percentage [0..100]
  y: number;
  width: number;
  height: number;
}

interface PdfCroppingToolProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSaved?: (code: string, type: 'covers' | 'interiors', newUrl: string, colorSlug?: string) => void;
}

type CropMode = 'box' | 'quad';

export const PdfCroppingTool: React.FC<PdfCroppingToolProps> = ({
  isOpen,
  onClose,
  onImageSaved
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [cropMode, setCropMode] = useState<CropMode>('box');
  const [targetType, setTargetType] = useState<'covers' | 'interiors'>('covers');
  const [selectedModelCode, setSelectedModelCode] = useState<string>('70126');
  const [selectedColorVariant, setSelectedColorVariant] = useState<ColorOption | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'inspector' | 'checklist'>('inspector');
  const [checklistView, setChecklistView] = useState<'pages' | 'models'>('pages');
  const [statusFilter, setStatusFilter] = useState<'all' | 'done' | 'todo'>('all');

  // Preview options
  const [previewBg, setPreviewBg] = useState<'checker' | 'white' | 'dark'>('white');
  const [autoTrimWhite, setAutoTrimWhite] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Status of available crops from disk
  const [existingCrops, setExistingCrops] = useState<{ covers: string[]; interiors: string[] }>({
    covers: [],
    interiors: []
  });

  // Selection state in image percentage (0 to 100)
  const [box, setBox] = useState<RectBox>({ x: 20, y: 15, width: 45, height: 60 });
  const [quadPoints, setQuadPoints] = useState<[Point, Point, Point, Point]>([
    { x: 20, y: 15 },
    { x: 65, y: 15 },
    { x: 65, y: 75 },
    { x: 20, y: 75 }
  ]);

  // Interaction dragging state
  const [dragState, setDragState] = useState<{
    type: 'new' | 'move' | 'handle' | 'quad-point';
    handle?: string;
    pointIndex?: number;
    startX: number;
    startY: number;
    initialBox?: RectBox;
    initialPoints?: [Point, Point, Point, Point];
  } | null>(null);

  // DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch current status of images on disk
  const refreshCropStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/crop-status');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setExistingCrops(data);
      }
    } catch {
      // Fallback if not available
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshCropStatus();
    }
  }, [isOpen, refreshCropStatus]);

  // When changing page, auto-select first model for that page
  useEffect(() => {
    const pageModels = getModelsForPage(currentPage);
    if (pageModels.length > 0) {
      setSelectedModelCode(pageModels[0].code);
    }
  }, [currentPage]);

  // Sync box and quad when switching mode
  const handleModeChange = (mode: CropMode) => {
    if (mode === 'quad' && cropMode === 'box') {
      setQuadPoints([
        { x: box.x, y: box.y },
        { x: box.x + box.width, y: box.y },
        { x: box.x + box.width, y: box.y + box.height },
        { x: box.x, y: box.y + box.height }
      ]);
    } else if (mode === 'box' && cropMode === 'quad') {
      const xs = quadPoints.map(p => p.x);
      const ys = quadPoints.map(p => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      setBox({
        x: minX,
        y: minY,
        width: Math.max(5, maxX - minX),
        height: Math.max(5, maxY - minY)
      });
    }
    setCropMode(mode);
  };

  // Convert mouse event to percentage relative to displayed image
  const getEventPercentCoords = (e: React.MouseEvent): { x: number; y: number } | null => {
    if (!imageRef.current) return null;
    const rect = imageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  // Render crop extraction to preview canvas whenever selection or page changes
  const updateCropPreview = useCallback(() => {
    const img = imageRef.current;
    const canvas = previewCanvasRef.current;
    if (!img || !canvas || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate pixel coordinates in the original full-res image
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    let srcX = 0,
      srcY = 0,
      srcW = 100,
      srcH = 100;

    if (cropMode === 'box') {
      srcX = (box.x / 100) * nw;
      srcY = (box.y / 100) * nh;
      srcW = (box.width / 100) * nw;
      srcH = (box.height / 100) * nh;
    } else {
      const xs = quadPoints.map(p => (p.x / 100) * nw);
      const ys = quadPoints.map(p => (p.y / 100) * nh);
      srcX = Math.min(...xs);
      srcY = Math.min(...ys);
      srcW = Math.max(...xs) - srcX;
      srcH = Math.max(...ys) - srcY;
    }

    if (srcW < 5 || srcH < 5) return;

    // Set canvas size to match the cropped region resolution
    canvas.width = Math.round(srcW);
    canvas.height = Math.round(srcH);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (cropMode === 'box') {
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);
    } else {
      // Quadrilateral clipping path
      ctx.save();
      ctx.beginPath();
      const p1 = { x: (quadPoints[0].x / 100) * nw - srcX, y: (quadPoints[0].y / 100) * nh - srcY };
      const p2 = { x: (quadPoints[1].x / 100) * nw - srcX, y: (quadPoints[1].y / 100) * nh - srcY };
      const p3 = { x: (quadPoints[2].x / 100) * nw - srcX, y: (quadPoints[2].y / 100) * nh - srcY };
      const p4 = { x: (quadPoints[3].x / 100) * nw - srcX, y: (quadPoints[3].y / 100) * nh - srcY };

      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // Optional white-border auto-trim
    if (autoTrimWhite) {
      trimCanvasWhiteSpace(canvas);
    }
  }, [box, quadPoints, cropMode, autoTrimWhite]);

  // Helper to trim empty white borders
  const trimCanvasWhiteSpace = (cvs: HTMLCanvasElement) => {
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const w = cvs.width;
    const h = cvs.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let top = 0,
      bottom = h,
      left = 0,
      right = w;

    // Scan top
    let found = false;
    for (let y = 0; y < h && !found; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        // Check if not white / not transparent
        if (data[idx + 3] > 20 && (data[idx] < 240 || data[idx + 1] < 240 || data[idx + 2] < 240)) {
          top = Math.max(0, y - 2);
          found = true;
          break;
        }
      }
    }

    // Scan bottom
    found = false;
    for (let y = h - 1; y >= 0 && !found; y--) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        if (data[idx + 3] > 20 && (data[idx] < 240 || data[idx + 1] < 240 || data[idx + 2] < 240)) {
          bottom = Math.min(h, y + 3);
          found = true;
          break;
        }
      }
    }

    // Scan left
    found = false;
    for (let x = 0; x < w && !found; x++) {
      for (let y = top; y < bottom; y++) {
        const idx = (y * w + x) * 4;
        if (data[idx + 3] > 20 && (data[idx] < 240 || data[idx + 1] < 240 || data[idx + 2] < 240)) {
          left = Math.max(0, x - 2);
          found = true;
          break;
        }
      }
    }

    // Scan right
    found = false;
    for (let x = w - 1; x >= 0 && !found; x--) {
      for (let y = top; y < bottom; y++) {
        const idx = (y * w + x) * 4;
        if (data[idx + 3] > 20 && (data[idx] < 240 || data[idx + 1] < 240 || data[idx + 2] < 240)) {
          right = Math.min(w, x + 3);
          found = true;
          break;
        }
      }
    }

    const trimW = right - left;
    const trimH = bottom - top;
    if (trimW > 20 && trimH > 20 && (trimW < w || trimH < h)) {
      const trimmed = ctx.getImageData(left, top, trimW, trimH);
      cvs.width = trimW;
      cvs.height = trimH;
      ctx.putImageData(trimmed, 0, 0);
    }
  };

  useEffect(() => {
    updateCropPreview();
  }, [updateCropPreview, currentPage]);

  // Handle Mouse Events for Box / Quadrilateral Drawing & Moving
  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getEventPercentCoords(e);
    if (!coords) return;

    // Check if clicked near a quad point
    if (cropMode === 'quad') {
      const threshold = 3; // 3% distance
      const hitIndex = quadPoints.findIndex(
        p => Math.abs(p.x - coords.x) < threshold && Math.abs(p.y - coords.y) < threshold
      );
      if (hitIndex !== -1) {
        setDragState({
          type: 'quad-point',
          pointIndex: hitIndex,
          startX: coords.x,
          startY: coords.y,
          initialPoints: [...quadPoints]
        });
        return;
      }
    }

    // Check if clicked inside box to move
    if (
      cropMode === 'box' &&
      coords.x >= box.x &&
      coords.x <= box.x + box.width &&
      coords.y >= box.y &&
      coords.y <= box.y + box.height
    ) {
      setDragState({
        type: 'move',
        startX: coords.x,
        startY: coords.y,
        initialBox: { ...box }
      });
      return;
    }

    // Otherwise start new box
    setDragState({
      type: 'new',
      startX: coords.x,
      startY: coords.y
    });
    setBox({
      x: coords.x,
      y: coords.y,
      width: 1,
      height: 1
    });
  };

  const handleHandleMouseDown = (handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const coords = getEventPercentCoords(e);
    if (!coords) return;

    setDragState({
      type: 'handle',
      handle,
      startX: coords.x,
      startY: coords.y,
      initialBox: { ...box }
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;
    const coords = getEventPercentCoords(e);
    if (!coords) return;

    const dx = coords.x - dragState.startX;
    const dy = coords.y - dragState.startY;

    if (dragState.type === 'new') {
      const minX = Math.min(dragState.startX, coords.x);
      const minY = Math.min(dragState.startY, coords.y);
      const w = Math.max(1, Math.abs(coords.x - dragState.startX));
      const h = Math.max(1, Math.abs(coords.y - dragState.startY));
      setBox({ x: minX, y: minY, width: w, height: h });
    } else if (dragState.type === 'move' && dragState.initialBox) {
      const newX = Math.max(0, Math.min(100 - dragState.initialBox.width, dragState.initialBox.x + dx));
      const newY = Math.max(0, Math.min(100 - dragState.initialBox.height, dragState.initialBox.y + dy));
      setBox({ ...dragState.initialBox, x: newX, y: newY });
    } else if (dragState.type === 'handle' && dragState.initialBox && dragState.handle) {
      const b = { ...dragState.initialBox };
      const h = dragState.handle;

      if (h.includes('w')) {
        const proposedW = b.width - dx;
        if (proposedW > 2) {
          b.x = b.x + dx;
          b.width = proposedW;
        }
      }
      if (h.includes('e')) {
        b.width = Math.max(2, b.width + dx);
      }
      if (h.includes('n')) {
        const proposedH = b.height - dy;
        if (proposedH > 2) {
          b.y = b.y + dy;
          b.height = proposedH;
        }
      }
      if (h.includes('s')) {
        b.height = Math.max(2, b.height + dy);
      }
      setBox(b);
    } else if (dragState.type === 'quad-point' && dragState.initialPoints && dragState.pointIndex !== undefined) {
      const pts = [...dragState.initialPoints] as [Point, Point, Point, Point];
      pts[dragState.pointIndex] = {
        x: Math.max(0, Math.min(100, dragState.initialPoints[dragState.pointIndex].x + dx)),
        y: Math.max(0, Math.min(100, dragState.initialPoints[dragState.pointIndex].y + dy))
      };
      setQuadPoints(pts);
    }
  };

  const handleMouseUp = () => {
    setDragState(null);
    updateCropPreview();
  };

  // Save to Disk via Server API
  const handleSaveToProject = async () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const colorSlug = targetType === 'covers' && selectedColorVariant ? getColorSlug(selectedColorVariant.nome) : null;
      const lineKey = MODEL_TO_LINE_KEY[selectedModelCode];

      const res = await fetch('/api/save-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: selectedModelCode,
          type: targetType,
          colorSlug,
          lineKey,
          dataUrl
        })
      });

      if (!res.ok) {
        throw new Error('Errore durante il salvataggio su disco');
      }

      const data = await res.json();
      const variantDesc = selectedColorVariant ? ` (variante colore "${selectedColorVariant.nome}")` : '';
      setSaveMessage({
        type: 'success',
        text: `Immagine salvata con successo per ${selectedModelCode}${variantDesc} in ${targetType}!`
      });

      // Refresh disk status
      await refreshCropStatus();

      // Notify parent app to update live image
      if (onImageSaved) {
        onImageSaved(selectedModelCode, targetType, `${data.path}?t=${Date.now()}`, colorSlug || undefined);
      }

      setTimeout(() => setSaveMessage(null), 4000);
    } catch (err) {
      setSaveMessage({
        type: 'error',
        text: (err as Error).message || 'Errore di salvataggio'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Download locally to browser
  const handleDownloadCrop = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/jpeg', 0.95);
    const colorSuffix = targetType === 'covers' && selectedColorVariant ? `_${getColorSlug(selectedColorVariant.nome)}` : '';
    a.download = `${selectedModelCode}${colorSuffix}_${targetType === 'covers' ? 'copertina' : 'interno'}.jpg`;
    a.click();
  };

  const currentModels = getModelsForPage(currentPage);
  const selectedModelInfo = CATALOG_MODELS_MAP.find(m => m.code === selectedModelCode);
  const selectedModelFullData = LISTA_UNIFICATA_AGENDE.find(m => m.codice === selectedModelCode);
  const modelColors: ColorOption[] = selectedModelFullData?.colori || [];

  // Summary per page (from 1 to TOTAL_PAGES)
  const pagesSummary = useMemo(() => {
    return Array.from({ length: TOTAL_PAGES }, (_, i) => {
      const pageNum = i + 1;
      const models = getModelsForPage(pageNum);
      const coversDone = models.filter(m => existingCrops.covers.includes(`${m.code}.jpg`)).length;
      const interiorsDone = models.filter(m => existingCrops.interiors.includes(`${m.code}.jpg`)).length;
      const isCompleted = models.length > 0 && coversDone === models.length && interiorsDone === models.length;
      const isPartiallyDone = (coversDone > 0 || interiorsDone > 0) && !isCompleted;
      return {
        pageNum,
        models,
        coversDone,
        interiorsDone,
        totalModels: models.length,
        isCompleted,
        isPartiallyDone
      };
    });
  }, [existingCrops]);

  const totalPagesDone = pagesSummary.filter(p => p.isCompleted).length;

  const totalCoversDone = CATALOG_MODELS_MAP.filter(m =>
    existingCrops.covers.includes(`${m.code}.jpg`)
  ).length;

  const totalInteriorsDone = CATALOG_MODELS_MAP.filter(m =>
    existingCrops.interiors.includes(`${m.code}.jpg`)
  ).length;

  // Filtered models list
  const filteredModels = useMemo(() => {
    return CATALOG_MODELS_MAP.filter(m => {
      const hasCover = existingCrops.covers.includes(`${m.code}.jpg`);
      const hasInterior = existingCrops.interiors.includes(`${m.code}.jpg`);
      const isDone = hasCover && hasInterior;

      if (statusFilter === 'done' && !isDone) return false;
      if (statusFilter === 'todo' && isDone) return false;

      if (!searchFilter.trim()) return true;
      const query = searchFilter.toLowerCase().trim();
      return (
        m.code.toLowerCase().includes(query) ||
        m.name.toLowerCase().includes(query) ||
        m.page.toString() === query
      );
    });
  }, [existingCrops, statusFilter, searchFilter]);

  // Filtered pages list
  const filteredPages = useMemo(() => {
    return pagesSummary.filter(p => {
      if (statusFilter === 'done' && !p.isCompleted) return false;
      if (statusFilter === 'todo' && p.isCompleted) return false;

      if (!searchFilter.trim()) return true;
      const query = searchFilter.toLowerCase().trim();
      return (
        p.pageNum.toString() === query ||
        p.models.some(m => m.code.toLowerCase().includes(query) || m.name.toLowerCase().includes(query))
      );
    });
  }, [pagesSummary, statusFilter, searchFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col font-sans select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-sm">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Strumento Scontorno & Ritaglio Catalogo PDF</span>
              <span className="text-xs font-mono bg-blue-900/60 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full">
                20 Pagine HD
              </span>
              <span className="text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold">Catalogo Completato (44/44 Modelli)</span>
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Seleziona la pagina, applica il quadrilatero di ritaglio e salva direttamente la copertina o l'interno
            </p>
          </div>
        </div>

        {/* Page Switcher in Header */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 transition"
            title="Pagina precedente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 px-2 font-mono text-xs">
            <span className="text-slate-400">Pagina</span>
            <select
              value={currentPage}
              onChange={e => setCurrentPage(Number(e.target.value))}
              className="bg-slate-900 text-white font-bold px-2 py-1 rounded border border-slate-600 cursor-pointer focus:outline-hidden focus:border-blue-500"
            >
              {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(p => (
                <option key={p} value={p}>
                  {p} di {TOTAL_PAGES}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(TOTAL_PAGES, prev + 1))}
            disabled={currentPage === TOTAL_PAGES}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 transition"
            title="Pagina successiva"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tool Mode Selection & Zoom */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => handleModeChange('box')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                cropMode === 'box'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Box rettangolare con maniglie"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Rettangolo</span>
            </button>
            <button
              onClick={() => handleModeChange('quad')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                cropMode === 'quad'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Quadrilatero a 4 vertici liberi"
            >
              <Pentagon className="w-3.5 h-3.5" />
              <span>Quadrilatero 4 Punti</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setZoomLevel(z => Math.max(0.4, Number((z - 0.2).toFixed(1))))}
              className="p-1.5 text-slate-400 hover:text-white transition"
              title="Riduci Zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="px-2 text-xs font-mono text-slate-300 hover:text-white"
              title="Ripristina 100%"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={() => setZoomLevel(z => Math.min(2.5, Number((z + 0.2).toFixed(1))))}
              className="p-1.5 text-slate-400 hover:text-white transition"
              title="Aumenta Zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
            title="Chiudi strumento ritaglio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Large PDF Page Viewport with Interactive Selection Canvas */}
        <div
          ref={containerRef}
          className="flex-1 bg-slate-950 overflow-auto relative p-6 flex items-center justify-center cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="relative shadow-2xl transition-transform origin-center"
            style={{
              transform: `scale(${zoomLevel})`
            }}
          >
            {/* The high-res page image */}
            <img
              ref={imageRef}
              src={getPageImage(currentPage)}
              alt={`Catalogo Pagina ${currentPage}`}
              className="max-h-[82vh] w-auto block rounded-sm shadow-2xl pointer-events-none select-none border border-slate-700"
              onLoad={updateCropPreview}
            />

            {/* Mouse Capture & Overlay Area */}
            <div
              className="absolute inset-0 z-10"
              onMouseDown={handleMouseDown}
            >
              {/* BOX MODE RENDERING */}
              {cropMode === 'box' && (
                <div
                  className="absolute border-2 border-blue-400 bg-blue-500/20 backdrop-blur-[0.5px] cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`
                  }}
                >
                  {/* Grid lines inside box */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                    <div className="border-r border-b border-white/60" />
                    <div className="border-r border-b border-white/60" />
                    <div className="border-b border-white/60" />
                    <div className="border-r border-b border-white/60" />
                    <div className="border-r border-b border-white/60" />
                    <div className="border-b border-white/60" />
                    <div className="border-r border-white/60" />
                    <div className="border-r border-white/60" />
                    <div />
                  </div>

                  {/* Corner Handles */}
                  {['nw', 'ne', 'se', 'sw'].map(h => (
                    <div
                      key={h}
                      onMouseDown={e => handleHandleMouseDown(h, e)}
                      className={`absolute w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm shadow-md transition-transform hover:scale-125 z-20 ${
                        h === 'nw'
                          ? '-top-1.5 -left-1.5 cursor-nwse-resize'
                          : h === 'ne'
                          ? '-top-1.5 -right-1.5 cursor-nesw-resize'
                          : h === 'se'
                          ? '-bottom-1.5 -right-1.5 cursor-nwse-resize'
                          : '-bottom-1.5 -left-1.5 cursor-nesw-resize'
                      }`}
                    />
                  ))}

                  {/* Edge Handles */}
                  {['n', 'e', 's', 'w'].map(h => (
                    <div
                      key={h}
                      onMouseDown={e => handleHandleMouseDown(h, e)}
                      className={`absolute w-3 h-3 bg-blue-400 border border-white rounded-full shadow-sm z-20 ${
                        h === 'n'
                          ? '-top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize'
                          : h === 'e'
                          ? '-right-1.5 top-1/2 -translate-y-1/2 cursor-ew-resize'
                          : h === 's'
                          ? '-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize'
                          : '-left-1.5 top-1/2 -translate-y-1/2 cursor-ew-resize'
                      }`}
                    />
                  ))}

                  {/* Dimension tag */}
                  <div className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 pointer-events-none shadow-sm flex items-center gap-1.5">
                    <Scissors className="w-3 h-3 text-blue-400" />
                    <span>
                      {Math.round(box.width)}% × {Math.round(box.height)}%
                    </span>
                  </div>
                </div>
              )}

              {/* QUADRILATERAL MODE RENDERING */}
              {cropMode === 'quad' && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-15">
                  {/* Quad Polygon fill */}
                  <polygon
                    points={quadPoints.map(p => `${p.x}%,${p.y}%`).join(' ')}
                    fill="rgba(59, 130, 246, 0.25)"
                    stroke="#60a5fa"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  {/* Diagonal guides */}
                  <line
                    x1={`${quadPoints[0].x}%`}
                    y1={`${quadPoints[0].y}%`}
                    x2={`${quadPoints[2].x}%`}
                    y2={`${quadPoints[2].y}%`}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1={`${quadPoints[1].x}%`}
                    y1={`${quadPoints[1].y}%`}
                    x2={`${quadPoints[3].x}%`}
                    y2={`${quadPoints[3].y}%`}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                </svg>
              )}

              {/* Quad Movable Vertices Handles */}
              {cropMode === 'quad' &&
                quadPoints.map((p, idx) => (
                  <div
                    key={idx}
                    onMouseDown={e => {
                      e.stopPropagation();
                      setDragState({
                        type: 'quad-point',
                        pointIndex: idx,
                        startX: p.x,
                        startY: p.y,
                        initialPoints: [...quadPoints]
                      });
                    }}
                    className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-amber-400 border-2 border-white rounded-full shadow-lg cursor-grab active:cursor-grabbing hover:scale-130 transition-transform z-30 flex items-center justify-center text-[8px] font-black text-slate-900"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    title={`Vertice ${idx + 1}`}
                  >
                    {idx + 1}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Inspector, Model Assignment, Live Preview & Checklist */}
        <div className="w-96 border-l border-slate-800 bg-slate-900/95 flex flex-col shrink-0 overflow-y-auto">
          {/* Tabs in Sidebar */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-1.5">
            <button
              onClick={() => setActiveTab('inspector')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                activeTab === 'inspector'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Anteprima & Salva</span>
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                activeTab === 'checklist'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Scheda ({totalPagesDone}/20 Pag)</span>
            </button>
          </div>

          {activeTab === 'inspector' ? (
            <div className="p-4 space-y-5">
              {/* Live Preview Canvas Section */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ritagliato in Tempo Reale</span>
                  </span>
                  {/* Background toggle */}
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setPreviewBg('white')}
                      className={`w-5 h-5 rounded text-[10px] font-bold ${
                        previewBg === 'white' ? 'bg-white text-black' : 'text-slate-400'
                      }`}
                      title="Sfondo Bianco"
                    >
                      W
                    </button>
                    <button
                      onClick={() => setPreviewBg('checker')}
                      className={`w-5 h-5 rounded text-[10px] font-bold ${
                        previewBg === 'checker' ? 'bg-slate-700 text-white' : 'text-slate-400'
                      }`}
                      title="Sfondo Trasparente a Scacchiera"
                    >
                      🏁
                    </button>
                    <button
                      onClick={() => setPreviewBg('dark')}
                      className={`w-5 h-5 rounded text-[10px] font-bold ${
                        previewBg === 'dark' ? 'bg-black text-white' : 'text-slate-400'
                      }`}
                      title="Sfondo Scuro"
                    >
                      B
                    </button>
                  </div>
                </div>

                {/* The Canvas Frame */}
                <div
                  className={`h-56 rounded-xl border border-slate-700/80 flex items-center justify-center p-3 overflow-hidden shadow-inner ${
                    previewBg === 'white'
                      ? 'bg-white'
                      : previewBg === 'dark'
                      ? 'bg-slate-950'
                      : 'bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:10px_10px] bg-slate-200'
                  }`}
                >
                  <canvas
                    ref={previewCanvasRef}
                    className="max-h-full max-w-full object-contain rounded drop-shadow-md transition-all"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white transition">
                    <input
                      type="checkbox"
                      checked={autoTrimWhite}
                      onChange={e => setAutoTrimWhite(e.target.checked)}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span>Auto-Trim bordi bianchi</span>
                  </label>
                  <button
                    onClick={updateCropPreview}
                    className="flex items-center gap-1 hover:text-blue-400 transition"
                    title="Ricalcola ritaglio"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Aggiorna</span>
                  </button>
                </div>
              </div>

              {/* Assignment: Target Model & Type */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assegna Ritaglio a Modello
                </h3>

                {/* Quick Model Chips for Current Page */}
                {currentModels.length > 0 && (
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                      Modelli presenti in questa Pagina {currentPage}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentModels.map(m => {
                        const isCoverDone = existingCrops.covers.includes(`${m.code}.jpg`);
                        const isInteriorDone = existingCrops.interiors.includes(`${m.code}.jpg`);
                        return (
                          <button
                            key={m.code}
                            onClick={() => {
                              setSelectedModelCode(m.code);
                              setSelectedColorVariant(null);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
                              selectedModelCode === m.code
                                ? 'bg-blue-600 border-blue-400 text-white shadow-xs'
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                            }`}
                          >
                            <span>{m.code}</span>
                            <span className="opacity-70 truncate max-w-[100px]">{m.name.split(' ')[1]}</span>
                            {isCoverDone && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Copertina pronta" />}
                            {isInteriorDone && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Interno pronto" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dropdown for All Models */}
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                    Oppure seleziona qualsiasi modello dal catalogo:
                  </label>
                  <select
                    value={selectedModelCode}
                    onChange={e => {
                      setSelectedModelCode(e.target.value);
                      setSelectedColorVariant(null);
                    }}
                    className="w-full bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-blue-500"
                  >
                    {CATALOG_MODELS_MAP.map(m => (
                      <option key={m.code} value={m.code}>
                        {m.code} - {m.name} (Pag. {m.page})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination: Cover vs Interior */}
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                    Destinazione del ritaglio:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setTargetType('covers')}
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                        targetType === 'covers'
                          ? 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-xs'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      <span>Copertina Esterna</span>
                    </button>
                    <button
                      onClick={() => {
                        setTargetType('interiors');
                        setSelectedColorVariant(null);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                        targetType === 'interiors'
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-xs'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Book className="w-4 h-4" />
                      <span>Interno Pagine</span>
                    </button>
                  </div>
                </div>

                {/* Opzione B: Selettore Variante Colore per Copertina */}
                {targetType === 'covers' && modelColors.length > 0 && (
                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-amber-300 font-bold flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5" />
                        <span>Variante Colore (Opzione B):</span>
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {selectedColorVariant ? selectedColorVariant.nome : 'Copertina Principale'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedColorVariant(null)}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                          selectedColorVariant === null
                            ? 'bg-blue-600 border-blue-400 text-white shadow-xs'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>Principale (Tutte)</span>
                        {existingCrops.covers.includes(`${selectedModelCode}.jpg`) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Copertina base pronta" />
                        )}
                      </button>

                      {modelColors.map((col) => {
                        const slug = getColorSlug(col.nome);
                        const hasVariantCrop = existingCrops.covers.includes(`${selectedModelCode}_${slug}.jpg`);
                        const isSelected = selectedColorVariant?.nome === col.nome;

                        return (
                          <button
                            key={col.nome}
                            type="button"
                            onClick={() => setSelectedColorVariant(col)}
                            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                              isSelected
                                ? 'bg-amber-600/30 border-amber-400 text-amber-200 ring-1 ring-amber-400/50 shadow-xs'
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/30 shrink-0"
                              style={{ backgroundColor: col.hex }}
                            />
                            <span>{col.nome}</span>
                            {hasVariantCrop ? (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Variante già ritagliata" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" title="Non ancora ritagliata" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {selectedColorVariant 
                        ? `Salverai l'immagine specificamente per la variante "${selectedColorVariant.nome}" (${selectedModelCode}_${getColorSlug(selectedColorVariant.nome)}.jpg)`
                        : `Salverai la copertina predefinita del modello (${selectedModelCode}.jpg)`}
                    </p>
                  </div>
                )}

                {/* Selected Model Details Summary */}
                {selectedModelInfo && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-white">{selectedModelInfo.name}</span>
                      <span className="font-mono text-[10px] text-blue-400">Cod. {selectedModelInfo.code}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-2">
                      <span>Formato: {selectedModelInfo.format}</span>
                      <span>•</span>
                      <span>Pagina Ufficiale: {selectedModelInfo.page}</span>
                    </div>
                  </div>
                )}

                {/* Save and Download Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleSaveToProject}
                    disabled={isSaving}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>
                      {isSaving
                        ? 'Salvataggio in corso...'
                        : targetType === 'interiors'
                          ? `Salva Interno Pagine (${selectedModelCode})`
                          : selectedColorVariant
                            ? `Salva Variante "${selectedColorVariant.nome}" (${selectedModelCode}_${getColorSlug(selectedColorVariant.nome)}.jpg)`
                            : `Salva Copertina Principale (${selectedModelCode}.jpg)`}
                    </span>
                  </button>

                  <button
                    onClick={handleDownloadCrop}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Scarica File JPG sul Computer</span>
                  </button>
                </div>

                {/* Toast status message */}
                {saveMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 border animate-in fade-in duration-200 ${
                      saveMessage.type === 'success'
                        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                        : 'bg-red-950/80 border-red-500/50 text-red-200'
                    }`}
                  >
                    {saveMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{saveMessage.text}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* CHECKLIST TAB */
            <div className="p-4 flex-1 flex flex-col space-y-3.5 overflow-hidden">
              {/* Status Header Cards */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Avanzamento Catalogo</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    {totalPagesDone}/{TOTAL_PAGES} Pagine ({Math.round((totalPagesDone / TOTAL_PAGES) * 100)}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex border border-slate-700/50">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    style={{ width: `${(totalPagesDone / TOTAL_PAGES) * 100}%` }}
                    title={`Pagine caricate: ${totalPagesDone}/${TOTAL_PAGES}`}
                  />
                </div>

                {/* Micro metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">Pagine Pronte</span>
                    <span className="font-bold text-emerald-400 font-mono text-xs">{totalPagesDone} / {TOTAL_PAGES}</span>
                  </div>
                  <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">Copertine</span>
                    <span className="font-bold text-emerald-400 font-mono text-xs">{totalCoversDone} / {CATALOG_MODELS_MAP.length}</span>
                  </div>
                  <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">Interni</span>
                    <span className="font-bold text-blue-400 font-mono text-xs">{totalInteriorsDone} / {CATALOG_MODELS_MAP.length}</span>
                  </div>
                </div>

                {/* Completion Celebration Callout */}
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-[11px] space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Tutti i ritagli completati con successo! (44/44 Modelli)</span>
                  </div>
                  <p className="text-slate-300 text-[10px] leading-relaxed">
                    Tutte le 20 pagine del catalogo e tutti i 44 modelli dispongono ora di copertina ad alta risoluzione e visualizzazione interni personalizzata.
                  </p>
                  <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-emerald-900/60 font-mono text-emerald-300">
                    <span>Copertine: {totalCoversDone}/{CATALOG_MODELS_MAP.length} (100%)</span>
                    <span>Interni: {totalInteriorsDone}/{CATALOG_MODELS_MAP.length} (100%)</span>
                    <span className="text-white font-bold">20/20 Pagine</span>
                  </div>
                </div>
              </div>

              {/* View toggle (Pagine vs Modelli) */}
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setChecklistView('pages')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    checklistView === 'pages'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Book className="w-3.5 h-3.5" />
                  <span>Vista Pagine (1-20)</span>
                </button>
                <button
                  onClick={() => setChecklistView('models')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    checklistView === 'models'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Elenco Modelli (44)</span>
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                    statusFilter === 'all'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Tutti ({checklistView === 'pages' ? TOTAL_PAGES : CATALOG_MODELS_MAP.length})
                </button>
                <button
                  onClick={() => setStatusFilter('done')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                    statusFilter === 'done'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>Completati ({checklistView === 'pages' ? totalPagesDone : totalCoversDone})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('todo')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                    statusFilter === 'todo'
                      ? 'bg-amber-700 text-white'
                      : 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/60'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Da rifinire ({checklistView === 'pages' ? TOTAL_PAGES - totalPagesDone : CATALOG_MODELS_MAP.length - totalCoversDone})</span>
                </button>
              </div>

              {/* Search bar */}
              <div className="relative shrink-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={
                    checklistView === 'pages'
                      ? 'Filtra per pagina o modello...'
                      : 'Cerca per codice, nome o pagina...'
                  }
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs pl-9 pr-3 py-1.5 rounded-xl border border-slate-800 focus:outline-hidden focus:border-blue-500 placeholder:text-slate-500"
                />
              </div>

              {/* CONTENT LIST */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
                {checklistView === 'pages' ? (
                  /* --- VISTA PER PAGINA --- */
                  filteredPages.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      Nessuna pagina corrispondente ai filtri.
                    </div>
                  ) : (
                    filteredPages.map(p => (
                      <div
                        key={p.pageNum}
                        className={`p-3 rounded-xl border transition ${
                          p.isCompleted
                            ? 'bg-slate-950/90 border-emerald-500/40 hover:border-emerald-500/80 shadow-xs'
                            : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-white bg-slate-800 px-2 py-0.5 rounded-md">
                              Pagina {p.pageNum}
                            </span>
                            {p.isCompleted ? (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-600/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>Caricata (100%)</span>
                              </span>
                            ) : p.isPartiallyDone ? (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-600/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>In lavorazione</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                                Da ritagliare (0/{p.totalModels})
                              </span>
                            )}
                          </div>

                          {/* Quick Jump to this page */}
                          <button
                            onClick={() => {
                              setCurrentPage(p.pageNum);
                              if (p.models.length > 0) {
                                setSelectedModelCode(p.models[0].code);
                              }
                              setActiveTab('inspector');
                            }}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 active:scale-95 ${
                              currentPage === p.pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            }`}
                            title={`Vai a Pagina ${p.pageNum}`}
                          >
                            <span>{currentPage === p.pageNum ? 'In vista' : 'Vai'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Models in this page */}
                        <div className="space-y-1.5 pt-1 border-t border-slate-900">
                          {p.models.map(m => {
                            const hasCover = existingCrops.covers.includes(`${m.code}.jpg`);
                            const hasInterior = existingCrops.interiors.includes(`${m.code}.jpg`);

                            return (
                              <div
                                key={m.code}
                                onClick={() => {
                                  setCurrentPage(p.pageNum);
                                  setSelectedModelCode(m.code);
                                  setActiveTab('inspector');
                                }}
                                className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 cursor-pointer transition text-[11px]"
                              >
                                <div className="truncate mr-2">
                                  <span className="font-bold text-white font-mono mr-1.5 text-xs">{m.code}</span>
                                  <span className="text-slate-400 text-[10px] truncate">{m.name}</span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                                      hasCover
                                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                                    }`}
                                    title={hasCover ? 'Copertina pronta' : 'Copertina mancante'}
                                  >
                                    {hasCover && <Check className="w-2.5 h-2.5" />}
                                    <span>Cop</span>
                                  </span>
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                                      hasInterior
                                        ? 'bg-blue-950 text-blue-400 border border-blue-800/50'
                                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                                    }`}
                                    title={hasInterior ? 'Interno pronto' : 'Interno mancante'}
                                  >
                                    {hasInterior && <Check className="w-2.5 h-2.5" />}
                                    <span>Int</span>
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  /* --- VISTA ELENCO MODELLI --- */
                  filteredModels.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      Nessun modello corrispondente ai criteri di ricerca.
                    </div>
                  ) : (
                    filteredModels.map(m => {
                      const hasCover = existingCrops.covers.includes(`${m.code}.jpg`);
                      const hasInterior = existingCrops.interiors.includes(`${m.code}.jpg`);
                      const isDone = hasCover && hasInterior;

                      return (
                        <div
                          key={m.code}
                          onClick={() => {
                            setCurrentPage(m.page);
                            setSelectedModelCode(m.code);
                            setActiveTab('inspector');
                          }}
                          className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between group ${
                            isDone
                              ? 'bg-slate-950/90 border-emerald-800/30 hover:bg-slate-900'
                              : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/80'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white group-hover:text-blue-400 transition font-mono">
                                {m.code}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                                Pag. {m.page}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {m.format}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate max-w-[190px]">{m.name}</p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                                hasCover
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                                  : 'bg-slate-900 text-slate-500 border border-slate-800'
                              }`}
                              title={hasCover ? 'Copertina pronta' : 'Copertina mancante'}
                            >
                              {hasCover && <Check className="w-2.5 h-2.5" />}
                              <span>Cop</span>
                            </span>

                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                                hasInterior
                                  ? 'bg-blue-950 text-blue-400 border border-blue-800/50'
                                  : 'bg-slate-900 text-slate-500 border border-slate-800'
                              }`}
                              title={hasInterior ? 'Interno pronto' : 'Interno mancante'}
                            >
                              {hasInterior && <Check className="w-2.5 h-2.5" />}
                              <span>Int</span>
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
