import { AgendaModel, ColorOption } from '../types';

export const COLOR_PRESETS: Record<string, ColorOption> = {
  nero: { nome: 'Nero 02', hex: '#18181b', texture: 'smooth', ribbonColor: '#09090b', bandColor: '#18181b' },
  rosso: { nome: 'Rosso 03', hex: '#dc2626', texture: 'smooth', ribbonColor: '#991b1b', bandColor: '#dc2626' },
  verde: { nome: 'Verde 04', hex: '#15803d', texture: 'smooth', ribbonColor: '#14532d', bandColor: '#15803d' },
  blu: { nome: 'Blu 05', hex: '#1e40af', texture: 'smooth', ribbonColor: '#1e3a8a', bandColor: '#1e40af' },
  arancione: { nome: 'Arancione 06', hex: '#ea580c', texture: 'smooth', ribbonColor: '#c2410c', bandColor: '#ea580c' },
  royal: { nome: 'Royal 07', hex: '#2563eb', texture: 'smooth', ribbonColor: '#1d4ed8', bandColor: '#2563eb' },
  bordeaux: { nome: 'Bordeaux 08', hex: '#881337', texture: 'smooth', ribbonColor: '#4c0519', bandColor: '#881337' },
  celeste: { nome: 'Celeste 09', hex: '#0ea5e9', texture: 'smooth', ribbonColor: '#0284c7', bandColor: '#0ea5e9' },
  bianco: { nome: 'Bianco 01', hex: '#f8fafc', texture: 'smooth', ribbonColor: '#64748b', bandColor: '#cbd5e1' },
  beige: { nome: 'Beige 09', hex: '#d4b996', texture: 'grained', ribbonColor: '#a88d6b', bandColor: '#d4b996' },
  bluNavy: { nome: 'Blu Navy 05', hex: '#0f172a', texture: 'smooth', ribbonColor: '#020617', bandColor: '#0f172a' },
  silver: { nome: 'Silver 09', hex: '#94a3b8', texture: 'metallic', ribbonColor: '#64748b', bandColor: '#94a3b8' },
  grigio: { nome: 'Grigio 13', hex: '#475569', texture: 'smooth', ribbonColor: '#334155', bandColor: '#475569' },
  tiffany: { nome: 'Verde Tiffany', hex: '#0d9488', texture: 'smooth', ribbonColor: '#115e59', bandColor: '#0d9488' },
  wenge: { nome: 'Wengè', hex: '#3b2219', texture: 'grained', ribbonColor: '#20120d', bandColor: '#3b2219' },
  verdeMela: { nome: 'Verde Mela', hex: '#65a30d', texture: 'smooth', ribbonColor: '#4d7c0f', bandColor: '#65a30d' },
  marrone: { nome: 'Marrone 10', hex: '#78350f', texture: 'grained', ribbonColor: '#451a03', bandColor: '#78350f' },
  naturale: { nome: 'Naturale', hex: '#e2d5c3', texture: 'grained', ribbonColor: '#bfa98e', bandColor: '#e2d5c3' }
};

export interface OrganizedCategory {
  id: string;
  titolo: string;
  sottotitolo: string;
  formatoLabel: string;
  tipoLayout: 'Settimanale' | 'Giornaliera' | 'Altro';
  modelli: AgendaModel[];
}

// -------------------------------------------------------------
// 1. CATEGORIA 9x14 - INTERNO SETTIMANALE
// -------------------------------------------------------------
export const MODELLI_9x14_SETTIMANALE: AgendaModel[] = [
  {
    id: 'sett-73226',
    codice: '73226',
    nome: 'Linea Zaira con elastico 73226',
    sottotitolo: 'Agenda tascabile con copertina rigida laminata ed elastico coordinato',
    categoria: 'Settimanali',
    categoriaOrganizzata: '9x14 - interno settimanale',
    formato: '9 x 14 cm',
    dimensioniCm: '9.0 x 14.0 cm',
    layout: 'Settimanale',
    copertina: 'Cartoncino laminato opaco con elastico',
    pagine: 128,
    carta: 'Carta bianca 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/73226.jpg',
    immagineInterno: '/agende/interiors/73226.jpg',
    prezzoIvaInclusa: 3.50,
    prezzoBaseUnitario: 2.87,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Chiusura con elastico abbinato', 'Interno settimanale 12 mesi', 'Segnalibro in raso'],
    colori: [
      COLOR_PRESETS.nero, COLOR_PRESETS.blu, COLOR_PRESETS.rosso, COLOR_PRESETS.arancione,
      COLOR_PRESETS.verde, COLOR_PRESETS.royal, COLOR_PRESETS.bianco
    ]
  },
  {
    id: 'sett-72126',
    codice: '72126',
    nome: 'Linea Rubis con elastico 72126',
    sottotitolo: 'Elegante agenda tascabile in morbida similpelle gommata con elastico',
    categoria: 'Settimanali',
    categoriaOrganizzata: '9x14 - interno settimanale',
    formato: '9 x 14 cm',
    dimensioniCm: '9.0 x 14.0 cm',
    layout: 'Settimanale',
    copertina: 'Similpelle Soft Rubis con elastico',
    pagine: 128,
    carta: 'Avorio 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/72126.jpg',
    immagineInterno: '/agende/interiors/72126.jpg',
    prezzoIvaInclusa: 3.50,
    prezzoBaseUnitario: 2.87,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Similpelle morbida termovirante', 'Bordo liscio con elastico piatto', 'Carta avorio riposante'],
    colori: [
      COLOR_PRESETS.blu, COLOR_PRESETS.rosso, COLOR_PRESETS.verde, COLOR_PRESETS.arancione,
      COLOR_PRESETS.nero, COLOR_PRESETS.grigio
    ]
  },
  {
    id: 'sett-144',
    codice: '144',
    nome: 'Linea Madrid con elastico 144',
    sottotitolo: 'Copertina soft touch in poliuretano con banda elastica orizzontale',
    categoria: 'Settimanali',
    categoriaOrganizzata: '9x14 - interno settimanale',
    formato: '9 x 14 cm',
    dimensioniCm: '9.0 x 14.0 cm',
    layout: 'Settimanale',
    copertina: 'Poliuretano Madrid Soft-Touch',
    pagine: 128,
    carta: 'Bianca 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/144.jpg',
    immagineInterno: '/agende/interiors/144.jpg',
    prezzoIvaInclusa: 3.50,
    prezzoBaseUnitario: 2.87,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Poliuretano vellutato', 'Elastico ad alta tenuta', 'Compatta da taschino o borsetta'],
    colori: [COLOR_PRESETS.blu, COLOR_PRESETS.rosso, COLOR_PRESETS.nero, COLOR_PRESETS.arancione]
  },
  {
    id: 'sett-70126',
    codice: '70126',
    nome: 'Linea Nubia 70126',
    sottotitolo: 'Agenda classica essenziale in cartoncino laminato opaco ultra resistente',
    categoria: 'Settimanali',
    categoriaOrganizzata: '9x14 - interno settimanale',
    formato: '9 x 14 cm',
    dimensioniCm: '9.0 x 14.0 cm',
    layout: 'Settimanale',
    copertina: 'Cartoncino laminato opaco rigido',
    pagine: 128,
    carta: 'Bianca 70 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/70126.jpg',
    immagineInterno: '/agende/interiors/70126.jpg',
    prezzoIvaInclusa: 2.50,
    prezzoBaseUnitario: 2.05,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Ottimo rapporto qualità/prezzo', 'Leggera e maneggevole', 'Ideale per promozioni diffuse'],
    colori: [
      COLOR_PRESETS.nero, COLOR_PRESETS.rosso, COLOR_PRESETS.verde, COLOR_PRESETS.blu,
      COLOR_PRESETS.arancione, COLOR_PRESETS.royal, COLOR_PRESETS.bordeaux, COLOR_PRESETS.celeste
    ]
  }
];

