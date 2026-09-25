import { AgendaAvailability } from '../types';

export interface VoceListino {
  /** ID univoco o identificativo modello */
  id: string;
  /** Codice articolo da catalogo */
  codice: string;
  /** Nome del modello e linea */
  nome: string;
  /** Formato / Dimensioni */
  formato: string;
  /** Prezzo di vendita al pubblico (€ IVA COMPRESA 22%) */
  prezzoVenditaIvaInclusa: number;
  /** Quantità disponibile in magazzino (pezzi) */
  giacenza: number;
  /** Stato disponibilità ('disponibile' | 'in_esaurimento' | 'esaurito') */
  statoDisponibilita?: AgendaAvailability;
}

// ============================================================================
// 1. FORMATO 9x14 — INTERNO SETTIMANALE
// ============================================================================
export const LISTINO_9x14_SETTIMANALE: VoceListino[] = [
  {
    id: 'sett-73226',
    codice: '73226',
    nome: 'Linea Zaira con elastico 73226',
    formato: '9 x 14 cm',
    prezzoVenditaIvaInclusa: 3.00,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'sett-72126',
    codice: '72126',
    nome: 'Linea Rubis con elastico 72126',
    formato: '9 x 14 cm',
    prezzoVenditaIvaInclusa: 3.00,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'sett-144',
    codice: '144',
    nome: 'Linea Madrid con elastico 144',
    formato: '9 x 14 cm',
    prezzoVenditaIvaInclusa: 3.00,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'sett-70126',
    codice: '70126',
    nome: 'Linea Nubia 70126',
    formato: '9 x 14 cm',
    prezzoVenditaIvaInclusa: 3.00,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  }
];

// ============================================================================
// 2. FORMATO 9x14 — INTERNO GIORNALIERO
// ============================================================================
export const LISTINO_9x14_GIORNALIERO: VoceListino[] = [
  {
    id: 'giorn-70826',
    codice: '70826',
    nome: 'Linea Rubis con elastico 70826',
    formato: '9 x 14 cm',
    prezzoVenditaIvaInclusa: 4.00,
    giacenza: 10,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-134',
    codice: '134',
    nome: 'Linea Madrid con elastico 134',
    formato: '9 x 14 cm',
    prezzoVenditaIvaInclusa: 4.00,
    giacenza: 10,
    statoDisponibilita: 'disponibile'
  }
];

