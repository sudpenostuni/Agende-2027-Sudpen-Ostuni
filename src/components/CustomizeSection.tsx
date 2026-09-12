import React, { useState } from 'react';
import { AgendaModel, ColorOption } from '../types';
import { resolveAgendaCoverImage } from '../utils/colorUtils';
import { Paintbrush, Sparkles, HelpCircle, Check, ArrowLeft, ArrowRight, Type, FileEdit, Eye } from 'lucide-react';

interface CartItem {
  id: string;
  agenda: AgendaModel;
  colore: ColorOption;
  qty: number;
}

interface CustomizeSectionProps {
  cartItems: CartItem[];
  tecnica: 'neutra' | 'termoincisione' | 'stampa_caldo';
  coloreStampa: string;
  onChangeTecnica: (tech: 'neutra' | 'termoincisione' | 'stampa_caldo') => void;
  onChangeColoreStampa: (color: string) => void;
  testoPersonalizzato: string;
  onChangeTestoPersonalizzato: (text: string) => void;
  stileCarattere: string;
  onChangeStileCarattere: (style: string) => void;
  usaLogo: boolean;
  onChangeUsaLogo: (val: boolean) => void;
  onOpenTechniqueModal: () => void;
  onGoToPage: (page: 'catalog' | 'compare' | 'customize' | 'checkout') => void;
  availableCoverFiles?: string[];
}