// -------------------------------------------------------------
// 2. CATEGORIA 9x14 - INTERNO GIORNALIERO
// -------------------------------------------------------------
export const MODELLI_9x14_GIORNALIERO: AgendaModel[] = [
  {
    id: 'giorn-70826',
    codice: '70826',
    nome: 'Linea Rubis con elastico 70826',
    sottotitolo: 'Agenda tascabile giornaliera con spazio quotidiano completo ed elastico',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '9x14 interno giornaliero',
    formato: '9 x 14 cm',
    dimensioniCm: '9.0 x 14.5 cm',
    layout: 'Giornaliera',
    copertina: 'Similpelle Rubis termovirante con elastico',
    pagine: 320,
    carta: 'Bianca 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/70826.jpg',
    immagineInterno: '/agende/interiors/70826.jpg',
    prezzoIvaInclusa: 5.50,
    prezzoBaseUnitario: 4.51,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Un giorno per pagina in formato pocket', 'Chiusura con elastico coordinato', 'Carta bianca di qualità'],
    colori: [
      COLOR_PRESETS.blu, COLOR_PRESETS.rosso, COLOR_PRESETS.nero, COLOR_PRESETS.verde,
      COLOR_PRESETS.arancione, COLOR_PRESETS.grigio
    ]
  },
  {
    id: 'giorn-134',
    codice: '134',
    nome: 'Linea Madrid con elastico 134',
    sottotitolo: 'Agenda pocket giornaliera in morbido poliuretano con chiusura elastica',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '9x14 interno giornaliero',
    formato: '9 x 14 cm',
    dimensioniCm: '9.0 x 14.0 cm',
    layout: 'Giornaliera',
    copertina: 'Poliuretano Soft Madrid con elastico',
    pagine: 320,
    carta: 'Bianca 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/134.jpg',
    immagineInterno: '/agende/interiors/134.jpg',
    prezzoIvaInclusa: 4.50,
    prezzoBaseUnitario: 3.69,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Compatta e spessa con tutte le giornate dell\'anno', 'Finitura opaca anti-impronta', 'Elastico resistente'],
    colori: [COLOR_PRESETS.blu, COLOR_PRESETS.rosso, COLOR_PRESETS.nero, COLOR_PRESETS.arancione]
  }
];