// ============================================================================
// 3. FORMATO 12x18 — INTERNO GIORNALIERO
// ============================================================================
export const LISTINO_12_5x18_GIORNALIERO: VoceListino[] = [
  {
    id: 'giorn-70226',
    codice: '70226',
    nome: 'Linea Nubia 70226',
    formato: '12 x 18 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 6,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-73526',
    codice: '73526',
    nome: 'Linea Zaira con elastico 73526',
    formato: '12 x 18 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-71126',
    codice: '71126',
    nome: 'Linea Rubis con elastico 71126',
    formato: '12 x 18 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-143',
    codice: '143',
    nome: 'Linea Madrid con elastico 143 (12x18)',
    formato: '12 x 18 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 24,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-72126-c',
    codice: '72126-C',
    nome: 'Linea Rubis con elastico 72126-C',
    formato: '12 x 18 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  }
];

// ============================================================================
// 4. FORMATO 15x21 — INTERNO GIORNALIERO
// ============================================================================
export const LISTINO_15x21_GIORNALIERO: VoceListino[] = [
  {
    id: 'giorn-70426',
    codice: '70426',
    nome: 'Linea Nubia 70426',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 24,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-73326',
    codice: '73326',
    nome: 'Linea Zaira con elastico 73326',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 24,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-74726',
    codice: '74726',
    nome: 'Linea Emeri 74726',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 24,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-71226',
    codice: '71226',
    nome: 'Linea Opyra con elastico 71226',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-71926',
    codice: '71926',
    nome: 'Linea Felicia 71926',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-71026',
    codice: '71026',
    nome: 'Linea Rubis con elastico 71026',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 24,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-70726',
    codice: '70726',
    nome: 'Linea Amely 70726',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 7.50,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-143-15',
    codice: '143',
    nome: 'Linea Madrid con elastico 143 (15x21)',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 24,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-110',
    codice: '110',
    nome: 'Linea Spiralata 110',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 7.50,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-131',
    codice: '131',
    nome: 'Linea Madrid con elastico 131',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 24,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-140',
    codice: '140',
    nome: 'Linea interno a quadretti 140',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  }
];

// ============================================================================
// 5. FORMATO 17x24 — INTERNO GIORNALIERO
// ============================================================================
export const LISTINO_17x24_GIORNALIERO: VoceListino[] = [
  {
    id: 'giorn-70526',
    codice: '70526',
    nome: 'Linea Nubia 70526',
    formato: '17 x 24 cm',
    prezzoVenditaIvaInclusa: 7.50,
    giacenza: 6,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-75226',
    codice: '75226',
    nome: 'Linea Michi con elastico 75226',
    formato: '17 x 24 cm',
    prezzoVenditaIvaInclusa: 7.50,
    giacenza: 6,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-139',
    codice: '139',
    nome: 'Linea Madrid con elastico 139',
    formato: '17 x 24 cm',
    prezzoVenditaIvaInclusa: 7.50,
    giacenza: 6,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'giorn-137',
    codice: '137',
    nome: 'Linea interno a quadretti 137',
    formato: '17 x 24 cm',
    prezzoVenditaIvaInclusa: 7.50,
    giacenza: 6,
    statoDisponibilita: 'disponibile'
  }
];

// ============================================================================
// 6. FORMATO 17x24 — INTERNO SETTIMANALE
// ============================================================================
export const LISTINO_17x24_SETTIMANALE: VoceListino[] = [
  {
    id: 'sett-70626',
    codice: '70626',
    nome: 'Linea Nubia 70626',
    formato: '17 x 24 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 6,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'sett-73426',
    codice: '73426',
    nome: 'Linea Zaira con elastico 73426',
    formato: '17 x 24 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 6,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'sett-70326',
    codice: '70326',
    nome: 'Linea Amely 70326',
    formato: '17 x 24 cm',
    prezzoVenditaIvaInclusa: 7.50,
    giacenza: 6,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'sett-142',
    codice: '142',
    nome: 'Linea Madrid 142',
    formato: '17 x 24 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 6,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'sett-111',
    codice: '111',
    nome: 'Linea Spiralata 111',
    formato: '17 x 24 cm',
    prezzoVenditaIvaInclusa: 7.50,
    giacenza: 6,
    statoDisponibilita: 'disponibile'
  }
];

// ============================================================================
// 7. CATEGORIA ORGANIZER E PORTAFOGLIO
// ============================================================================
export const LISTINO_ORGANIZER_PORTAFOGLIO: VoceListino[] = [
  {
    id: 'port-124',
    codice: '124',
    nome: 'Linea Astuccio 124',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 13.00,
    giacenza: 8,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'port-121',
    codice: '121',
    nome: 'Linea Clip 121',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 16.00,
    giacenza: 10,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'port-125',
    codice: '125',
    nome: 'Linea Borsello 125',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 24.00,
    giacenza: 3,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'port-126',
    codice: '126',
    nome: 'Linea Portafoglio 126',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 19.00,
    giacenza: 6,
    statoDisponibilita: 'disponibile'
  },
  {
    id: 'port-128',
    codice: '128',
    nome: 'Linea Business 128',
    formato: '15 x 21 cm',
    prezzoVenditaIvaInclusa: 24.00,
    giacenza: 4,
    statoDisponibilita: 'disponibile'
  }
];

// ============================================================================
// 8. FORMATO PLANNING 10x30 — INTERNO SETTIMANALE
// ============================================================================
export const LISTINO_PLANNING_10x30_SETTIMANALE: VoceListino[] = [
  {
    id: 'sett-148',
    codice: '148',
    nome: 'Linea Madrid 148',
    formato: '10 x 30 cm',
    prezzoVenditaIvaInclusa: 5.00,
    giacenza: 12,
    statoDisponibilita: 'disponibile'
  }
];

// ============================================================================
// TABELLA GENERALE COMPLETA & MAPPA VELOCE PER CODICE/ID
// ============================================================================
export const TABELLA_LISTINO_FORMATI = {
  '9x14_settimanale': LISTINO_9x14_SETTIMANALE,
  '9x14_giornaliero': LISTINO_9x14_GIORNALIERO,
  '12_5x18_giornaliero': LISTINO_12_5x18_GIORNALIERO,
  '15x21_giornaliero': LISTINO_15x21_GIORNALIERO,
  '17x24_giornaliero': LISTINO_17x24_GIORNALIERO,
  '17x24_settimanale': LISTINO_17x24_SETTIMANALE,
  'organizer_portafoglio': LISTINO_ORGANIZER_PORTAFOGLIO,
  'planning_10x30_settimanale': LISTINO_PLANNING_10x30_SETTIMANALE
};

export const TUTTE_VOCI_LISTINO: VoceListino[] = [
  ...LISTINO_9x14_SETTIMANALE,
  ...LISTINO_9x14_GIORNALIERO,
  ...LISTINO_12_5x18_GIORNALIERO,
  ...LISTINO_15x21_GIORNALIERO,
  ...LISTINO_17x24_GIORNALIERO,
  ...LISTINO_17x24_SETTIMANALE,
  ...LISTINO_ORGANIZER_PORTAFOGLIO,
  ...LISTINO_PLANNING_10x30_SETTIMANALE
];

/**
 * Mappa di ricerca per ID e per Codice Articolo
 */
export const LISTINO_MAP_PER_ID = new Map<string, VoceListino>();
export const LISTINO_MAP_PER_CODICE = new Map<string, VoceListino>();

TUTTE_VOCI_LISTINO.forEach((voce) => {
  LISTINO_MAP_PER_ID.set(voce.id, voce);
  // Se non già presente (es. 143 esiste sia in 12x18 che in 15x21, la ricerca per id è prioritaria)
  if (!LISTINO_MAP_PER_CODICE.has(voce.codice)) {
    LISTINO_MAP_PER_CODICE.set(voce.codice, voce);
  }
});
