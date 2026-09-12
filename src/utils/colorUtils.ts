import { AgendaModel, ColorOption } from '../types';

/**
 * Converte il nome del colore (es. "Rosso 03", "Blu Navy 05", "Wengè") in uno slug normalizzato
 * Es. "Rosso 03" -> "rosso-03"
 */
export function getColorSlug(colorName: string): string {
  if (!colorName) return 'default';
  return colorName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // rimuove accenti
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Restituisce il nome file previsto per la variante colore di un modello
 * Es. (70126, "Rosso 03") -> "70126_rosso-03.jpg"
 */
export function getVariantCoverFilename(code: string, colorName: string): string {
  const slug = getColorSlug(colorName);
  return `${code}_${slug}.jpg`;
}

/**
 * Restituisce l'URL della variante colore
 */
export function getVariantCoverUrl(code: string, colorName: string): string {
  return `/agende/covers/${getVariantCoverFilename(code, colorName)}`;
}

/**
 * Mappa un codice modello alla sua linea di riferimento
 */
export const MODEL_TO_LINE_KEY: Record<string, string> = {
  // Nubia
  '70126': 'nubia', '70226': 'nubia', '70426': 'nubia', '70526': 'nubia', '70626': 'nubia',
  // Zaira
  '73226': 'zaira', '73526': 'zaira', '73326': 'zaira', '73426': 'zaira',
  // Madrid
  '131': 'madrid', '134': 'madrid', '139': 'madrid', '142': 'madrid', '143': 'madrid', '144': 'madrid', '153': 'madrid',
  // Rubis
  '70826': 'rubis', '72126': 'rubis', '71126': 'rubis', '71026': 'rubis', '72126-C': 'rubis',
  // Emeri & Opyra
  '74726': 'emeri', '71226': 'opyra',
  // Felicia & Spiralata
  '71926': 'felicia', '110': 'spiralata', '111': 'spiralata',
  // Planning
  '148': '148',
  // Michi & Amely
  '75226': 'michi', '70726': 'amely', '70326': 'amely',
  // Quadretti & Targhetta
  '140': 'quadretti', '137': 'quadretti', '132': 'quadretti', '112': '112',
  // Vivella & Matra
  '124': '124', '125': '125', '126': '124', '121': '124', '128': '124', '1296': '125',
  // Extra
  '179': 'madrid', '180': 'madrid', '158': '112', '159': '112', 'Q24113': 'madrid'
};

const COLOR_ALIASES_MAP: Record<string, string[]> = {
  'nero': ['nero', 'nero-02'],
  'rosso': ['rosso', 'rosso-03'],
  'verde': ['verde', 'verde-04'],
  'blu': ['blu', 'blu-05', 'royal', 'royal-07', 'blu-royal', 'blu-navy', 'blu-navy-05', 'navy', 'blu-notte'],
  'arancione': ['arancione', 'arancio', 'arancione-06'],
  'royal': ['royal', 'royal-07', 'blu-royal', 'blu', 'blu-05'],
  'bordeaux': ['bordeaux', 'bordeaux-08'],
  'celeste': ['celeste', 'celeste-09', 'azzurro'],
  'bianco': ['bianco', 'bianco-01'],
  'beige': ['beige', 'beige-09', 'cuoio', 'marrone', 'cognac', 'tortora'],
  'blu-navy': ['blu-navy', 'blu-navy-05', 'navy', 'blu-notte', 'blunavy', 'blu', 'blu-05'],
  'grigio': ['grigio', 'grigio-13', 'antracite', 'tortora'],
  'verde-tiffany': ['verde-tiffany', 'tiffany', 'turchese', 'verde-acqua'],
  'wenge': ['wenge', 'tortora', 'marrone', 'marrone-10'],
  'verde-mela': ['verde-mela', 'verdemela', 'salvia', 'lime', 'verde-chiaro']
};

/**
 * Restituisce l'URL migliore per la copertina di un'agenda in base al colore selezionato
 * e all'elenco dei ritagli attualmente disponibili su disco.
 */
export function resolveAgendaCoverImage(
  agenda: AgendaModel,
  selectedColor?: ColorOption | null,
  availableCoverFiles?: string[]
): {
  url: string;
  isSpecificVariant: boolean;
  colorName?: string;
} {
  if (!selectedColor) {
    return { url: agenda.immagine, isSpecificVariant: false };
  }

  // 1. Se il colore ha già una proprietà immagine esplicita
  if (selectedColor.immagine) {
    return { url: selectedColor.immagine, isSpecificVariant: true, colorName: selectedColor.nome };
  }

  const slug = getColorSlug(selectedColor.nome);

  // 2. Se il modello ha una mappa esplicita delle varianti
  if (agenda.immaginiVariantiColore && agenda.immaginiVariantiColore[slug]) {
    return { url: agenda.immaginiVariantiColore[slug], isSpecificVariant: true, colorName: selectedColor.nome };
  }

  // 3. Se abbiamo l'elenco dei file su disco, controlliamo se esiste il file specifico per questo codice o linea
  if (availableCoverFiles && availableCoverFiles.length > 0) {
    const cleanColor = slug.replace(/-\d+$/, ''); // es. 'rosso-03' -> 'rosso'
    const colorCandidatesSet = new Set<string>([slug, cleanColor]);

    // Espandiamo i candidati tramite gli alias definiti in COLOR_ALIASES_MAP
    if (COLOR_ALIASES_MAP[cleanColor]) {
      COLOR_ALIASES_MAP[cleanColor].forEach(alias => colorCandidatesSet.add(alias));
    }
    for (const [key, aliases] of Object.entries(COLOR_ALIASES_MAP)) {
      if (aliases.includes(cleanColor) || aliases.includes(slug)) {
        colorCandidatesSet.add(key);
        aliases.forEach(alias => colorCandidatesSet.add(alias));
      }
    }

    const colorCandidates = Array.from(colorCandidatesSet);
    const lineKey = MODEL_TO_LINE_KEY[agenda.codice];

    for (const c of colorCandidates) {
      // Prova con codice specifico (es. 70126_rosso.jpg)
      const codeFileName = `${agenda.codice}_${c}.jpg`;
      if (availableCoverFiles.includes(codeFileName)) {
        return { url: `/agende/covers/${codeFileName}`, isSpecificVariant: true, colorName: selectedColor.nome };
      }

      // Prova con chiave di linea (es. nubia_rosso.jpg)
      if (lineKey) {
        const lineFileName = `${lineKey}_${c}.jpg`;
        if (availableCoverFiles.includes(lineFileName)) {
          return { url: `/agende/covers/${lineFileName}`, isSpecificVariant: true, colorName: selectedColor.nome };
        }
      }
    }
  }

  // 4. Default: copertina principale dell'agenda
  return { url: agenda.immagine, isSpecificVariant: false };
}