// -------------------------------------------------------------
// 3. CATEGORIA 12.5x18 - INTERNO GIORNALIERO
// -------------------------------------------------------------
export const MODELLI_12_5x18_GIORNALIERO: AgendaModel[] = [
  {
    id: 'giorn-70226',
    codice: '70226',
    nome: 'Linea Nubia 70226',
    sottotitolo: 'Formato intermedio compatto ideale da borsa o scrivania',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '12.5x18 - interno giornaliero',
    formato: '12,5 x 18 cm',
    dimensioniCm: '12.5 x 18.0 cm',
    layout: 'Giornaliera',
    copertina: 'Cartoncino laminato opaco rigido',
    pagine: 320,
    carta: 'Bianca 70 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/70226.jpg',
    immagineInterno: '/agende/interiors/70226.jpg',
    prezzoIvaInclusa: 5.00,
    prezzoBaseUnitario: 4.10,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Formato 12.5 x 18 pratico e spazioso', 'Copertina rigida laminata', 'Spazio giornaliero completo'],
    colori: [
      COLOR_PRESETS.nero, COLOR_PRESETS.rosso, COLOR_PRESETS.verde, COLOR_PRESETS.blu,
      COLOR_PRESETS.arancione, COLOR_PRESETS.royal, COLOR_PRESETS.bordeaux, COLOR_PRESETS.celeste
    ]
  },
  {
    id: 'giorn-73526',
    codice: '73526',
    nome: 'Linea Zaira con elastico 73526',
    sottotitolo: 'Copertina rigida laminata con elastico piatto coordinato',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '12.5x18 - interno giornaliero',
    formato: '12,5 x 18 cm',
    dimensioniCm: '12.0 x 17.5 cm',
    layout: 'Giornaliera',
    copertina: 'Cartoncino laminato con elastico',
    pagine: 320,
    carta: 'Bianca 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/73526.jpg',
    immagineInterno: '/agende/interiors/73526.jpg',
    prezzoIvaInclusa: 5.50,
    prezzoBaseUnitario: 4.51,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Elastico di chiusura coordinato', 'Formato medio compatto', 'Segnalibro integrato'],
    colori: [
      COLOR_PRESETS.bianco, COLOR_PRESETS.nero, COLOR_PRESETS.rosso, COLOR_PRESETS.verde,
      COLOR_PRESETS.blu, COLOR_PRESETS.arancione, COLOR_PRESETS.royal
    ]
  },
  {
    id: 'giorn-71126',
    codice: '71126',
    nome: 'Linea Rubis con elastico 71126',
    sottotitolo: 'Pregiata similpelle morbida Rubis con elastico e finiture artigianali',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '12.5x18 - interno giornaliero',
    formato: '12,5 x 18 cm',
    dimensioniCm: '12.5 x 18.0 cm',
    layout: 'Giornaliera',
    copertina: 'Similpelle Rubis termovirante con elastico',
    pagine: 320,
    carta: 'Bianca 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/71126.jpg',
    immagineInterno: '/agende/interiors/70826.jpg',
    prezzoIvaInclusa: 6.50,
    prezzoBaseUnitario: 5.33,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Similpelle Soft Rubis', 'Chiusura elastica di sicurezza', 'Adatta ad incisione termica o a caldo'],
    colori: [
      COLOR_PRESETS.blu, COLOR_PRESETS.rosso, COLOR_PRESETS.nero, COLOR_PRESETS.verde,
      COLOR_PRESETS.arancione, COLOR_PRESETS.grigio
    ]
  },
  {
    id: 'giorn-143',
    codice: '143',
    nome: 'Linea Madrid con elastico 143',
    sottotitolo: 'Giornaliera compatta in poliuretano soft con elastico piatto',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '12.5x18 - interno giornaliero',
    formato: '12,5 x 18 cm',
    dimensioniCm: '12.5 x 17.5 cm',
    layout: 'Giornaliera',
    copertina: 'Poliuretano Soft-Touch con elastico',
    pagine: 320,
    carta: 'Bianca 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/143.jpg',
    immagineInterno: '/agende/interiors/143.jpg',
    prezzoIvaInclusa: 6.00,
    prezzoBaseUnitario: 4.92,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Poliuretano flessibile di alta qualità', 'Elastico tono su tono', 'Blocco cucito a filo refe'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.blu, COLOR_PRESETS.rosso, COLOR_PRESETS.arancione]
  },
  {
    id: 'giorn-72126-c',
    codice: '72126-C',
    nome: 'Linea Rubis con elastico 72126-C',
    sottotitolo: 'Copertina rigida in PU termovirante con elastico e anello penna',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '12.5x18 - interno giornaliero',
    formato: '12.0 x 18.0 cm',
    dimensioniCm: '12.0 x 18.0 cm',
    layout: 'Giornaliera',
    copertina: 'PU Termovirante con cucitura',
    pagine: 176,
    carta: 'Bianca 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: true,
    immagine: '/agende/covers/72126-C.jpg',
    immagineInterno: '/agende/interiors/72126-C.jpg',
    prezzoIvaInclusa: 2.87,
    prezzoBaseUnitario: 2.35,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Prezzo ultracompetitivo', 'Elastico e anello penna inclusi', '176 pagine 12 mesi'],
    colori: [
      COLOR_PRESETS.nero, COLOR_PRESETS.rosso, COLOR_PRESETS.blu,
      COLOR_PRESETS.arancione, COLOR_PRESETS.royal, COLOR_PRESETS.beige
    ]
  }
];

