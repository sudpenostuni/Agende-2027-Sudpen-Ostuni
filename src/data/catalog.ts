import { AgendaModel, PrintTechnique } from '../types';
import { LISTA_AGENDE_DEFAULT } from './agendasList';
import { TUTTI_MODELLI_ORGANIZZATI, CATEGORIE_ORGANIZZATE, OrganizedCategory, getAgendaHeaderDisplay } from './organizedCategories';

export { CATEGORIE_ORGANIZZATE, TUTTI_MODELLI_ORGANIZZATI, getAgendaHeaderDisplay };
export type { OrganizedCategory };

// Unisci i modelli organizzati come prioritari, seguiti dagli altri modelli ancora da categorizzare
const organizedCodes = new Set(TUTTI_MODELLI_ORGANIZZATI.map(m => m.codice));
const remainingModels = LISTA_AGENDE_DEFAULT.filter(m => !organizedCodes.has(m.codice) && m.codice !== '134' && m.codice !== '143').map(m => ({
  ...m,
  categoriaOrganizzata: 'Altri Formati & Planning'
}));

export const LISTA_UNIFICATA_AGENDE: AgendaModel[] = [
  ...TUTTI_MODELLI_ORGANIZZATI,
  ...remainingModels
];

const STORAGE_KEY = 'agendapro_custom_catalog_v6';

export function loadStoredCatalog(): AgendaModel[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return LISTA_UNIFICATA_AGENDE.map((def) => {
          const matched = parsed.find((p: AgendaModel) => p.id === def.id || p.codice === def.codice);
          if (matched) {
            return {
              ...def,
              prezzoBaseUnitario: typeof matched.prezzoBaseUnitario === 'number' ? matched.prezzoBaseUnitario : def.prezzoBaseUnitario,
              prezzoIvaInclusa: typeof matched.prezzoIvaInclusa === 'number' ? matched.prezzoIvaInclusa : def.prezzoIvaInclusa,
              giacenza: typeof matched.giacenza === 'number' ? matched.giacenza : def.giacenza,
              statoDisponibilita: matched.statoDisponibilita || def.statoDisponibilita,
              disponibile: matched.disponibile !== undefined ? matched.disponibile : def.disponibile,
              immagine: def.immagine,
              immagineInterno: def.immagineInterno
            };
          }
          return def;
        });
      }
    }
  } catch (e) {
    console.error('Errore nel caricamento del catalogo salvato', e);
  }
  return LISTA_UNIFICATA_AGENDE;
}

export function saveStoredCatalog(models: AgendaModel[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
  } catch (e) {
    console.error('Errore nel salvataggio del catalogo', e);
  }
}

export function resetStoredCatalog(): AgendaModel[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Errore nel reset del catalogo', e);
  }
  return LISTA_UNIFICATA_AGENDE;
}

export const CATALOGO_AGENDE: AgendaModel[] = LISTA_UNIFICATA_AGENDE;

export interface CustomColorOption {
  nome: string;
  hex: string;
  categoria: 'metallici' | 'pastello';
}

export const COLORI_PERSONALIZZAZIONE: CustomColorOption[] = [
  // Riflessi metallici classici
  { nome: 'Oro', hex: '#D4AF37', categoria: 'metallici' },
  { nome: 'Argento', hex: '#C0C0C0', categoria: 'metallici' },
  { nome: 'Bronzo', hex: '#CD7F32', categoria: 'metallici' },
  { nome: 'Rosa Gold', hex: '#B76E79', categoria: 'metallici' },
  { nome: 'Verde Metal', hex: '#2E8B57', categoria: 'metallici' },
  { nome: 'Rosso Metal', hex: '#B22222', categoria: 'metallici' },
  // Tinte pastello
  { nome: 'Bianco', hex: '#FFFFFF', categoria: 'pastello' },
  { nome: 'Nero', hex: '#000000', categoria: 'pastello' },
  { nome: 'Lilla', hex: '#D8BFD8', categoria: 'pastello' },
  { nome: 'Blu', hex: '#0000FF', categoria: 'pastello' }
];

export const TECNICHE_STAMPA: PrintTechnique[] = [
  {
    id: 'termoincisione',
    nome: 'Incisione a caldo',
    descrizione: 'Incisione profonda a caldo con calore e pressione. Elegante e duratura tono su tono.',
    sovrapprezzoBase: 4.0,
    costoImpianto: 0,
    effettiDisponibili: ['Incisione profonda', 'Finitura di pregio', 'Nessuna pellicola colore'],
    consigliatoPer: 'Copertine in similpelle e cuoio'
  },
  {
    id: 'stampa_caldo',
    nome: 'Stampa a caldo',
    descrizione: 'Stampa a caldo con pellicola metallica o pastello per testi e loghi brillanti.',
    sovrapprezzoBase: 4.0,
    costoImpianto: 0,
    effettiDisponibili: ['Oro/Argento metallico', 'Bronzo/Rosa Gold', 'Tinte pastello coprenti'],
    consigliatoPer: 'Tutte le copertine'
  },
  {
    id: 'neutra',
    nome: 'Copertina Neutra (Senza personalizzazione)',
    descrizione: 'Fornitura dell\'agenda pulita senza marchi aggiuntivi.',
    sovrapprezzoBase: 0,
    costoImpianto: 0,
    effettiDisponibili: ['Zero personalizzazione esterna'],
    consigliatoPer: 'Campioni o regali neutri'
  }
];

