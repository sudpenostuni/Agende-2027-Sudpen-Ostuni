import React from 'react';
import { AgendaConfiguration, ColorOption } from '../types';
import { TECNICHE_STAMPA, calculateQuotation } from '../data/catalog';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ConfiguratorFormProps {
  config: AgendaConfiguration;
  onChangeConfig: (newConfig: Partial<AgendaConfiguration>) => void;
  onOpenTechniqueModal: () => void;
}

export const ConfiguratorForm: React.FC<ConfiguratorFormProps> = ({
  config,
  onChangeConfig,
  onOpenTechniqueModal
}) => {
  const {
    agenda,
    colore,
    tecnica,
    testo,
    logoUrl,
    qty
  } = config;

  const quote = calculateQuotation(agenda, tecnica, qty, testo, logoUrl);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col gap-8">
      {/* SEZIONE 1: Colore Copertina */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold">
              1
            </span>
            <span>Colore Copertina</span>
          </label>
          <span className="text-xs font-semibold text-slate-500">
            Selezionato: <strong className="text-slate-900">{colore.nome}</strong>
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {agenda.colori.map((c: ColorOption, idx: number) => {
            const isSelected = c.nome === colore.nome;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onChangeConfig({ colore: c })}
                className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-black/20 shadow-inner shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs font-semibold text-slate-800">{c.nome}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEZIONE 2: Tecnica di Personalizzazione */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold">
              2
            </span>
            <span>Tecnica di Personalizzazione</span>
          </label>
          <button
            type="button"
            onClick={onOpenTechniqueModal}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guida alle Finiture</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TECNICHE_STAMPA.map((t) => {
            const isSelected = tecnica === t.id;
            return (
              <div
                key={t.id}
                onClick={() => onChangeConfig({ tecnica: t.id })}
                className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{t.nome}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                    {t.descrizione}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-100 mt-2 font-mono">
                  <span className="text-slate-400">
                    Costo: {t.id === 'neutra' ? 'Incluso' : 'Varia pz'}
                  </span>
                  <span className="font-bold text-blue-700">
                    {t.id !== 'neutra' ? 'Impianto incluso' : '0.00 €'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scelta colore lamina per Stampa a Caldo */}
        {tecnica === 'stampa_caldo' && (
          <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in duration-200">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Scegli il colore della lamina per la stampa a caldo:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {[
                { nome: 'Oro', classBg: 'bg-amber-400 border-amber-500' },
                { nome: 'Argento', classBg: 'bg-slate-300 border-slate-400' },
                { nome: 'Bronzo', classBg: 'bg-amber-800 border-amber-900' },
                { nome: 'Rosa Gold', classBg: 'bg-pink-300 border-pink-400' },
                { nome: 'Verde Metal', classBg: 'bg-emerald-600 border-emerald-700' },
                { nome: 'Rosso Metal', classBg: 'bg-red-600 border-red-700' },
                { nome: 'Bianco', classBg: 'bg-white border-slate-300' },
                { nome: 'Nero', classBg: 'bg-slate-900 border-slate-950' },
                { nome: 'Lilla', classBg: 'bg-purple-300 border-purple-400' },
                { nome: 'Blu', classBg: 'bg-blue-600 border-blue-700' }
              ].map((colorItem) => {
                const isFoilSelected = (config.coloreStampa || 'Oro') === colorItem.nome;
                return (
                  <button
                    key={colorItem.nome}
                    type="button"
                    onClick={() => onChangeConfig({ coloreStampa: colorItem.nome })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      isFoilSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm ring-1 ring-blue-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs ${colorItem.classBg}`} />
                    <span>{colorItem.nome}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