// -------------------------------------------------------------
// 4. CATEGORIA 15x21 - INTERNO GIORNALIERO
// -------------------------------------------------------------
export const MODELLI_15x21_GIORNALIERO: AgendaModel[] = [
  {
    id: 'giorn-70426',
    codice: '70426',
    nome: 'Linea Nubia 70426',
    sottotitolo: 'La classica agenda da banco da lavoro in cartoncino laminato opaco',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '14.5 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Cartoncino laminato opaco rigido',
    pagine: 324,
    carta: 'Bianca 70 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/70426.jpg',
    immagineInterno: '/agende/interiors/70426.jpg',
    prezzoIvaInclusa: 5.50,
    prezzoBaseUnitario: 4.51,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Formato A5 standard da scrivania', 'Superfice laminata antigraffio', 'Grande visibilità per stampa logo'],
    colori: [
      COLOR_PRESETS.nero, COLOR_PRESETS.rosso, COLOR_PRESETS.verde, COLOR_PRESETS.blu,
      COLOR_PRESETS.arancione, COLOR_PRESETS.royal, COLOR_PRESETS.bordeaux, COLOR_PRESETS.celeste
    ]
  },
  {
    id: 'giorn-73326',
    codice: '73326',
    nome: 'Linea Zaira con elastico 73326',
    sottotitolo: 'Agenda standard da scrivania con copertina rigida laminata ed elastico',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '14.5 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Cartoncino laminato con elastico',
    pagine: 324,
    carta: 'Bianca 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/73326.jpg',
    immagineInterno: '/agende/interiors/73326.jpg',
    prezzoIvaInclusa: 6.00,
    prezzoBaseUnitario: 4.92,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Chiusura con elastico coordinato', 'Pagine con orari e note', 'Inserto cartografico'],
    colori: [
      COLOR_PRESETS.bianco, COLOR_PRESETS.nero, COLOR_PRESETS.rosso, COLOR_PRESETS.verde,
      COLOR_PRESETS.blu, COLOR_PRESETS.arancione, COLOR_PRESETS.royal
    ]
  },
  {
    id: 'giorn-74726',
    codice: '74726',
    nome: 'Linea Emeri 74726',
    sottotitolo: 'Design contemporaneo in cartoncino rigido con grafica pulita e moderna',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '14.5 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Cartoncino stampato laminato opaco',
    pagine: 324,
    carta: 'Bianca 70 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/74726.jpg',
    immagineInterno: '/agende/interiors/74726.jpg',
    prezzoIvaInclusa: 5.50,
    prezzoBaseUnitario: 4.51,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Rigida resistente', 'Layout interno chiaro con calendari e rubrica', 'Finitura satinata'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.rosso, COLOR_PRESETS.blu, COLOR_PRESETS.grigio]
  },
  {
    id: 'giorn-71226',
    codice: '71226',
    nome: 'Linea Opyra con elastico 71226',
    sottotitolo: 'Copertina soft touch materica in PU con elastico e asola portapenne',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '15.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Poliuretano Opyra con elastico',
    pagine: 324,
    carta: 'Avorio 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: true,
    immagine: '/agende/covers/71226.jpg',
    immagineInterno: '/agende/interiors/71226.jpg',
    prezzoIvaInclusa: 7.50,
    prezzoBaseUnitario: 6.15,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Morbido PU termovirante', 'Carta avorio certificata', 'Portapenne elastico integrato'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.blu, COLOR_PRESETS.rosso, COLOR_PRESETS.verde, COLOR_PRESETS.arancione]
  },
  {
    id: 'giorn-71926',
    codice: '71926',
    nome: 'Linea Felicia 71926',
    sottotitolo: 'Copertina flessibile in soft PU e bordo pagine decorato a contrasto',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '14.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Soft PU flessibile con taglio vivo',
    pagine: 324,
    carta: 'Bianca finitura liscia',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/71926.jpg',
    immagineInterno: '/agende/interiors/71926.jpg',
    prezzoIvaInclusa: 7.50,
    prezzoBaseUnitario: 6.15,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Copertina flessibile e leggera', 'Bordo taglio pagine colorato a contrasto', 'Stile chic moderno'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.blu, COLOR_PRESETS.rosso, COLOR_PRESETS.grigio]
  },
  {
    id: 'giorn-71026',
    codice: '71026',
    nome: 'Linea Rubis con elastico 71026',
    sottotitolo: 'Grande classico professionale in similpelle Rubis con chiusura elastica',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '15.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Similpelle Rubis termovirante con elastico',
    pagine: 324,
    carta: 'Bianca 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/71026.jpg',
    immagineInterno: '/agende/interiors/71026.jpg',
    prezzoIvaInclusa: 7.50,
    prezzoBaseUnitario: 6.15,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Similpelle di pregio ideale per incisione a secco', 'Elastico rinforzato', 'Angoli arrotondati'],
    colori: [
      COLOR_PRESETS.blu, COLOR_PRESETS.rosso, COLOR_PRESETS.nero, COLOR_PRESETS.verde,
      COLOR_PRESETS.arancione, COLOR_PRESETS.grigio
    ]
  },
  {
    id: 'giorn-70726',
    codice: '70726',
    nome: 'Linea Amely 70726',
    sottotitolo: 'Pregiata copertina morbida con texture ad effetto lino naturale',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '15.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Tessuto lino sintetico di alta gamma',
    pagine: 324,
    carta: 'Avorio pregiata 70 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/70726.jpg',
    immagineInterno: '/agende/interiors/70726.jpg',
    prezzoIvaInclusa: 9.00,
    prezzoBaseUnitario: 7.38,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Texture effetto lino materico', 'Finitura di prestigio per studi e dirigenti', 'Carta avorio riposante'],
    colori: [COLOR_PRESETS.beige, COLOR_PRESETS.grigio, COLOR_PRESETS.blu, COLOR_PRESETS.nero]
  },
  {
    id: 'giorn-143-15',
    codice: '143',
    nome: 'Linea Madrid con elastico 143',
    sottotitolo: 'Agenda standard A5 in poliuretano soft con chiusura ad elastico',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '15.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Poliuretano Soft-Touch con elastico',
    pagine: 324,
    carta: 'Bianca 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/143.jpg',
    immagineInterno: '/agende/interiors/143.jpg',
    prezzoIvaInclusa: 6.00,
    prezzoBaseUnitario: 4.92,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Morbido poliuretano ad alta tenuta', 'Elastico abbinato', 'Interno giornaliero con orari'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.blu, COLOR_PRESETS.rosso, COLOR_PRESETS.arancione]
  },
  {
    id: 'giorn-124',
    codice: '124',
    nome: 'Linea Astuccio 124',
    sottotitolo: 'Agenda professionale con tasca frontale a soffietto per smartphone o penna',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '15.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Poliuretano con tasca sagomata e cerniera',
    pagine: 324,
    carta: 'Bianca 70 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: true,
    immagine: '/agende/covers/124.jpg',
    immagineInterno: '/agende/interiors/124.jpg',
    prezzoIvaInclusa: 13.00,
    prezzoBaseUnitario: 10.66,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Tasca portadocumenti / astuccio integrato', 'Grande comodità in mobilità', 'Materiali durevoli'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.blu, COLOR_PRESETS.grigio]
  },
  {
    id: 'port-126',
    codice: '126',
    nome: 'Linea Portafoglio 126',
    sottotitolo: 'Agenda con copertina a portafoglio, scomparti portacarte e tasca interna',
    categoria: 'Organizer e Portafoglio',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '15.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Pelle rigenerata / PU con chiusura a patella',
    pagine: 324,
    carta: 'Avorio 70 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: true,
    immagine: '/agende/covers/126.jpg',
    immagineInterno: '/agende/interiors/126.jpg',
    prezzoIvaInclusa: 19.00,
    prezzoBaseUnitario: 15.57,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Patella di chiusura elegante', 'Slot per biglietti da visita e carte', 'Blocco estraibile o riutilizzabile'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.blu, COLOR_PRESETS.marrone]
  },
  {
    id: 'giorn-121',
    codice: '121',
    nome: 'Linea Clip 121',
    sottotitolo: 'Agenda direzionale in PU con chiusura a clip magnetica in metallo',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '15.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Poliuretano pregiato con fibbia a clip magnetica',
    pagine: 324,
    carta: 'Bianca 70 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: true,
    immagine: '/agende/covers/121.jpg',
    immagineInterno: '/agende/interiors/121.jpg',
    prezzoIvaInclusa: 17.50,
    prezzoBaseUnitario: 14.34,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Clip magnetica in metallo spazzolato', 'Finitura cucita sui bordi', 'Look dirigenziale'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.bluNavy, COLOR_PRESETS.grigio]
  },
  {
    id: 'port-128',
    codice: '128',
    nome: 'Linea Business 128',
    sottotitolo: 'Agenda executive business con scomparti multifunzione e chiusura flap',
    categoria: 'Organizer e Portafoglio',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '15.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Pelle sintetica Luxury con rifiniture ad ago',
    pagine: 324,
    carta: 'Avorio 80 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: true,
    immagine: '/agende/covers/128.jpg',
    immagineInterno: '/agende/interiors/128.jpg',
    prezzoIvaInclusa: 26.00,
    prezzoBaseUnitario: 21.31,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Tasche porta tablet / smartphone', 'Scomparto porta carte e tessere', 'Confezione regalo inclusa'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.bluNavy, COLOR_PRESETS.marrone]
  },
  {
    id: 'giorn-125',
    codice: '125',
    nome: 'Linea Borsello 125',
    sottotitolo: 'Agenda organizer con chiusura perimetrale a zip in metallo dorato',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '15.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Poliuretano martellato con cerniera perimetrale',
    pagine: 324,
    carta: 'Avorio 80 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: true,
    immagine: '/agende/covers/125.jpg',
    immagineInterno: '/agende/interiors/125.jpg',
    prezzoIvaInclusa: 30.00,
    prezzoBaseUnitario: 24.59,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Chiusura zip perimetrale anti-smarrimento', 'Massima sicurezza per documenti', 'Grande prestigio visivo'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.blu, COLOR_PRESETS.marrone]
  },
  {
    id: 'giorn-110',
    codice: '110',
    nome: 'Linea Spiralata 110',
    sottotitolo: 'In poliuretano giornaliera spiralata internamente',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '15.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Poliuretano con spirale interna nascosta',
    pagine: 320,
    carta: 'Bianca',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/110.jpg',
    immagineInterno: '/agende/interiors/110.jpg',
    prezzoIvaInclusa: 7.50,
    prezzoBaseUnitario: 6.15,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Spirale metallica interna per apertura piana a 360°', 'Poliuretano resistente', '24 ore di pianificazione fluida'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.blu, COLOR_PRESETS.rosso]
  },
  {
    id: 'giorn-131',
    codice: '131',
    nome: 'Linea Madrid con elastico 131',
    sottotitolo: 'Imbottita in poliuretano con elastico coordinato',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '15.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Poliuretano imbottito morbido al tocco con elastico',
    pagine: 320,
    carta: 'Bianca opaca',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/131.jpg',
    immagineInterno: '/agende/interiors/131.jpg',
    prezzoIvaInclusa: 6.00,
    prezzoBaseUnitario: 4.92,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Copertina imbottita piacevole al tocco', 'Elastico coordinato', 'Colori vivaci e moderni'],
    colori: [COLOR_PRESETS.tiffany, COLOR_PRESETS.wenge, COLOR_PRESETS.verdeMela]
  },
  {
    id: 'giorn-140',
    codice: '140',
    nome: 'Linea interno a quadretti 140',
    sottotitolo: 'Imbottita in poliuretano con interno a quadretti',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '15x21 - interno giornaliero',
    formato: '15 x 21 cm',
    dimensioniCm: '15.0 x 21.0 cm',
    layout: 'Giornaliera',
    copertina: 'Poliuretano imbottito',
    pagine: 320,
    carta: 'Interno con griglia a quadretti',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/140.jpg',
    immagineInterno: '/agende/interiors/140.jpg',
    prezzoIvaInclusa: 7.50,
    prezzoBaseUnitario: 6.15,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Interno a quadretti ideale per note tecniche e calcoli', 'Copertina imbottita confortevole', 'Spazio note extra'],
    colori: [COLOR_PRESETS.bluNavy, COLOR_PRESETS.nero, COLOR_PRESETS.rosso]
  }
];

