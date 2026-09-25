import React from 'react';
import { AgendaModel, ColorOption } from '../types';
import { getDiscountMultiplier, calculateQuotation } from '../data/catalog';
import { resolveAgendaCoverImage } from '../utils/colorUtils';
import { Trash2, ShoppingCart, Plus, Minus, ArrowLeft, ArrowRight, ClipboardCheck, Sparkles } from 'lucide-react';

interface CompareItem {
  id: string;
  agenda: AgendaModel;
  colore: ColorOption;
  qty: number;
}

interface CompareSectionProps {
  compareItems: CompareItem[];
  cartItems: CompareItem[];
  onUpdateQty: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onAddToCart: (item: CompareItem) => void;
  onRemoveFromCart: (id: string) => void;
  onGoToPage: (page: 'catalog' | 'compare' | 'customize' | 'checkout') => void;
  availableCoverFiles?: string[];
  onOpenCatalogPage?: (agenda: AgendaModel, colore?: ColorOption) => void;
}

export const CompareSection: React.FC<CompareSectionProps> = ({
  compareItems,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onAddToCart,
  onRemoveFromCart,
  onGoToPage,
  availableCoverFiles = [],
  onOpenCatalogPage
}) => {
  const getTierDiscountLabel = (qty: number): string => {
    return 'Prezzo Fisso';
  };

  if (compareItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200">
          <Trash2 className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">La tua lista di confronto è vuota</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
          Torna al catalogo e seleziona i modelli e i colori di agende che ti interessano per avviare il confronto.
        </p>
        <button
          onClick={() => onGoToPage('catalog')}
          className="px-6 py-3 rounded-xl bg-[#9e2a3b] hover:bg-[#86202f] text-white text-xs font-black shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Sfoglia il Catalogo Agende
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Confronta Selezioni</h2>
        <p className="text-sm text-slate-500 mt-1">
          Modifica le quantità ed aggiungi al carrello i prodotti per la personalizzazione.
        </p>
      </div>

      {/* Stacked comparison list */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs mb-8">
        <div className="divide-y divide-slate-100">
          {compareItems.map((item) => {
            const { id, agenda, colore, qty } = item;
            
            // Calc current unit price for that item with standard tier discount (prezzo al pubblico già IVA compresa)
            const discountMultiplier = getDiscountMultiplier(qty);
            const singleItemPriceWithVat = Number(((agenda.prezzoIvaInclusa ?? agenda.prezzoBaseUnitario) * discountMultiplier).toFixed(2));
            const subtotalWithVat = Number((singleItemPriceWithVat * qty).toFixed(2));

            // Check if this item is already added to cart
            const cartMatch = cartItems.find(
              (c) => c.agenda.id === agenda.id && c.colore.nome === colore.nome
            );
            const isAddedToCart = !!cartMatch;
            const isCartQtyMatching = cartMatch?.qty === qty;

            const coverResult = resolveAgendaCoverImage(agenda, colore, availableCoverFiles);

            return (
              <div key={id} className="p-4 sm:p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 hover:bg-slate-50/40 transition">
                {/* 1. Thumbnail image and primary specs */}
                <div className="flex items-center gap-4 min-w-[280px] lg:max-w-sm">
                  <div
                    onClick={() => onOpenCatalogPage?.(agenda, colore)}
                    className="relative cursor-pointer group/thumb shrink-0"
                    title="Clicca per aprire la pagina del catalogo PDF di questa agenda"
                  >
                    {coverResult.url ? (
                      <img
                        src={coverResult.url}
                        alt={`${agenda.nome} ${colore.nome}`}
                        className="w-16 h-20 sm:w-20 sm:h-24 object-contain rounded-xl bg-slate-50 border border-slate-200/80 group-hover/thumb:border-amber-400 p-1 shrink-0 shadow-sm transition"
                      />
                    ) : (
                      <div
                        className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl border border-slate-200 group-hover/thumb:border-amber-400 shadow-xs shrink-0 flex items-center justify-center transition"
                        style={{ backgroundColor: colore.hex }}
                      >
                        <span className="text-[10px] font-mono font-bold text-white/95 uppercase drop-shadow-sm">
                          2027
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/0 group-hover/thumb:bg-slate-900/20 rounded-xl transition flex items-center justify-center pointer-events-none">
                      <span className="opacity-0 group-hover/thumb:opacity-100 transition text-[9px] font-bold bg-slate-900/90 text-amber-300 px-1.5 py-0.5 rounded shadow">
                        PDF
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono uppercase">
                        {agenda.codice}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-white shadow-3xs" style={{ borderColor: colore.hex + '40' }}>
                        <span className="w-2 h-2 rounded-full border border-black/10" style={{ backgroundColor: colore.hex }} />
                        <span className="text-slate-700">{colore.nome}</span>
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                      {agenda.nome}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Dim: {agenda.dimensioniCm} • {agenda.layout} • {agenda.pagine} pag.
                    </p>
                    <p className="text-[10px] font-bold text-slate-500">
                      Materiale: <span className="text-slate-700">{agenda.copertina}</span>
                    </p>
                  </div>
                </div>

                {/* 2. Live Pricing details based on selected quantity */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-start gap-4 lg:gap-12 flex-1">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Prezzo Unitario
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900">
                        € {singleItemPriceWithVat.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">/pz</span>
                      <span className="text-[10px] text-slate-400 font-medium">(Iva incl.)</span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      {getTierDiscountLabel(qty)}
                    </div>
                  </div>

                  {/* 3. Interactive Quantity Counter (Sempre presente, minimo 1) */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Quantità Pezzi
                    </span>
                    <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(id, Math.max(1, qty - 1))}
                        disabled={qty <= 1}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center font-bold transition disabled:opacity-45 cursor-pointer shadow-3xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={qty}
                        onChange={(e) => onUpdateQty(id, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 h-8 text-center bg-transparent border-0 font-extrabold text-sm text-slate-900 focus:outline-none focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => onUpdateQty(id, qty + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center font-bold transition cursor-pointer shadow-3xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 4. Subtotal box */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Totale Riga (Iva incl.)
                    </span>
                    <span className="text-lg font-black text-[#9e2a3b] block">
                      € {subtotalWithVat.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* 5. Action Buttons (Aggiungi al Carrello, Personalizza, Rimuovi) */}
                <div className="flex flex-wrap sm:flex-row lg:flex-col items-center gap-2 lg:self-center shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 w-full sm:w-auto">
                  {isAddedToCart && isCartQtyMatching ? (
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(id)}
                      className="flex-1 sm:flex-none lg:w-44 h-10 px-4 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer hover:bg-emerald-100/70"
                      title="Rimuovi questo articolo dal carrello"
                    >
                      <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                      <span>✓ Nel Carrello</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAddToCart(item)}
                      className="flex-1 sm:flex-none lg:w-44 h-10 px-4 rounded-xl font-black text-xs bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm active:scale-97 cursor-pointer"
                      title={isAddedToCart ? "Aggiorna la quantità nel carrello" : "Aggiungi questo articolo al carrello"}
                    >
                      <ShoppingCart className="w-4 h-4 text-white" />
                      <span>{isAddedToCart ? 'Aggiorna Carrello' : 'Aggiungi al Carrello'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (!isAddedToCart || !isCartQtyMatching) {
                        onAddToCart(item);
                      }
                      onGoToPage('customize');
                    }}
                    className="flex-1 sm:flex-none lg:w-44 h-10 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white transition flex items-center justify-center gap-1.5 shadow-sm active:scale-97 cursor-pointer"
                    title="Personalizza le finiture per questa agenda"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Personalizza</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(id)}
                    className="h-10 px-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Elimina questa selezione dal confronto"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs font-bold">Rimuovi</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart info & Steps navigation buttons */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Stato del tuo ordine</span>
            <span className="text-sm font-black text-slate-800">
              Hai {cartItems.length} {cartItems.length === 1 ? "articolo nel carrello" : "articoli nel carrello"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => onGoToPage('catalog')}
            className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continua lo shopping</span>
          </button>

          <button
            onClick={() => onGoToPage('customize')}
            disabled={cartItems.length === 0}
            className={`px-6 py-3 rounded-xl font-black text-xs text-white transition flex items-center justify-center gap-2 shadow-md ${
              cartItems.length === 0
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-blue-600/15 cursor-pointer'
            }`}
          >
            <span>Procedi a Personalizzazione (Pagina 3)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