export const CustomizeSection: React.FC<CustomizeSectionProps> = ({
  cartItems,
  tecnica,
  coloreStampa,
  onChangeTecnica,
  onChangeColoreStampa,
  testoPersonalizzato,
  onChangeTestoPersonalizzato,
  stileCarattere,
  onChangeStileCarattere,
  usaLogo,
  onChangeUsaLogo,
  onOpenTechniqueModal,
  onGoToPage,
  availableCoverFiles = []
}) => {
  // We keep a state to choose which cart item color to preview if there are multiple
  const [previewItemIndex, setPreviewItemIndex] = useState(0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200">
          <Paintbrush className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Il tuo carrello è vuoto</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
          Aggiungi almeno un'agenda al carrello dalla pagina di confronto prima di impostare la personalizzazione.
        </p>
        <button
          onClick={() => onGoToPage('compare')}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md transition cursor-pointer"
        >
          Vai al Confronto
        </button>
      </div>
    );
  }

  // Cost calculation based on user rules
  const textLength = testoPersonalizzato.trim().length;
  const hasText = textLength > 0;
  
  // Costo minimo di 4€, oltre il ventesimo carattere calcola 10 centesimi a carattere aggiuntivo
  const textCost = hasText ? (4.0 + Math.max(0, textLength - 20) * 0.10) : 0;
  const logoCost = usaLogo ? 5.0 : 0;
  const totalCustomizationCost = textCost + logoCost;

  // Selected item color to preview
  const selectedPreviewItem = cartItems[previewItemIndex] || cartItems[0];
  const diaryCoverColor = selectedPreviewItem.colore.hex;
  const diaryCoverName = `${selectedPreviewItem.agenda.nome} (${selectedPreviewItem.colore.nome})`;

  // Font family mapping helper
  const getFontStyle = (style: string): React.CSSProperties => {
    switch (style) {
      case 'Script Corsivo':
        return {
          fontFamily: "'Great Vibes', 'Playball', 'Brush Script MT', cursive",
          fontSize: '24px',
          fontStyle: 'italic',
          lineHeight: '1.2'
        };
      case 'Garamond Classico':
        return {
          fontFamily: "'EB Garamond', 'Georgia', 'Garamond', serif",
          fontSize: '18px',
          letterSpacing: '0.06em',
          lineHeight: '1.4'
        };
      case 'Bodoni Moderno':
        return {
          fontFamily: "'Playfair Display', 'Bodoni MT', 'Didot', serif",
          fontSize: '19px',
          fontWeight: 'bold',
          letterSpacing: '0.02em',
          lineHeight: '1.3'
        };
      case 'Helvetica Lineare':
      default:
        return {
          fontFamily: "'Plus Jakarta Sans', 'Helvetica Neue', 'Helvetica', sans-serif",
          fontSize: '14px',
          fontWeight: '800',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          lineHeight: '1.4'
        };
    }
  };

  // Metallic foil gradient mapping helper
  const getFoilStyle = (colorName: string): React.CSSProperties => {
    switch (colorName) {
      case 'Oro':
        return {
          background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 70%, #AA771C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.25))'
        };
      case 'Argento':
        return {
          background: 'linear-gradient(135deg, #A0A0A0 0%, #F5F5F5 25%, #909090 50%, #FFFFFF 75%, #808080 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.25))'
        };
      case 'Bronzo':
        return {
          background: 'linear-gradient(135deg, #804A00 0%, #CA7B13 35%, #804A00 70%, #A35C0A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.25))'
        };
      case 'Rosa Gold':
        return {
          background: 'linear-gradient(135deg, #B76E79 0%, #FFD1DC 35%, #B76E79 70%, #F1A9B4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.25))'
        };
      case 'Verde Metal':
        return {
          background: 'linear-gradient(135deg, #115E59 0%, #2DD4BF 50%, #115E59 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.25))'
        };
      case 'Rosso Metal':
        return {
          background: 'linear-gradient(135deg, #991B1B 0%, #F87171 50%, #991B1B 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.25))'
        };
      case 'Bianco':
        return {
          color: '#FFFFFF',
          textShadow: '0px 1.5px 3px rgba(0,0,0,0.4), 0px 0px 1px rgba(0,0,0,0.2)'
        };
      case 'Nero':
        return {
          color: '#111827',
          textShadow: '0px 1px 1px rgba(255,255,255,0.2)'
        };
      case 'Lilla':
        return {
          background: 'linear-gradient(135deg, #8B5CF6 0%, #DDD6FE 50%, #8B5CF6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.25))'
        };
      case 'Blu':
        return {
          background: 'linear-gradient(135deg, #1E40AF 0%, #60A5FA 50%, #1E40AF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.25))'
        };
      default:
        return {
          color: '#D4AF37'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personalization settings */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* 1. Input Box: Personalization Text */}
            <div className="space-y-3">
              <input
                type="text"
                value={testoPersonalizzato}
                onChange={(e) => onChangeTestoPersonalizzato(e.target.value)}
                placeholder="Scrivi qui il testo da incidere (es. nome, iniziali, o dicitura)..."
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none rounded-xl text-sm font-semibold text-slate-800 transition"
              />
            </div>

            {/* 2. REAL-TIME VISUAL PREVIEW OF ENCRYPTED/ENGRAVED TEXT & LOGO */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                {cartItems.length > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap ml-auto">
                    {cartItems.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPreviewItemIndex(idx)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                          previewItemIndex === idx
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-900/5 border border-slate-200/60 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
                {/* Simulated 3D Premium Book Cover Mockup */}
                <div 
                  className="w-48 h-64 rounded-xl shadow-2xl relative transition-all duration-300 overflow-hidden border-r-4 border-black/30 flex flex-col justify-between p-5 animate-in fade-in zoom-in-95 duration-300"
                  style={{ 
                    backgroundColor: diaryCoverColor,
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4), inset -10px 0px 20px rgba(0,0,0,0.25), inset 3px 3px 10px rgba(255,255,255,0.15)'
                  }}
                >
                  {/* Left Spine Texture Highlight */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/15 border-r border-white/5" />

                  {/* Year watermark "2027" blind-stamped or foiled lightly */}
                  <div 
                    className="absolute right-4 bottom-4 text-3xl font-bold tracking-widest pointer-events-none opacity-20 font-serif select-none"
                    style={getFoilStyle(coloreStampa)}
                  >
                    2027
                  </div>

                  {/* Top-center: Logo Stamp Preview */}
                  <div className="w-full flex flex-col items-center justify-center mt-4 z-10">
                    {usaLogo ? (
                      <div className="flex flex-col items-center gap-1.5 animate-in zoom-in-95 duration-300">
                        {/* A beautiful elegant standard clichè stamp preview icon representing the logo */}
                        <div className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center p-1 bg-black/5"
                             style={{ borderColor: getFoilStyle(coloreStampa).color || '#D4AF37' }}>
                          <Sparkles className="w-6 h-6 animate-pulse" style={getFoilStyle(coloreStampa)} />
                        </div>
                        <span className="text-[8px] font-black tracking-widest uppercase" style={getFoilStyle(coloreStampa)}>
                          LOGO AZIENDALE
                        </span>
                      </div>
                    ) : (
                      <div className="h-12" />
                    )}
                  </div>

                  {/* Center-bottom: Custom text preview formatted exactly in the chosen font style & metallic foil */}
                  <div className="w-full text-center mb-8 px-2 min-h-[50px] flex items-center justify-center z-10">
                    {testoPersonalizzato.trim() ? (
                      <span 
                        className="block font-semibold transition-all duration-200"
                        style={{
                          ...getFontStyle(stileCarattere),
                          ...getFoilStyle(coloreStampa),
                          wordBreak: 'break-word',
                          textShadow: coloreStampa === 'Bianco' ? '0px 1.5px 3px rgba(0,0,0,0.4)' : '0px 1px 1px rgba(0,0,0,0.15)'
                        }}
                      >
                        {testoPersonalizzato}
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 italic">
                        [ Testo Incisione ]
                      </span>
                    )}
                  </div>

                  {/* Notebook Cover edge line detail */}
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/10" />
                </div>
              </div>
            </div>

            {/* 3. Dropdown: Character Style */}
            <div className="space-y-3 pt-2">
              <select
                value={stileCarattere}
                onChange={(e) => onChangeStileCarattere(e.target.value)}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none rounded-xl text-sm font-semibold text-slate-800 transition cursor-pointer"
              >
                <option value="Script Corsivo">Script Corsivo (Elegante e Sinuoso)</option>
                <option value="Garamond Classico">Garamond Classico (Tradizionale e Serif)</option>
                <option value="Bodoni Moderno">Bodoni Moderno (Editoriale e di Impatto)</option>
                <option value="Helvetica Lineare">Helvetica Lineare (Pulito e Minimale)</option>
              </select>
            </div>

            {/* 4. Dropdown: Foil Colors (Converted to select dropdown) */}
            <div className="space-y-3">
              <select
                value={coloreStampa}
                onChange={(e) => onChangeColoreStampa(e.target.value)}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none rounded-xl text-sm font-semibold text-slate-800 transition cursor-pointer"
              >
                <option value="Oro">🟡 Oro (Metallizzato Brillante)</option>
                <option value="Argento">⚪ Argento (Lucido Splendente)</option>
                <option value="Bronzo">🟤 Bronzo (Classico Rame)</option>
                <option value="Rosa Gold">🌸 Rosa Gold (Elegante Rosato)</option>
                <option value="Verde Metal">🟢 Verde Metal (Metallizzato)</option>
                <option value="Rosso Metal">🔴 Rosso Metal (Metallizzato)</option>
                <option value="Bianco">⚪ Bianco Opaco (Coprente)</option>
                <option value="Nero">⚫ Nero Lucido (Satinato)</option>
                <option value="Lilla">🟣 Lilla Metal (Metallizzato)</option>
                <option value="Blu">🔵 Blu Metal (Metallizzato)</option>
              </select>
            </div>

            {/* 5. Checkbox: Add Logo */}
            <div className="pt-2">
              <label className="relative flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/50 transition">
                <input
                  type="checkbox"
                  checked={usaLogo}
                  onChange={(e) => onChangeUsaLogo(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    Aggiungi Logo Aziendale (+5,00 €)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Spunta questa opzione se desideri inviare e far riprodurre un cliché con il tuo logo personalizzato.
                  </p>
                </div>
              </label>
            </div>

            {/* 6. Distinta dei Costi di Personalizzazione */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Distinta dei Costi di Personalizzazione (cad.)
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Costo base testo (fino a 20 caratteri):</span>
                  <span className="font-bold text-slate-800">{hasText ? "4,00 €" : "0,00 €"}</span>
                </div>
                {textLength > 20 && (
                  <div className="flex justify-between text-blue-700 font-medium">
                    <span>Caratteri aggiuntivi ({textLength - 20} eccedenti):</span>
                    <span className="font-bold">+ {((textLength - 20) * 0.10).toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Costo logo (+5,00 €):</span>
                  <span className="font-bold text-slate-800">{usaLogo ? "5,00 €" : "0,00 €"}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-slate-900 text-sm">
                  <span>Totale Personalizzazione per pezzo:</span>
                  <span className="text-blue-600 font-mono">{totalCustomizationCost.toFixed(2)} €</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Items overview to be customized (4 columns) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Riepilogo Carrello da Personalizzare
          </h3>
          <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto pr-2">
            {cartItems.map((item) => {
              const { id, agenda, colore, qty } = item;
              const coverResult = resolveAgendaCoverImage(agenda, colore, availableCoverFiles);
              return (
                <div key={id} className="py-3 flex items-center gap-3">
                  {coverResult.url ? (
                    <img
                      src={coverResult.url}
                      alt={agenda.nome}
                      className="w-10 h-12 object-contain bg-slate-50 border border-slate-200/60 p-0.5 rounded-lg shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-12 rounded-lg border border-slate-200 shrink-0" style={{ backgroundColor: colore.hex }} />
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-extrabold text-slate-800 truncate" title={agenda.nome}>
                      {agenda.nome}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Cod. {agenda.codice} • {colore.nome}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      Qtà: {qty} pz
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <button
              onClick={() => onGoToPage('checkout')}
              className="w-full py-3 rounded-xl bg-[#9e2a3b] hover:bg-[#86202f] text-white text-xs font-black tracking-wide shadow-md shadow-rose-950/10 hover:shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span>Genera Scheda Preventivo →</span>
            </button>

            <button
              onClick={() => onGoToPage('compare')}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Torna al Confronto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
