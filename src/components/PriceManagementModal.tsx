import React, { useState } from 'react';
import { AgendaModel, AgendaAvailability, AgendaCategory } from '../types';
import { X, Search, RotateCcw, Save, Check, AlertCircle, Download, Tag, CheckCircle2, AlertTriangle, XCircle, SlidersHorizontal } from 'lucide-react';

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
    if (window.confirm('Sei sicuro di voler ripristinare tutti i prezzi e le disponibilità originali da catalogo?')) {
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

    if (window.confirm(`Applicare una variazione del ${p > 0 ? `+${p}` : p}% a tutti i modelli visibili?`)) {
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
    const headers = 'ID,Codice,Nome,Categoria,Dimensioni,PrezzoBase,StatoDisponibilita\n';
    const rows = editedModels
      .map(
        (m) =>
          `"${m.id}","${m.codice}","${m.nome}","${m.categoria}","${m.dimensioniCm}",${m.prezzoBaseUnitario.toFixed(
            2
          )},"${m.statoDisponibilita}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `listino_agende_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
                  <th className="py-3 px-3 w-12 text-center">#</th>
                  <th className="py-3 px-3 w-28">Codice</th>
                  <th className="py-3 px-3">Modello & Specifiche</th>
                  <th className="py-3 px-3 w-28">Categoria</th>
                  <th className="py-3 px-3 w-32 text-center">Prezzo Base (€/pz)</th>
                  <th className="py-3 px-3 w-40 text-center">Stato Magazzino</th>
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
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-blue-500">
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 font-bold border-r border-slate-200">
                            €
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0.10"
                            value={item.prezzoBaseUnitario}
                            onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            className="w-20 px-2 py-1 text-xs font-bold text-slate-900 text-right focus:outline-hidden"
                          />
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
                    <td colSpan={6} className="text-center py-12 text-slate-400">
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
