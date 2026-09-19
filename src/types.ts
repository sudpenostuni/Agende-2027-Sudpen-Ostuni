export type PrintTechniqueId =
  | 'termoincisione'
  | 'stampa_caldo'
  | 'neutra';

export interface PrintTechnique {
  id: PrintTechniqueId;
  nome: string;
  descrizione: string;
  sovrapprezzoBase: number; // in euro per pezzo
  costoImpianto: number; // costo una tantum clichè/avviamento
  effettiDisponibili: string[];
  consigliatoPer: string;
}

export interface ColorOption {
  nome: string;
  hex: string;
  texture?: 'smooth' | 'grained' | 'canvas' | 'metallic' | 'matte';
  bandColor?: string;
  ribbonColor?: string;
  immagine?: string;
}

export type AgendaCategory = 'Giornaliere' | 'Settimanali' | 'Organizer e Portafoglio' | string;
export type AgendaAvailability = 'disponibile' | 'in_esaurimento' | 'esaurito';

export interface AgendaModel {
  id: string;
  codice: string;
  nome: string;
  sottotitolo: string;
  categoria: AgendaCategory;
  categoriaOrganizzata?: string;
  formato: string;
  dimensioniCm: string;
  layout: 'Giornaliera' | 'Settimanale' | 'Organizer' | 'Planning';
  copertina: string;
  pagine: number;
  carta: string;
  haElastico: boolean;
  haSegnalibro: boolean;
  haPortapenne: boolean;
  immagine: string;
  immagineInterno?: string;
  immaginiVariantiColore?: Record<string, string>;
  prezzoBaseUnitario: number; // prezzo da listino di vendita (imponibile)
  prezzoIvaInclusa?: number; // prezzo al pubblico iva inclusa
  prezzoAcquisto?: number; // prezzo d'acquisto all'ingrosso iva esclusa (dalla fattura)
  giacenza?: number; // giacenza di magazzino (quantità disponibile in pezzi)
  disponibile: boolean;
  statoDisponibilita: AgendaAvailability;
  colori: ColorOption[];
  caratteristiche: string[];
}

export type CustomPlacement = 'center' | 'bottom-right' | 'bottom-center' | 'top-right';
export type FontStyleOption = 'modern' | 'classic' | 'script' | 'technical';

export interface CustomerInfo {
  nome: string;
  azienda: string;
  piva: string;
  tel: string;
  email: string;
  citta: string;
  note: string;
}

export interface AgendaConfiguration {
  agenda: AgendaModel;
  colore: ColorOption;
  tecnica: PrintTechniqueId;
  testo: string;
  fontStyle: FontStyleOption;
  posizionamento: CustomPlacement;
  logoUrl: string | null;
  logoName: string | null;
  logoScale: number; // 0.6 to 1.4
  coloreStampa: string;
  qty: number;
  cliente: CustomerInfo;
  codiceOrdine: string;
  dataCreazione: string;
}
