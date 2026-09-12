import React from 'react';
import { AgendaConfiguration } from '../types';
import { getColorFilter } from '../utils/colorFilters';
import { resolveAgendaCoverImage } from '../utils/colorUtils';
import { ImageIcon } from 'lucide-react';

interface AgendaMockupProps {
  config: AgendaConfiguration;
  availableCoverFiles?: string[];
}

export const AgendaMockup: React.FC<AgendaMockupProps> = ({
  config,
  availableCoverFiles = []
}) => {
  const { agenda, colore } = config;

  const colorFilter = getColorFilter(colore.hex);
  const coverResult = resolveAgendaCoverImage(agenda, colore, availableCoverFiles);

  return (
    <div className="bg-white text-slate-950 rounded-2xl p-4 sm:p-6 shadow-md border border-slate-200" id="live-mockup-section">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">
            Anteprima Modello
          </span>
          <h3 className="text-sm font-bold text-slate-900">
            {agenda.nome} — {colore.nome}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          <ImageIcon className="w-3 h-3" />
          <span>Foto Catalogo</span>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="relative flex items-center justify-center py-4 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden min-h-[440px]">
        {/* Agenda Cover Image */}
        <div
          id="live-agenda-cover"
          className="relative w-[280px] sm:w-[300px] h-[390px] sm:h-[420px] rounded-lg shadow-lg overflow-hidden bg-slate-100 flex flex-col justify-between"
        >
          {/* Cover image (colored/filtered) */}
          {coverResult.url ? (
            <div className="absolute inset-0 z-0 overflow-hidden bg-white flex items-center justify-center pointer-events-none">
              <img
                src={coverResult.url}
                alt={`${agenda.nome} ${colore.nome}`}
                className="w-full h-full object-contain"
                style={{
                  filter: coverResult.isSpecificVariant ? 'none' : colorFilter.filter
                }}
              />
              {!coverResult.isSpecificVariant && colorFilter.tintOverlay && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: colorFilter.tintOverlay,
                    mixBlendMode: colorFilter.blendMode || 'color'
                  }}
                />
              )}
            </div>
          ) : (
            <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400 italic text-xs pointer-events-none">
              Nessuna immagine copertina
            </div>
          )}

          {/* Simple non-interactive labels overlaid gracefully at the top corner */}
          <div className="absolute top-3 left-3 z-10 flex gap-1 pointer-events-none">
            <span className="text-[9px] font-mono font-bold bg-black/60 text-white px-2 py-0.5 rounded shadow">
              {colore.nome}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