// Calculation of tiered pricing
export function getDiscountMultiplier(qty: number): number {
  return 1.0;
}

export function calculateQuotation(
  agenda: AgendaModel,
  tecnicaId: string,
  qty: number,
  customText?: string,
  hasLogo?: boolean | null
) {
  const discountMultiplier = getDiscountMultiplier(qty);
  
  // Prezzo agenda scontato per quantità (sempre 1.0 multiplier ora)
  const prezzoAgendaUnitario = agenda.prezzoBaseUnitario * discountMultiplier;
  
  // Calcolo costo personalizzazione per pezzo (con spazi inclusi):
  // Minimo di 4 € per testo, oltre il 20esimo carattere si aggiunge 0.10 € per carattere.
  // Logo sempre 5 €.
  let prezzoStampaUnitario = 0;
  if (customText && customText.length > 0) {
    prezzoStampaUnitario += 4.0;
    if (customText.length > 20) {
      prezzoStampaUnitario += (customText.length - 20) * 0.10;
    }
  }
  if (hasLogo) {
    prezzoStampaUnitario += 5.0;
  }
  
  const prezzoUnitario = Number((prezzoAgendaUnitario + prezzoStampaUnitario).toFixed(2));
  const subtotalePezzi = Number((prezzoUnitario * qty).toFixed(2));
  
  // Costo clichè / impianto stampa una tantum (ora sempre 0 o gratuito)
  const costoImpianto = 0;
  const impiantoGratuito = true;
  
  const totaleImponibile = Number((subtotalePezzi + costoImpianto).toFixed(2));
  const iva22 = Number((totaleImponibile * 0.22).toFixed(2));
  const totaleIvaInclusa = Number((totaleImponibile + iva22).toFixed(2));

  return {
    prezzoAgendaUnitario,
    prezzoStampaUnitario,
    prezzoUnitario,
    subtotalePezzi,
    costoImpianto,
    impiantoGratuito,
    totaleImponibile,
    iva22,
    totaleIvaInclusa,
    scontoPercentuale: 0
  };
}

export const SAMPLE_LOGOS = [
  {
    id: 'sudpen',
    nome: 'SUDPEN - Ostuni',
    svg: `<svg viewBox="0 0 200 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 40L28 14L36 14L20 40H12Z" fill="currentColor"/>
      <circle cx="34" cy="38" r="4" fill="currentColor"/>
      <text x="46" y="28" font-size="18" font-family="Plus Jakarta Sans, sans-serif" font-weight="900" letter-spacing="1">SUDPEN</text>
      <text x="46" y="42" font-size="9" font-family="Plus Jakarta Sans, sans-serif" font-weight="600" letter-spacing="2" opacity="0.8">OSTUNI • DAL 1983</text>
    </svg>`
  },
  {
    id: 'studio-legal',
    nome: 'Studio Legale & Partners',
    svg: `<svg viewBox="0 0 200 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 8L15 28H35L25 8Z" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M25 28V48M15 48H35" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="15" cy="36" r="3" fill="currentColor"/>
      <circle cx="35" cy="36" r="3" fill="currentColor"/>
      <text x="50" y="27" font-size="16" font-family="Cinzel, serif" font-weight="700" letter-spacing="1">LEX & PARTNERS</text>
      <text x="50" y="42" font-size="9" font-family="Plus Jakarta Sans, sans-serif" font-weight="500" letter-spacing="3" opacity="0.8">STUDIO ASSOCIATO</text>
    </svg>`
  },
  {
    id: 'tech-corp',
    nome: 'Nexus Ingegneria',
    svg: `<svg viewBox="0 0 200 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,12 34,12 28,48 6,48" stroke="currentColor" stroke-width="2" fill="none"/>
      <polygon points="22,18 42,18 36,42 16,42" fill="currentColor" opacity="0.3"/>
      <text x="52" y="28" font-size="17" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" letter-spacing="0.5">NEXUS</text>
      <text x="52" y="42" font-size="9" font-family="Plus Jakarta Sans, sans-serif" font-weight="600" letter-spacing="2" opacity="0.85">ENGINEERING GROUP</text>
    </svg>`
  },
  {
    id: 'medical-care',
    nome: 'Medica Polifunzionale',
    svg: `<svg viewBox="0 0 200 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="12" width="8" height="32" rx="2" fill="currentColor"/>
      <rect x="8" y="24" width="32" height="8" rx="2" fill="currentColor"/>
      <circle cx="24" cy="28" r="18" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="2 3"/>
      <text x="52" y="27" font-size="16" font-family="Plus Jakarta Sans, sans-serif" font-weight="700">POLIMEDICA</text>
      <text x="52" y="42" font-size="9" font-family="Plus Jakarta Sans, sans-serif" font-weight="500" letter-spacing="2" opacity="0.8">CENTRO SPECIALISTICO</text>
    </svg>`
  }
];
