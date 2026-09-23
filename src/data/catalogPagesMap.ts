export interface ModelCatalogInfo {
  code: string;
  name: string;
  page: number; // 1 to 20
  category: 'Giornaliere' | 'Settimanali' | 'Speciali';
  format: string;
}

export const CATALOG_MODELS_MAP: ModelCatalogInfo[] = [
  // Pagina 1
  { code: '70126', name: 'Nubia Pocket Settimanale 70126', page: 1, category: 'Settimanali', format: '9 x 14 cm' },
  // Pagina 2
  { code: '70226', name: 'Nubia Compact Giornaliera 70226', page: 2, category: 'Giornaliere', format: '12,5 x 18 cm' },
  { code: '70426', name: 'Nubia Standard 70426', page: 2, category: 'Giornaliere', format: '15 x 21 cm' },
  // Pagina 3
  { code: '70526', name: 'Nubia Large 70526', page: 3, category: 'Giornaliere', format: '17 x 24 cm' },
  { code: '70626', name: 'Nubia Maxi 70626', page: 3, category: 'Settimanali', format: '19 x 27 cm' },
  // Pagina 4
  { code: '73226', name: 'Zaira Pocket 73226', page: 4, category: 'Settimanali', format: '9 x 14 cm' },
  { code: '73526', name: 'Zaira Compact 73526', page: 4, category: 'Giornaliere', format: '12 x 17 cm' },
  // Pagina 5
  { code: '73326', name: 'Zaira Standard 73326', page: 5, category: 'Giornaliere', format: '15 x 21 cm' },
  { code: '73426', name: 'Zaira Large 73426', page: 5, category: 'Settimanali', format: '17 x 24 cm' },
  // Pagina 6
  { code: '74726', name: 'Emeri Standard 74726', page: 6, category: 'Giornaliere', format: '15 x 21 cm' },
  { code: '71226', name: 'Opyra Standard 71226', page: 6, category: 'Giornaliere', format: '15 x 21 cm' },
  // Pagina 7
  { code: '71926', name: 'Felicia Standard 71926', page: 7, category: 'Giornaliere', format: '15 x 21 cm' },
  { code: '110', name: 'Agenda Spiralata 110', page: 7, category: 'Giornaliere', format: '15 x 21 cm' },
  { code: '111', name: 'Agenda Spiralata 111', page: 7, category: 'Settimanali', format: '17 x 24 cm' },
  // Pagina 8
  { code: '148', name: 'Agenda Planning da Tavolo 148', page: 8, category: 'Speciali', format: '30 x 14 cm' },
  { code: '70826', name: 'Rubis Pocket 70826', page: 8, category: 'Settimanali', format: '9 x 14 cm' },
  // Pagina 9
  { code: '72126-C', name: 'Rubis Compact 72126', page: 9, category: 'Giornaliere', format: '12 x 17 cm' },
  { code: '72126', name: 'Rubis Settimanale 72126', page: 9, category: 'Settimanali', format: '15 x 21 cm' },
  { code: '71126', name: 'Linea Rubis con elastico 71126', page: 9, category: 'Giornaliere', format: '12,5 x 18 cm' },
  // Pagina 10
  { code: '71026', name: 'Rubis Large 71026', page: 10, category: 'Giornaliere', format: '17 x 24 cm' },
  { code: '75226', name: 'Michi Large 75226', page: 10, category: 'Giornaliere', format: '17 x 24 cm' },
  // Pagina 11
  { code: '70726', name: 'Amely Standard 70726', page: 11, category: 'Giornaliere', format: '15 x 21 cm' },
  { code: '70326', name: 'Amely Maxi 70326', page: 11, category: 'Settimanali', format: '19 x 27 cm' },
  // Pagina 12
  { code: '134', name: 'Agenda Giornaliera Pocket 134', page: 12, category: 'Giornaliere', format: '9 x 14 cm' },
  // Pagina 13
  { code: '144', name: 'Agenda con Elastico 144', page: 13, category: 'Settimanali', format: '9 x 14 cm' },
  { code: '143', name: 'Agenda col Elastico 143', page: 13, category: 'Giornaliere', format: '15 x 21 cm' },
  // Pagina 14
  { code: '131', name: 'Agenda con Elastico 131', page: 14, category: 'Giornaliere', format: '15 x 21 cm' },
  { code: '139', name: 'Agenda Giornaliera Imbottita 139', page: 14, category: 'Giornaliere', format: '17 x 24 cm' },
  { code: '142', name: 'Agenda Settimanale Imbottita 142', page: 14, category: 'Settimanali', format: '17 x 24 cm' },
  // Pagina 15
  { code: '140', name: 'Agenda Giornaliera a Quadretti 140', page: 15, category: 'Giornaliere', format: '15 x 21 cm' },
  { code: '137', name: 'Agenda Giornaliera a Quadretti 137', page: 15, category: 'Giornaliere', format: '17 x 24 cm' },
  // Pagina 16
  { code: '158', name: 'Libro Prenotazione 158', page: 16, category: 'Speciali', format: '21 x 29,7 cm' },
  { code: '159', name: 'Agenda Giornaliera 159', page: 16, category: 'Giornaliere', format: '15 x 21 cm' },
  // Pagina 17
  // Pagina 18
  { code: '124', name: 'Agenda Giornaliera con Tasca 124', page: 18, category: 'Giornaliere', format: '15 x 21 cm' },
  { code: '126', name: 'Agenda Portafoglio 126', page: 18, category: 'Speciali', format: '10 x 15 cm' },
  // Pagina 19
  { code: '121', name: 'Agenda Giornaliera in PU 121', page: 19, category: 'Giornaliere', format: '15 x 21 cm' },
  { code: '128', name: 'Agenda Portafoglio Executive 128', page: 19, category: 'Speciali', format: '15 x 21 cm' },
  // Pagina 20
  { code: '125', name: 'Agenda Giornaliera con Cerniera 125', page: 20, category: 'Giornaliere', format: '17 x 24 cm' }
];

export const TOTAL_PAGES = 20;

export function getPageImage(page: number): string {
  const padded = page.toString().padStart(2, '0');
  return `/pdfpages/page_${padded}.jpg`;
}

export function getModelsForPage(page: number): ModelCatalogInfo[] {
  return CATALOG_MODELS_MAP.filter(m => m.page === page);
}

export function getCatalogPageForModel(code: string): number {
  const found = CATALOG_MODELS_MAP.find(m => m.code === code);
  return found ? found.page : 1;
}

export function getModelCatalogInfo(code: string): ModelCatalogInfo | undefined {
  return CATALOG_MODELS_MAP.find(m => m.code === code);
}
