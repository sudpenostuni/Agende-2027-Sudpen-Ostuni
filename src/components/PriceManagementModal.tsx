import React, { useState } from 'react';
import { AgendaModel, AgendaAvailability, AgendaCategory } from '../types';
import { X, Search, RotateCcw, Save, Check, AlertCircle, Download, Tag, CheckCircle2, AlertTriangle, XCircle, SlidersHorizontal, Boxes, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface PriceManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: AgendaModel[];
  onSaveCatalog: (updatedModels: AgendaModel[]) => void;
  onResetCatalog: () => void;
}

export const PriceManagementModal: React.FC<PriceManagementModalProps> = ({
  isOpen,
  onClose,
  models,
  onSaveCatalog,
  onResetCatalog
}) => {
  const [editedModels, setEditedModels] = useState<AgendaModel[]>(models);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('Tutti');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [bulkPercent, setBulkPercent] = useState<string>('');

  // Sync state if models change from outside
  React.useEffect(() => {
    setEditedModels(models);
  }, [models, isOpen]);

  if (!isOpen) return null;

  const handlePriceChange = (id: string, newPriceStr: string) => {
    const val = parseFloat(newPriceStr);
    setEditedModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, prezzoBaseUnitario: isNaN(val) ? 0 : Math.max(0, val) } : m))
    );
  };

  const handleCostPriceChange = (id: string, newPriceStr: string) => {
    const val = parseFloat(newPriceStr);
    setEditedModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, prezzoAcquisto: isNaN(val) ? 0 : Math.max(0, val) } : m))
    );
  };

  const handleGiacenzaChange = (id: string, newGiacenzaStr: string) => {
    const trimmed = newGiacenzaStr.trim();
    const val = trimmed === '' ? undefined : parseInt(trimmed, 10);
    setEditedModels((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newGiacenza = val === undefined || isNaN(val) ? undefined : Math.max(0, val);

        let newStatus = m.statoDisponibilita;
        let newDisponibile = m.disponibile;

        if (newGiacenza === 0) {
          newStatus = 'esaurito';
          newDisponibile = false;
        } else if (typeof newGiacenza === 'number' && newGiacenza > 0 && newStatus === 'esaurito') {
          newStatus = newGiacenza <= 10 ? 'in_esaurimento' : 'disponibile';
          newDisponibile = true;
        }

        return {
          ...m,
          giacenza: newGiacenza,
          statoDisponibilita: newStatus,
          disponibile: newDisponibile
        };
      })
    );
  };

  const handleAvailabilityChange = (id: string, status: AgendaAvailability) => {
    setEditedModels((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              statoDisponibilita: status,
              disponibile: status !== 'esaurito'
            }
          : m
      )
    );
  };

  const handleSave = () => {
    onSaveCatalog(editedModels);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2500);
  };

  const handleReset = () => {
    if (window.confirm('Sei sicuro di voler ripristinare tutti i prezzi di acquisto e vendita, giacenze e le disponibilità originali da catalogo?')) {
      onResetCatalog();
      setShowSavedToast(true);
      setTimeout(() => {
        setShowSavedToast(false);
      }, 2500);
    }
  };

  const handleApplyBulkPercentage = () => {
    const p = parseFloat(bulkPercent);
    if (isNaN(p) || p === 0) return;

    if (window.confirm(`Applicare una variazione del ${p > 0 ? `+${p}` : p}% a tutti i prezzi di vendita dei modelli visibili?`)) {
      setEditedModels((prev) =>
        prev.map((m) => {
          // If filtered by category, modify only matching
          if (selectedCat !== 'Tutti' && m.categoria !== selectedCat) return m;
          const newPrice = Number((m.prezzoBaseUnitario * (1 + p / 100)).toFixed(2));
          return { ...m, prezzoBaseUnitario: Math.max(0.1, newPrice) };
        })
      );
      setBulkPercent('');
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Codice,Nome,Categoria,Dimensioni,PrezzoAcquisto,PrezzoVenditaImponibile,GiacenzaPezzi,StatoDisponibilita\n';
    const rows = editedModels
      .map(
        (m) =>
          `"${m.id}","${m.codice}","${m.nome}","${m.categoria}","${m.dimensioniCm}",${(m.prezzoAcquisto || 0).toFixed(
            3
          )},${m.prezzoBaseUnitario.toFixed(
            2
          )},${m.giacenza !== undefined ? m.giacenza : 0},"${m.statoDisponibilita}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `listino_giacenze_agende_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const grouped: Record<string, AgendaModel[]> = {};
    editedModels.forEach((m) => {
      const f = m.formato || 'Altri Formati';
      if (!grouped[f]) {
        grouped[f] = [];
      }
      grouped[f].push(m);
    });

    const sortedFormats = Object.keys(grouped).sort((a, b) => {
      const numA = parseFloat(a.replace(',', '.'));
      const numB = parseFloat(b.replace(',', '.'));
      if (isNaN(numA) && isNaN(numB)) return a.localeCompare(b);
      if (isNaN(numA)) return 1;
      if (isNaN(numB)) return -1;
      return numA - numB;
    });

    const pageHeight = 297;
    const pageWidth = 210;
    const margin = 15;
    let y = margin;
    let pageNum = 1;

    const drawHeader = (pageNum: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('CATALOGO & LISTINO AGENDE 2027', margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Sudpen Ostuni - Listino Ufficiale ordinato per Formato', margin, y);

      const dateStr = new Date().toLocaleDateString('it-IT');
      doc.text(`Data: ${dateStr}`, pageWidth - margin - 35, y);

      y += 3;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 7;
    };

    const drawFooter = (pageNum: number) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Pagina ${pageNum}`, pageWidth / 2, pageHeight - margin + 5, { align: 'center' });
    };

    drawHeader(pageNum);

    sortedFormats.forEach((format) => {
      const items = grouped[format];
      if (items.length === 0) return;

      if (y > 250) {
        drawFooter(pageNum);
        doc.addPage();
        pageNum++;
        y = margin;
        drawHeader(pageNum);
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(29, 78, 216);
      doc.setFillColor(239, 246, 255);
      doc.rect(margin, y - 4, pageWidth - 2 * margin, 7, 'F');
      doc.text(`FORMATO: ${format.toUpperCase()}`, margin + 3, y + 1);
      y += 7;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      
      const colX = {
        code: margin,
        name: margin + 18,
        cat: margin + 85,
        buy: margin + 115,
        sell: margin + 135,
        stock: margin + 155,
        status: margin + 168
      };

      doc.text('Codice', colX.code, y);
      doc.text('Nome Modello', colX.name, y);
      doc.text('Categoria', colX.cat, y);
      doc.text('Acq. €', colX.buy, y);
      doc.text('Vend. €', colX.sell, y);
      doc.text('Giac.', colX.stock, y);
      doc.text('Stato', colX.status, y);
      
      y += 2.5;
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageWidth - margin, y);
      y += 4.5;

      items.forEach((item) => {
        if (y > 270) {
          drawFooter(pageNum);
          doc.addPage();
          pageNum++;
          y = margin;
          drawHeader(pageNum);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          doc.text('Codice', colX.code, y);
          doc.text('Nome Modello', colX.name, y);
          doc.text('Categoria', colX.cat, y);
          doc.text('Acq. €', colX.buy, y);
          doc.text('Vend. €', colX.sell, y);
          doc.text('Giac.', colX.stock, y);
          doc.text('Stato', colX.status, y);
          
          y += 2.5;
          doc.setDrawColor(203, 213, 225);
          doc.line(margin, y, pageWidth - margin, y);
          y += 4.5;
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(29, 78, 216);
        doc.text(item.codice, colX.code, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);

        const trimmedName = item.nome.length > 36 ? item.nome.slice(0, 34) + '...' : item.nome;
        doc.text(trimmedName, colX.name, y);

        doc.text(item.categoria, colX.cat, y);

        doc.text((item.prezzoAcquisto || 0).toFixed(3), colX.buy, y);

        doc.setFont('helvetica', 'bold');
        doc.text(item.prezzoBaseUnitario.toFixed(2), colX.sell, y);
        doc.setFont('helvetica', 'normal');

        doc.text(item.giacenza !== undefined ? `${item.giacenza} pz` : '0 pz', colX.stock, y);

        let statusStr = 'Disponibile';
        if (item.statoDisponibilita === 'in_esaurimento') {
          statusStr = 'Esaurimento';
          doc.setTextColor(217, 119, 6);
        } else if (item.statoDisponibilita === 'esaurito') {
          statusStr = 'Esaurito';
          doc.setTextColor(225, 29, 72);
        } else {
          doc.setTextColor(22, 163, 74);
        }
        doc.text(statusStr, colX.status, y);
        doc.setTextColor(15, 23, 42);

        y += 2.2;
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.1);
        doc.line(margin, y, pageWidth - margin, y);
        y += 4.3;
      });

      y += 3.5;
    });

    drawFooter(pageNum);
    doc.save(`catalogo_formati_agende_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const filtered = editedModels.filter((m) => {
    const matchesCat = selectedCat === 'Tutti' || m.categoria === selectedCat;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.nome.toLowerCase().includes(q) ||
      m.codice.toLowerCase().includes(q) ||
      m.formato.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const availableCount = editedModels.filter((m) => m.statoDisponibilita === 'disponibile').length;
  const lowStockCount = editedModels.filter((m) => m.statoDisponibilita === 'in_esaurimento').length;
  const outOfStockCount = editedModels.filter((m) => m.statoDisponibilita === 'esaurito').length;
  const totalGiacenza = editedModels.reduce((sum, m) => sum + (m.giacenza ?? 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                <Tag className="w-3 h-3" />
                Pannello Gestionale
              </span>
              <span className="text-xs text-slate-400 font-medium">| Modifica Rapida Listino</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tabella Prezzi & Disponibilità Agende
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tutte le modifiche inserite qui aggiornano istantaneamente il catalogo, i calcoli e le schede preventivo.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
            title="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats & Quick Action Bar */}
        <div className="px-5 sm:px-6 py-3 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-slate-700">
              Totale Modelli: <strong className="text-blue-600">{editedModels.length}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 font-semibold">
              <Boxes className="w-3.5 h-3.5 text-blue-600" />
              Giacenza Totale: <strong className="text-blue-700 font-mono">{totalGiacenza.toLocaleString()} pz</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {availableCount} Disponibili
            </span>
            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              {lowStockCount} In Esaurimento
            </span>
            <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-medium">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              {outOfStockCount} Esauriti
            </span>
          </div>

          {/* Bulk adjustment tool */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">Variazione %:</span>
            <input
              type="number"
              placeholder="+/- %"
              value={bulkPercent}
              onChange={(e) => setBulkPercent(e.target.value)}
              className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              onClick={handleApplyBulkPercentage}
              disabled={!bulkPercent}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition"
            >
              Applica %
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
            {['Tutti', 'Giornaliere', 'Settimanali', 'Organizer e Portafoglio'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  selectedCat === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca per codice o nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        {/* Table Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-3 w-20">Codice</th>
                  <th className="py-3 px-3">Modello & Specifiche</th>
                  <th className="py-3 px-3 w-28">Categoria</th>
                  <th className="py-3 px-3 w-28 text-center bg-slate-50 border-x border-slate-200">Acquisto (€)</th>
                  <th className="py-3 px-3 w-28 text-center bg-blue-50/50">Vendita (€)</th>
                  <th className="py-3 px-3 w-24 text-center">Giacenza</th>
                  <th className="py-3 px-3 w-32 text-center">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item, index) => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-[11px] block text-center">
                          {item.codice}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-3">
                          {item.immagine && (
                            <div className="w-10 h-14 shrink-0 bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center p-0.5 shadow-xs">
                              <img src={item.immagine} alt="" className="w-full h-full object-contain" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{item.nome}</span>
                              {item.immagineInterno && (
                                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
                                  + interno
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-sm">
                              {item.formato} • {item.copertina} • {item.colori.length} colori
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {item.categoria}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center bg-slate-50/50 border-x border-slate-200/50">
                        <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-100/50 shadow-xs focus-within:ring-2 focus-within:ring-slate-400">
                          <span className="px-1.5 py-1 bg-slate-200 text-slate-500 font-bold border-r border-slate-200 text-[10px]">
                            €
                          </span>
                          <input
                            type="number"
                            step="0.001"
                            min="0.00"
                            value={item.prezzoAcquisto !== undefined ? item.prezzoAcquisto : ''}
                            onChange={(e) => handleCostPriceChange(item.id, e.target.value)}
                            className="w-16 px-1.5 py-1 text-[11px] font-semibold text-slate-600 text-right focus:outline-hidden bg-transparent"
                            title="Prezzo d'acquisto all'ingrosso (IVA esclusa)"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center bg-blue-50/20">
                        <div className="inline-flex items-center border border-blue-200 rounded-lg overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-blue-500">
                          <span className="px-1.5 py-1 bg-blue-50 text-blue-600 font-bold border-r border-blue-100 text-[10px]">
                            €
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0.10"
                            value={item.prezzoBaseUnitario}
                            onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            className="w-16 px-1.5 py-1 text-[11px] font-bold text-slate-900 text-right focus:outline-hidden"
                            title="Prezzo di vendita imponibile esposto al pubblico"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-blue-500">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            value={item.giacenza !== undefined ? item.giacenza : ''}
                            onChange={(e) => handleGiacenzaChange(item.id, e.target.value)}
                            className="w-16 px-2 py-1 text-xs font-bold text-slate-900 text-center focus:outline-hidden"
                            title="Inserisci la quantità in giacenza per questo modello"
                          />
                          <span className="px-1.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold border-l border-slate-200">
                            pz
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <select
                          value={item.statoDisponibilita}
                          onChange={(e) =>
                            handleAvailabilityChange(item.id, e.target.value as AgendaAvailability)
                          }
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition focus:outline-hidden focus:ring-2 ${
                            item.statoDisponibilita === 'disponibile'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-400'
                              : item.statoDisponibilita === 'in_esaurimento'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-400'
                              : 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-400'
                          }`}
                        >
                          <option value="disponibile">✓ Disponibile</option>
                          <option value="in_esaurimento">⚠ In esaurimento</option>
                          <option value="esaurito">✕ Esaurito</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      Nessuna agenda trovata con i filtri attuali.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition"
              title="Ripristina i prezzi di fabbrica"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Ripristina Default</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition"
              title="Scarica tabella in formato CSV per Excel"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Esporta CSV</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition"
              title="Scarica listino in formato PDF ordinato per formato"
            >
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              <span>Esporta PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {showSavedToast && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
                <Check className="w-4 h-4" />
                Listino Salvato con Successo!
              </span>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
            >
              Chiudi
            </button>

            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Salva e Applica Modifiche</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