// -------------------------------------------------------------
// 5. CATEGORIA 17x24 - INTERNO GIORNALIERO
// -------------------------------------------------------------
export const MODELLI_17x24_GIORNALIERO: AgendaModel[] = [
  {
    id: 'giorn-70526',
    codice: '70526',
    nome: 'Linea Nubia 70526',
    sottotitolo: 'Formato generoso 17x24 cm in cartoncino laminato opaco',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '17x24 - interno giornaliero',
    formato: '17 x 24 cm',
    dimensioniCm: '17.0 x 24.0 cm',
    layout: 'Giornaliera',
    copertina: 'Cartoncino laminato opaco rigido',
    pagine: 368,
    carta: 'Bianca 70 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/70526.jpg',
    immagineInterno: '/agende/interiors/70526.jpg',
    prezzoIvaInclusa: 7.50,
    prezzoBaseUnitario: 6.15,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Formato ampio 17x24 cm', 'Copertina laminata opaca', 'Spazio generoso per appunti'],
    colori: [
      COLOR_PRESETS.nero, COLOR_PRESETS.rosso, COLOR_PRESETS.verde, COLOR_PRESETS.blu,
      COLOR_PRESETS.royal, COLOR_PRESETS.bordeaux
    ]
  },
  {
    id: 'giorn-75226',
    codice: '75226',
    nome: 'Linea Michi con elastico 75226',
    sottotitolo: 'Copertina rigida in PU con elastico per la chiusura formato 17x24 cm',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '17x24 - interno giornaliero',
    formato: '17 x 24 cm',
    dimensioniCm: '17.0 x 24.0 cm',
    layout: 'Giornaliera',
    copertina: 'PU rigido con elastico coordinato',
    pagine: 352,
    carta: 'Carta bianca da 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/75226.jpg',
    immagineInterno: '/agende/interiors/75226.jpg',
    prezzoIvaInclusa: 9.50,
    prezzoBaseUnitario: 7.79,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Copertina in PU con elastico', 'Formato scrivania 17x24 cm', 'Design moderno ed elegante'],
    colori: [
      COLOR_PRESETS.nero, COLOR_PRESETS.rosso, COLOR_PRESETS.verde, COLOR_PRESETS.blu,
      COLOR_PRESETS.arancione, COLOR_PRESETS.royal
    ]
  },
  {
    id: 'giorn-139',
    codice: '139',
    nome: 'Linea Madrid con elastico 139',
    sottotitolo: 'Agenda giornaliera 17x24 cm in poliuretano imbottito con sabato e domenica separati',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '17x24 - interno giornaliero',
    formato: '17 x 24 cm',
    dimensioniCm: '17.0 x 24.0 cm',
    layout: 'Giornaliera',
    copertina: 'Poliuretano morbido imbottito con elastico',
    pagine: 384,
    carta: 'Bianca con sabato e domenica separati',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/139.jpg',
    immagineInterno: '/agende/interiors/139.jpg',
    prezzoIvaInclusa: 10.50,
    prezzoBaseUnitario: 8.61,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['384 pagine complete con festivi separati', 'Formato scrivania 17x24 cm', 'Copertina imbottita accogliente'],
    colori: [COLOR_PRESETS.bluNavy, COLOR_PRESETS.nero, COLOR_PRESETS.bordeaux]
  },
  {
    id: 'giorn-137',
    codice: '137',
    nome: 'Linea interno a quadretti 137',
    sottotitolo: 'Imbottita in poliuretano con interno a quadretti',
    categoria: 'Giornaliere',
    categoriaOrganizzata: '17x24 - interno giornaliero',
    formato: '17 x 24 cm',
    dimensioniCm: '17.0 x 24.0 cm',
    layout: 'Giornaliera',
    copertina: 'Poliuretano imbottito',
    pagine: 24,
    carta: 'Interno con griglia a quadretti tecnica',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/137.jpg',
    immagineInterno: '/agende/interiors/137.jpg',
    prezzoIvaInclusa: 12.68,
    prezzoBaseUnitario: 10.39,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Interno a quadretti per calcoli e note tecniche', 'Ampio formato 17x24 cm', 'Copertina imbottita'],
    colori: [COLOR_PRESETS.bluNavy, COLOR_PRESETS.nero]
  }
];

