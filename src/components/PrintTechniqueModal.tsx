import React from 'react';
import { X, Sparkles, CheckCircle, Info, Flame, Sun, Droplets, Layers } from 'lucide-react';
import { TECNICHE_STAMPA } from '../data/catalog';

interface PrintTechniqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTechnique: (id: string) => void;
  currentTechniqueId: string;
}

export const PrintTechniqueModal: React.FC<PrintTechniqueModalProps> = ({
  isOpen,
  onClose,
  onSelectTechnique,
  currentTechniqueId
}) => {
  if (!isOpen) return null;

  const getIcon = (id: string) => {
    switch (id) {
      case 'termoincisione':
        return <Flame className="w-5 h-5 text-amber-600" />;
      case 'stampa_oro':
      case 'stampa_argento':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'stampa_uv':
        return <Sun className="w-5 h-5 text-purple-600" />;
      case 'serigrafia':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      default:
        return <Layers className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Guida Tecnica di Laboratorio
          </span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2">
          Come scegliere la tecnica di personalizzazione?
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Ogni tecnica valorizza la copertina in modo differente. Di seguito le caratteristiche di lavorazione artigianale:
        </p>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {TECNICHE_STAMPA.map((tech) => {
            const isSelected = tech.id === currentTechniqueId;
            return (
              <div
                key={tech.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    {getIcon(tech.id)}
                    <h4 className="text-sm font-bold text-slate-900">{tech.nome}</h4>
                  </div>
                  <button
                    onClick={() => {
                      onSelectTechnique(tech.id);
                      onClose();
                    }}
                    className={`text-xs px-3 py-1 rounded-lg font-bold transition ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isSelected ? 'Selezionata' : 'Scegli questa'}
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {tech.descrizione}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tech.effettiDisponibili.map((eff, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded"
                    >
                      ✓ {eff}
                    </span>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
                  <span>
                    Consigliato per: <strong>{tech.consigliatoPer}</strong>
                  </span>
                  <span className="font-mono text-blue-700 font-bold">
                    {tech.sovrapprezzoBase > 0 ? `+€${tech.sovrapprezzoBase.toFixed(2)}/pz` : 'Incluso'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            Chiudi Guida
          </button>
        </div>
      </div>
    </div>
  );
};
