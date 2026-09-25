import React, { useState } from 'react';
import { AgendaModel, ColorOption } from '../types';
import { TECNICHE_STAMPA, calculateQuotation } from '../data/catalog';
import html2canvas from 'html2canvas-pro';
import confetti from 'canvas-confetti';
import {
  Download,
  Printer,
  Copy,
  Check,
  Calendar,
  FileCheck,
  MessageCircle,
  Camera,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Percent,
  User,
  Building,
  FileEdit,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface CartItem {
  id: string;
  agenda: AgendaModel;
  colore: ColorOption;
  qty: number;
}

interface OrderSheetProps {
  cartItems: CartItem[];
  tecnica: 'neutra' | 'termoincisione' | 'stampa_caldo';
  coloreStampa: string;
  testoPersonalizzato?: string;
  stileCarattere?: string;
  usaLogo?: boolean;
  cliente: {
    nome: string;
    azienda: string;
    piva: string;
    tel: string;
    email: string;
    citta: string;
    note: string;
  };
  onChangeCliente: (field: string, value: string) => void;
  codiceOrdine: string;
  dataCreazione: string;
  onUpdateCartQty: (id: string, qty: number) => void;
}

const SUDPEN_WA = '393917972545';
const SUDPEN_EMAIL = 'sudpenostuni@gmail.com';
const SUDPEN_PHONE = '0831 331209';
const SUDPEN_ADDRESS = 'Via Cavaliere Vittorio Veneto 56, 72017 Ostuni (BR)';

export const OrderSheet: React.FC<OrderSheetProps> = ({
  cartItems,
  tecnica,
  coloreStampa,
  testoPersonalizzato = '',
  stileCarattere = 'Script Corsivo',
  usaLogo = false,
  cliente,
  onChangeCliente,
  codiceOrdine,
  dataCreazione,
  onUpdateCartQty
}) => {
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const tecnicaObj = TECNICHE_STAMPA.find((t) => t.id === tecnica) || TECNICHE_STAMPA[0];

  // Calculate quotations for each cart item
  const itemQuotations = cartItems.map((item) => {
    return {
      item,
      quote: calculateQuotation(item.agenda, tecnica, item.qty, testoPersonalizzato, usaLogo)
    };
  });

  // Grand totals summary
  const grandTotals = itemQuotations.reduce(
    (acc, current) => {
      return {
        subtotalePezzi: acc.subtotalePezzi + current.quote.subtotalePezzi,
        totaleImponibile: acc.totaleImponibile + current.quote.totaleImponibile,
        iva22: acc.iva22 + current.quote.iva22,
        totaleIvaInclusa: acc.totaleIvaInclusa + current.quote.totaleIvaInclusa
      };
    },
    { subtotalePezzi: 0, totaleImponibile: 0, iva22: 0, totaleIvaInclusa: 0 }
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Download PNG using html2canvas
  const downloadPNG = async () => {
    const sheetElement = document.getElementById('scheda-ordine');
    if (!sheetElement) return;

    try {
      setIsGeneratingPng(true);
      showToast('Generazione scheda grafica ad alta risoluzione in corso...');

      const canvas = await html2canvas(sheetElement, {
        scale: 2, // High DPI
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Scheda-Tecnica-${codiceOrdine}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });

      showToast('Scheda PNG scaricata con successo!');
    } catch (err) {
      console.error('Errore durante downloadPNG:', err);
      showToast('Errore durante la generazione immagine.');
    } finally {
      setIsGeneratingPng(false);
    }
  };

  // 2. Clipboard Screenshot
  const copyAndSaveScreenshot = async () => {
    const sheetElement = document.getElementById('scheda-ordine');
    if (!sheetElement) return;

    try {
      setIsGeneratingPng(true);
      showToast('Cattura screenshot della scheda d\'ordine in corso...');

      const canvas = await html2canvas(sheetElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      let copiedToClipboard = false;
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            copiedToClipboard = true;
          }
        } catch (clipErr) {
          console.warn('Clipboard writeImage not permitted:', clipErr);
        }
      }

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Sudpen-Bozza-Carrello-${codiceOrdine}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });

      if (copiedToClipboard) {
        showToast('Scheda copiata negli appunti e scaricata! Ora puoi incollarla direttamente su WhatsApp.');
      } else {
        showToast('Screenshot salvato sul dispositivo! Ora puoi allegarlo al messaggio WhatsApp per Sudpen.');
      }
    } catch (err) {
      console.error('Errore screenshot:', err);
      showToast('Screenshot pronto! Puoi inviare i dettagli via WhatsApp.');
    } finally {
      setIsGeneratingPng(false);
    }
  };

  // 3. Send WhatsApp
  const sendWhatsApp = () => {
    let itemsText = '';
    itemQuotations.forEach(({ item, quote }, index) => {
      itemsText += `${index + 1}) 📖 *${item.agenda.nome}* (Cod. ${item.agenda.codice})\n` +
                   `• Colore: ${item.colore.nome}\n` +
                   `• Qtà: ${item.qty} pz • Prezzo base agenda: €${quote.prezzoAgendaUnitario.toFixed(2)}/pz\n` +
                   (quote.prezzoStampaUnitario > 0 ? `• Costo Personalizzazione: €${quote.prezzoStampaUnitario.toFixed(2)}/pz\n` : '') +
                   `• Prezzo Finito: €${quote.prezzoUnitario.toFixed(2)}/pz • Subtotale: €${quote.subtotalePezzi.toFixed(2)}\n\n`;
    });

    const personalizationDetails = 
      (testoPersonalizzato ? `✍️ *Testo da incidere:* "${testoPersonalizzato}" (Stile: ${stileCarattere})\n` : '') +
      (usaLogo ? `🏢 *Logo Aziendale:* Incluso (+5,00 €/pz)\n` : '');

    const text = encodeURIComponent(
      `*SUDPEN OSTUNI - ORDINE & PREVENTIVO AGENDA 2027*\n` +
      `----------------------------------------\n` +
      `📄 *Codice Scheda:* ${codiceOrdine}\n` +
      `📅 *Data Richiesta:* ${dataCreazione}\n\n` +
      `🛠️ *FINITURE GENERALI:* ${tecnicaObj.nome}${tecnica === 'stampa_caldo' ? ` (${coloreStampa})` : ''}\n` +
      personalizationDetails + `\n` +
      `🛒 *ARTICOLI NEL CARRELLO:*\n` +
      itemsText +
      `💰 *RIEPILOGO ECONOMICO*\n` +
      `• Imponibile Totale: €${grandTotals.totaleImponibile.toFixed(2)}\n` +
      `• Totale IVA Inclusa (22%): €${grandTotals.totaleIvaInclusa.toFixed(2)}\n` +
      `• Impianto stampa / clichè: OMAGGIO\n\n` +
      `----------------------------------------\n` +
      `📍 *Ritiro:* Negozio Sudpen Ostuni (Via Cav. Vittorio Veneto 56) o spedizione.\n` +
      `Ti invio anche lo screenshot della bozza! Resto in attesa della conferma.`
    );

    window.open(`https://wa.me/${SUDPEN_WA}?text=${text}`, '_blank');
  };

  // 4. Send Email
  const sendEmail = () => {
    let itemsText = '';
    itemQuotations.forEach(({ item, quote }, index) => {
      itemsText += `${index + 1}) Articolo: ${item.agenda.nome} (${item.agenda.codice})\n` +
                   `   - Colore: ${item.colore.nome}\n` +
                   `   - Formato: ${item.agenda.formato} - ${item.agenda.dimensioniCm}\n` +
                   `   - Copertina: ${item.agenda.copertina}\n` +
                   `   - Quantità: ${item.qty} pezzi (Agenda Base: ${quote.prezzoAgendaUnitario.toFixed(2)} EUR | Personalizzazione: ${quote.prezzoStampaUnitario.toFixed(2)} EUR / pz)\n` +
                   `   - Prezzo Finito: ${quote.prezzoUnitario.toFixed(2)} EUR / pz\n` +
                   `   - Subtotale: EUR ${quote.subtotalePezzi.toFixed(2)}\n\n`;
    });

    const personalizationDetails = 
      (testoPersonalizzato ? `Testo da incidere: "${testoPersonalizzato}" (Stile: ${stileCarattere})\n` : '') +
      (usaLogo ? `Logo Aziendale: Incluso (+5,00 EUR / pz)\n` : '');

    const subject = encodeURIComponent(`Preventivo Agende 2027 Sudpen - ${codiceOrdine}`);
    const body = encodeURIComponent(
      `Spettabile Sudpen Tipografia Ostuni,\n\n` +
      `Di seguito i dettagli tecnici per il preventivo di produzione delle agende:\n\n` +
      `RIFERIMENTO SCHEDA TECNICA: ${codiceOrdine}\n` +
      `Data richiesta: ${dataCreazione}\n\n` +
      `DATI PERSONALIZZAZIONE:\n` +
      `- Tecnica di Stampa: ${tecnicaObj.nome}${tecnica === 'stampa_caldo' ? ` (${coloreStampa})` : ''}\n` +
      personalizationDetails + `\n` +
      `ARTICOLI SCELTI:\n` +
      itemsText +
      `RIEPILOGO ECONOMICO:\n` +
      `- Imponibile totale: €${grandTotals.totaleImponibile.toFixed(2)}\n` +
      `- Totale IVA inclusa (22%): €${grandTotals.totaleIvaInclusa.toFixed(2)}\n\n` +
      `Resto in attesa della Vostra conferma e della bozza esecutiva di stampa.\n` +
      `Cordiali saluti,\n`
    );

    window.location.href = `mailto:${SUDPEN_EMAIL}?subject=${subject}&body=${body}`;
  };

  const copySummary = () => {
    let summaryText = `SCHEDA PREVENTIVO AGENDE SUDPEN 2027 - ${codiceOrdine}\n`;
    itemQuotations.forEach(({ item, quote }) => {
      summaryText += `- ${item.agenda.nome} (${item.colore.nome}) x${item.qty} pz: €${quote.subtotalePezzi.toFixed(2)} (Unitario finito: €${quote.prezzoUnitario.toFixed(2)})\n`;
    });
    if (testoPersonalizzato) {
      summaryText += `Testo: "${testoPersonalizzato}" (${stileCarattere})\n`;
    }
    if (usaLogo) {
      summaryText += `Logo Aziendale: Incluso\n`;
    }
    summaryText += `Finiture: ${tecnicaObj.nome}${tecnica === 'stampa_caldo' ? ` (${coloreStampa})` : ''}\n`;
    summaryText += `Prezzo Totale (IVA incl.): €${grandTotals.totaleIvaInclusa.toFixed(2)}\n`;
    summaryText += `Sudpen Ostuni - WA: +39 391 797 2545`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      showToast('Riepilogo tecnico copiato negli appunti!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Carrello vuoto</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">Aggiungi articoli al carrello per poter generare il preventivo.</p>
      </div>
    );
  }

  return (
    <div id="scheda-tecnica-section" className="py-12 scroll-mt-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* --- SCHEDA GRAFICA DI PREVENTIVO (#scheda-ordine) --- */}
        <div
          id="scheda-ordine"
          className="bg-white p-6 sm:p-10 border border-slate-300 rounded-3xl shadow-xl relative overflow-hidden transition-all text-slate-900"
          style={{ maxWidth: '820px', margin: '0 auto' }}
        >
          {/* Watermark */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 -rotate-45 translate-x-16 -translate-y-16 pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  AGENDE <span className="text-[#9e2a3b]">SUDPEN 2027</span>
                </span>
                <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                  Scheda Preventivo Ufficiale
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Data emissione: <strong className="text-slate-900">{dataCreazione}</strong>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                Codice Univoco Ordine
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                {codiceOrdine}
              </span>
            </div>
          </div>

          {/* Sezione Committente rimossa come richiesto - checkout tramite condivisione */}

          {/* Technical and Customization details summary */}
          <div className="border border-slate-200 rounded-2xl p-4 mb-6 text-xs bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Finiture di Personalizzazione</span>
              <span className="font-extrabold text-sm text-slate-900 block mt-0.5">{tecnicaObj.nome}</span>
              {tecnica === 'stampa_caldo' && (
                <span className="inline-flex items-center gap-1.5 font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md mt-1 shadow-3xs">
                  Colore Lamina: {coloreStampa || 'Oro'}
                </span>
              )}
            </div>
            <div className="text-right sm:text-right">
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Clichè e Impianto</span>
              <span className="text-emerald-700 font-extrabold text-xs block bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md mt-0.5">
                OMAGGIO SUDPEN
              </span>
            </div>
          </div>

          {/* Line items table summary */}
          <div className="mb-6 border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider grid grid-cols-12 gap-2">
              <div className="col-span-6 sm:col-span-7">Dettaglio Articolo</div>
              <div className="col-span-3 sm:col-span-2 text-center">Quantità</div>
              <div className="col-span-3 text-right">Totale Riga (Iva incl)</div>
            </div>
            
            <div className="divide-y divide-slate-100 bg-white">
              {itemQuotations.map(({ item, quote }) => (
                <div key={item.id} className="p-4 text-xs grid grid-cols-12 gap-2 items-center hover:bg-slate-50/20">
                  <div className="col-span-6 sm:col-span-7 space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-[13px]">{item.agenda.nome}</h4>
                    <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-500 font-semibold mb-1.5">
                      <span className="font-mono bg-slate-100 border border-slate-200/60 px-1.5 py-0.2 rounded">
                        Cod. {item.agenda.codice}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: item.colore.hex }} />
                        <span>{item.colore.nome}</span>
                      </span>
                      <span>•</span>
                      <span>{item.agenda.dimensioniCm}</span>
                    </div>

                    {/* Detailed customization cost breakdown */}
                    <div className="text-[10px] bg-slate-50 border border-slate-200/50 rounded-xl p-2.5 space-y-1">
                      <div className="flex justify-between text-slate-500">
                        <span>Prezzo base agenda:</span>
                        <span className="font-extrabold text-slate-700">€ {quote.prezzoAgendaUnitario.toFixed(2)}</span>
                      </div>
                      
                      {quote.prezzoStampaUnitario > 0 ? (
                        <div className="border-t border-slate-200/60 pt-1 mt-1 space-y-1">
                          <div className="flex justify-between text-slate-500">
                            <span>Servizio Personalizzazione:</span>
                            <span className="font-extrabold text-blue-600">€ {quote.prezzoStampaUnitario.toFixed(2)}</span>
                          </div>
                          <div className="text-[9px] text-slate-400 leading-normal bg-white p-1 rounded border border-slate-100 space-y-0.5">
                            {testoPersonalizzato && (
                              <div>• Testo: <strong className="text-slate-600">"{testoPersonalizzato}"</strong> ({stileCarattere}) [Min 4,00€ {testoPersonalizzato.length > 20 ? `+ ${testoPersonalizzato.length - 20} car. eccedenti` : ""}]</div>
                            )}
                            {usaLogo && (
                              <div>• Riproduzione Logo Aziendale [+5,00€]</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="border-t border-slate-200/60 pt-1 mt-1 text-[9px] text-slate-400">
                          Senza personalizzazione aggiunta
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-3 sm:col-span-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={item.qty}
                        onChange={(e) => onUpdateCartQty(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-14 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded py-0.5 text-center font-bold text-slate-900 transition"
                      />
                      <span className="text-[10px] text-slate-400 font-bold">pz</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">({quote.prezzoUnitario.toFixed(2)} €/pz finito)</span>
                  </div>
                  
                  <div className="col-span-3 text-right font-bold text-slate-900 text-sm">
                    € {quote.subtotalePezzi.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 text-xs space-y-2 bg-slate-50/50 border-t border-slate-200">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Avviamento Macchine e Clichè Stampa una tantum</span>
                <span className="font-extrabold text-emerald-600">Gratuito</span>
              </div>
              <div className="border-t border-slate-200/60 pt-2 flex justify-between text-slate-900 font-bold">
                <span>Totale Imponibile Merce:</span>
                <span>€ {grandTotals.totaleImponibile.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[10px] font-semibold">
                <span>Imposta I.V.A. di Legge (22%):</span>
                <span>€ {grandTotals.iva22.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-base font-black text-blue-700">
                <span>TOTALE PREVENTIVO (IVA INCL.):</span>
                <span>€ {grandTotals.totaleIvaInclusa.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer of printout */}
          <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-3 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>SUDPEN Ostuni • Tipografia, Stampa & Cartoleria • Via Cav. Vittorio Veneto 56</span>
            <span className="font-mono">Generato il {dataCreazione} • ID Preventivo: {codiceOrdine}</span>
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <button
            type="button"
            onClick={sendWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl font-bold flex flex-col items-center justify-center shadow-lg shadow-emerald-600/20 hover:shadow-xl transition active:scale-95 cursor-pointer text-center"
          >
            <MessageCircle className="w-6 h-6 mb-1.5 fill-white text-emerald-600" />
            <span className="text-sm font-bold">Invia su WhatsApp</span>
            <span className="text-[10px] text-emerald-100 font-normal">Invia a Sudpen Ostuni (+39 391 7972545)</span>
          </button>

          <button
            type="button"
            onClick={copyAndSaveScreenshot}
            disabled={isGeneratingPng}
            className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-2xl font-bold flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition active:scale-95 cursor-pointer disabled:opacity-50 text-center"
          >
            {isGeneratingPng ? (
              <Loader2 className="w-6 h-6 mb-1.5 animate-spin text-amber-400" />
            ) : (
              <Camera className="w-6 h-6 mb-1.5 text-amber-400" />
            )}
            <span className="text-sm font-bold">Copia / Salva Screenshot</span>
            <span className="text-[10px] text-slate-400 font-normal">Copia negli appunti per allegare al volo</span>
          </button>

          <button
            type="button"
            onClick={downloadPNG}
            disabled={isGeneratingPng}
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 p-4 rounded-2xl font-bold flex flex-col items-center justify-center shadow-sm hover:shadow-md transition active:scale-95 cursor-pointer disabled:opacity-50 text-center"
          >
            <Download className="w-6 h-6 mb-1.5 text-blue-600" />
            <span className="text-sm font-bold">Scarica Scheda PNG</span>
            <span className="text-[10px] text-slate-500 font-normal">Documento grafico ad alta risoluzione</span>
          </button>

          <button
            type="button"
            onClick={sendEmail}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold flex flex-col items-center justify-center shadow-lg shadow-blue-600/20 hover:shadow-xl transition active:scale-95 cursor-pointer text-center"
          >
            <FileCheck className="w-6 h-6 mb-1.5 text-blue-200" />
            <span className="text-sm font-bold">Invia via Email</span>
            <span className="text-[10px] text-blue-100 font-normal">Richiesta preventivo a sudpenostuni@gmail.com</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 mt-6 text-xs font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => window.print()}
            className="hover:text-slate-900 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Stampa Scheda A4</span>
          </button>

          <a
            href="tel:+390831331209"
            className="hover:text-emerald-700 flex items-center gap-1.5 transition"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Chiama Sudpen: 0831 331209</span>
          </a>

          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Via Cavaliere Vittorio Veneto 56, Ostuni (BR)</span>
          </span>
        </div>
      </div>
    </div>
  );
};