// -------------------------------------------------------------
// 6. CATEGORIA 17x24 - INTERNO SETTIMANALE
// -------------------------------------------------------------
export const MODELLI_17x24_SETTIMANALE: AgendaModel[] = [
  {
    id: 'sett-70626',
    codice: '70626',
    nome: 'Linea Nubia 70626',
    sottotitolo: 'Copertina rigida laminata opaca formato 17x24 cm da tavolo',
    categoria: 'Settimanali',
    categoriaOrganizzata: '17x24 - interno settimanale',
    formato: '17 x 24 cm',
    dimensioniCm: '17.0 x 24.0 cm',
    layout: 'Settimanale',
    copertina: 'Cartoncino laminato opaco',
    pagine: 128,
    carta: 'Bianca 70 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/70626.jpg',
    immagineInterno: '/agende/interiors/70626.jpg',
    prezzoIvaInclusa: 6.50,
    prezzoBaseUnitario: 5.33,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Formato ampio da tavolo 17x24 cm', 'Settimana ben visibile su doppia pagina', 'Laminazione opaca'],
    colori: [
      COLOR_PRESETS.nero, COLOR_PRESETS.rosso, COLOR_PRESETS.verde, COLOR_PRESETS.blu,
      COLOR_PRESETS.royal, COLOR_PRESETS.bordeaux
    ]
  },
  {
    id: 'sett-73426',
    codice: '73426',
    nome: 'Linea Zaira con elastico 73426',
    sottotitolo: 'Copertina rigida laminata con elastico coordinato formato da tavolo',
    categoria: 'Settimanali',
    categoriaOrganizzata: '17x24 - interno settimanale',
    formato: '17 x 24 cm',
    dimensioniCm: '17.0 x 24.0 cm',
    layout: 'Settimanale',
    copertina: 'Cartoncino laminato con elastico',
    pagine: 128,
    carta: 'Bianca 70 g/m²',
    haElastico: true,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/73426.jpg',
    immagineInterno: '/agende/interiors/73426.jpg',
    prezzoIvaInclusa: 6.50,
    prezzoBaseUnitario: 5.33,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Elastico di chiusura coordinato', 'Formato confortevole per studio e ufficio', 'Visione settimanale'],
    colori: [
      COLOR_PRESETS.nero, COLOR_PRESETS.rosso, COLOR_PRESETS.verde, COLOR_PRESETS.blu,
      COLOR_PRESETS.arancione, COLOR_PRESETS.royal
    ]
  },
  {
    id: 'sett-70326',
    codice: '70326',
    nome: 'Linea Amely 70326',
    sottotitolo: 'Copertina rigida in PU termovirante con impuntura e anello portapenna',
    categoria: 'Settimanali',
    categoriaOrganizzata: '17x24 - interno settimanale',
    formato: '17 x 24 cm',
    dimensioniCm: '17.0 x 24.0 cm',
    layout: 'Settimanale',
    copertina: 'PU Termovirante con cucitura perimetrale',
    pagine: 128,
    carta: 'Bianca 70 g/m²',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: true,
    immagine: '/agende/covers/70326.jpg',
    immagineInterno: '/agende/interiors/70326.jpg',
    prezzoIvaInclusa: 9.50,
    prezzoBaseUnitario: 7.79,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['PU di alta gamma termovirante', 'Anello porta penna elastico', 'Spazio generoso per la settimana'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.verde, COLOR_PRESETS.blu, COLOR_PRESETS.beige]
  },
  {
    id: 'sett-142',
    codice: '142',
    nome: 'Linea Madrid 142',
    sottotitolo: 'Imbottita in poliuretano, 384 pagine con sabato e domenica separati',
    categoria: 'Settimanali',
    categoriaOrganizzata: '17x24 - interno settimanale',
    formato: '17 x 24 cm',
    dimensioniCm: '17.0 x 24.0 cm',
    layout: 'Settimanale',
    copertina: 'Poliuretano imbottito morbido',
    pagine: 384,
    carta: 'Bianca con sabato e domenica separati',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/142.jpg',
    immagineInterno: '/agende/interiors/142.jpg',
    prezzoIvaInclusa: 7.50,
    prezzoBaseUnitario: 6.15,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Copertina imbottita confortevole', '384 pagine con sabato e domenica separati', 'Rilegatura durevole'],
    colori: [COLOR_PRESETS.rosso, COLOR_PRESETS.bluNavy]
  },
  {
    id: 'sett-111',
    codice: '111',
    nome: 'Linea Spiralata 111',
    sottotitolo: 'In poliuretano settimanale spiralata internamente formato 17x24 cm',
    categoria: 'Settimanali',
    categoriaOrganizzata: '17x24 - interno settimanale',
    formato: '17 x 24 cm',
    dimensioniCm: '17.0 x 24.0 cm',
    layout: 'Settimanale',
    copertina: 'Poliuretano con spirale interna',
    pagine: 128,
    carta: 'Bianca',
    haElastico: false,
    haSegnalibro: true,
    haPortapenne: false,
    immagine: '/agende/covers/111.jpg',
    immagineInterno: '/agende/interiors/111.jpg',
    prezzoIvaInclusa: 7.50,
    prezzoBaseUnitario: 6.15,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Spirale metallica interna comoda per scrivere', 'Poliuretano morbido', 'Visione settimanale da tavolo'],
    colori: [COLOR_PRESETS.rosso, COLOR_PRESETS.royal]
  }
];

// -------------------------------------------------------------
// 7. FORMATO PLANNING 10x30 - INTERNO SETTIMANALE
// -------------------------------------------------------------
export const MODELLI_PLANNING_10x30_SETTIMANALE: AgendaModel[] = [
  {
    id: 'sett-148',
    codice: '148',
    nome: 'Linea Madrid 148',
    sottotitolo: 'In poliuretano settimanale spiralata formato orizzontale 10x30 cm',
    categoria: 'Settimanali',
    categoriaOrganizzata: 'Planning 10x30 - interno settimanale',
    formato: '10 x 30 cm',
    dimensioniCm: '10.0 x 30.0 cm',
    layout: 'Planning',
    copertina: 'Poliuretano con spirale interna da tavolo',
    pagine: 64,
    carta: 'Bianca spessa da planner',
    haElastico: false,
    haSegnalibro: false,
    haPortapenne: false,
    immagine: '/agende/covers/148.jpg',
    immagineInterno: '/agende/interiors/148.jpg',
    prezzoIvaInclusa: 6.00,
    prezzoBaseUnitario: 4.92,
    disponibile: true,
    statoDisponibilita: 'disponibile',
    caratteristiche: ['Formato orizzontale allungato ideale sotto la tastiera', 'Settimana a colpo d\'occhio', 'Spirale pratica da scrivania'],
    colori: [COLOR_PRESETS.nero, COLOR_PRESETS.bluNavy, COLOR_PRESETS.bordeaux]
  }
];

// -------------------------------------------------------------
// HELPER PER LA RIFORMATTAZIONE UNIFICATA DELL'INTESTAZIONE PRODOTTO
// -------------------------------------------------------------
export function getAgendaHeaderDisplay(agenda: AgendaModel): {
  titolo: string;
  misuraCodice: string;
  misuraLabel: string;
} {
  const code = agenda.codice;
  const isSett = agenda.layout === 'Settimanale' || (agenda.categoria && agenda.categoria.toLowerCase().includes('settiman'));
  const isGiorn = agenda.layout === 'Giornaliera' || (agenda.categoria && agenda.categoria.toLowerCase().includes('giornal'));
  const fmt = (agenda.formato || '') + ' ' + (agenda.dimensioniCm || '') + ' ' + (agenda.categoriaOrganizzata || '');

  // Denominazione della linea di prodotto
  let linea = agenda.nome;
  // Rimuovi codici numerici
  linea = linea.replace(new RegExp(`\\b${code}\\b`, 'g'), '');
  // Rimuovi parole superflue per isolare la sola linea (es. "Zaira con elastico", "Nubia", ecc.)
  linea = linea
    .replace(/^Agenda\s+(da\s+tavolo\s+)?(Tascabile\s+)?(Giornaliera|Settimanale)\s*/i, '')
    .replace(/^Agendina\s+(Giornaliera|Settimanale)\s*/i, '')
    .replace(/^Linea\s+/i, '')
    .replace(/\s+(Large|Maxi|Pocket)\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Mappature specifiche per uniformità assoluta
  if (code === '139') linea = 'Madrid con elastico';
  if (code === '142') linea = 'Madrid';
  if (code === '143') linea = 'Madrid con elastico';
  if (code === '144') linea = 'Madrid con elastico';
  if (code === '134') linea = 'Madrid con elastico';
  if (code === '124') linea = 'Vivella';
  if (code === '125') linea = 'Matra con zip';
  if (code === '110') linea = 'Spiralata';
  if (code === '131') linea = 'Madrid con elastico';
  if (code === '140' || code === '137') linea = 'Interno a quadretti';
  if (code === '111') linea = 'Spiralata';
  if (code === '148') linea = 'Madrid';
  if (code === '70126' || code === '70226' || code === '70426' || code === '70526' || code === '70626') linea = 'Nubia';
  if (code === '73226' || code === '73326' || code === '73426' || code === '73526') linea = 'Zaira con elastico';
  if (code === '72126' || code === '72126-C' || code === '70826' || code === '71126' || code === '72226') linea = 'Rubis con elastico';
  if (code === '74726') linea = 'Emeri';
  if (code === '71226') linea = 'Opyra con elastico';
  if (code === '71926') linea = 'Felicia';
  if (code === '74326') linea = 'Baldo con elastico';
  if (code === '74426') linea = 'Baldo';
  if (code === '74526') linea = 'Emi';
  if (code === '72626') linea = 'Camoscio con elastico';
  if (code === '74626') linea = 'Camoscio';
  if (code === '75226') linea = 'Michi con elastico';
  if (code === '70326') linea = 'Amely';

  let titolo = '';
  let misuraLabel = 'cm ' + (agenda.formato || '').replace(/cm/i, '').trim();

  if (fmt.includes('10x30') || fmt.includes('10 x 30') || fmt.includes('30x10') || fmt.includes('30 x 10') || agenda.layout === 'Planning' || agenda.nome.toLowerCase().includes('planning')) {
    misuraLabel = 'cm 10x30';
    titolo = `Planning Settimanale ${linea}`;
  } else if (fmt.includes('9x14') || fmt.includes('9 x 14')) {
    misuraLabel = 'cm 9x14';
    titolo = isSett ? `Agendina Settimanale ${linea}` : `Agendina Giornaliera ${linea}`;
  } else if (fmt.includes('12.5x18') || fmt.includes('12,5 x 18') || fmt.includes('12x18') || fmt.includes('12 x 18')) {
    misuraLabel = 'cm 12x18';
    titolo = `Agenda Tascabile Giornaliera ${linea}`;
  } else if (fmt.includes('15x21') || fmt.includes('15 x 21') || fmt.includes('14.5 x 21')) {
    misuraLabel = 'cm 15x21';
    titolo = `Agenda Giornaliera ${linea}`;
  } else if (fmt.includes('17x24') || fmt.includes('17 x 24') || fmt.includes('18x26') || fmt.includes('17,5 x 25,5')) {
    misuraLabel = 'cm 17x24';
    titolo = isSett ? `Agenda da tavolo Settimanale ${linea}` : `Agenda da tavolo Giornaliera ${linea}`;
  } else {
    if (agenda.nome.toLowerCase().includes('planning') || fmt.includes('30x14')) {
      titolo = `Planning da tavolo ${linea}`;
      misuraLabel = 'cm 30x14';
    } else {
      titolo = `${isSett ? 'Agenda Settimanale' : 'Agenda Giornaliera'} ${linea}`;
    }
  }

  return {
    titolo: titolo.trim(),
    misuraCodice: `${misuraLabel} - cod ${code}`,
    misuraLabel
  };
}

// -------------------------------------------------------------
// DEFINIZIONE UFFICIALE DEI FORMATI ORGANIZZATI
// -------------------------------------------------------------
export const CATEGORIE_ORGANIZZATE: OrganizedCategory[] = [
  {
    id: 'cat-9x14-sett',
    titolo: 'Formato 9x14 — Interno Settimanale',
    sottotitolo: 'Formato tascabile compatto con visione settimanale su due pagine',
    formatoLabel: '9 x 14 cm',
    tipoLayout: 'Settimanale',
    modelli: MODELLI_9x14_SETTIMANALE
  },
  {
    id: 'cat-9x14-giorn',
    titolo: 'Formato 9x14 — Interno Giornaliero',
    sottotitolo: 'Tascabili pratiche con una pagina intera per ogni giorno dell\'anno',
    formatoLabel: '9 x 14 cm',
    tipoLayout: 'Giornaliera',
    modelli: MODELLI_9x14_GIORNALIERO
  },
  {
    id: 'cat-12.5x18-giorn',
    titolo: 'Formato 12x18 — Interno Giornaliero',
    sottotitolo: 'Il formato compatto ideale da borsa o scrivania con ampio spazio di scrittura',
    formatoLabel: '12 x 18 cm',
    tipoLayout: 'Giornaliera',
    modelli: MODELLI_12_5x18_GIORNALIERO
  },
  {
    id: 'cat-15x21-giorn',
    titolo: 'Formato 15x21 — Interno Giornaliero',
    sottotitolo: 'Il classico formato A5 da banco e scrivania, modelli standard, executive e con cerniera',
    formatoLabel: '15 x 21 cm',
    tipoLayout: 'Giornaliera',
    modelli: MODELLI_15x21_GIORNALIERO
  },
  {
    id: 'cat-17x24-giorn',
    titolo: 'Formato 17x24 — Interno Giornaliero',
    sottotitolo: 'Formato medio-grande ideale per ufficio, studio e gestione appuntamenti dettagliata',
    formatoLabel: '17 x 24 cm',
    tipoLayout: 'Giornaliera',
    modelli: MODELLI_17x24_GIORNALIERO
  },
  {
    id: 'cat-17x24-sett',
    titolo: 'Formato 17x24 — Interno Settimanale',
    sottotitolo: 'Formato ampio da scrivania con visione settimanale completa e ampio spazio note',
    formatoLabel: '17 x 24 cm',
    tipoLayout: 'Settimanale',
    modelli: MODELLI_17x24_SETTIMANALE
  },
  {
    id: 'cat-10x30-planning',
    titolo: 'Formato Planning 10x30 — Interno Settimanale',
    sottotitolo: 'Pratico planning orizzontale da scrivania con visione settimanale a spirale',
    formatoLabel: '10 x 30 cm',
    tipoLayout: 'Settimanale',
    modelli: MODELLI_PLANNING_10x30_SETTIMANALE
  }
];

// Lista unificata dei modelli organizzati
export const TUTTI_MODELLI_ORGANIZZATI: AgendaModel[] = [
  ...MODELLI_9x14_SETTIMANALE,
  ...MODELLI_9x14_GIORNALIERO,
  ...MODELLI_12_5x18_GIORNALIERO,
  ...MODELLI_15x21_GIORNALIERO,
  ...MODELLI_17x24_GIORNALIERO,
  ...MODELLI_17x24_SETTIMANALE,
  ...MODELLI_PLANNING_10x30_SETTIMANALE
];
