// Calcolo del filtro CSS (hue-rotate, saturate, brightness) per mappare l'immagine fotografica di base
// verso il colore selezionato dall'utente senza dover caricare 400 file separati.

interface ColorFilter {
  filter: string;
  tintOverlay?: string;
  blendMode?: 'color' | 'multiply' | 'overlay' | 'hue';
}

export function getColorFilter(hex: string): ColorFilter {
  const cleanHex = hex.toLowerCase().trim();

  switch (cleanHex) {
    case '#0f172a': // Nero
    case '#111827':
    case '#000000':
      return {
        filter: 'grayscale(100%) brightness(0.4) contrast(1.3)',
        tintOverlay: 'rgba(0, 0, 0, 0.4)',
        blendMode: 'multiply'
      };

    case '#ffffff': // Bianco
    case '#f8fafc':
      return {
        filter: 'grayscale(100%) brightness(1.6) contrast(0.9)',
        tintOverlay: 'rgba(255, 255, 255, 0.3)',
        blendMode: 'overlay'
      };

    case '#dc2626': // Rosso
    case '#b91c1c':
    case '#ef4444':
      return {
        filter: 'hue-rotate(345deg) saturate(1.8) contrast(1.1)',
        tintOverlay: 'rgba(220, 38, 38, 0.25)',
        blendMode: 'color'
      };

    case '#16a34a': // Verde
    case '#15803d':
    case '#22c55e':
      return {
        filter: 'hue-rotate(95deg) saturate(1.6) brightness(0.95)',
        tintOverlay: 'rgba(22, 163, 74, 0.25)',
        blendMode: 'color'
      };

    case '#1e3a8a': // Blu scuro
    case '#1e40af':
      return {
        filter: 'hue-rotate(205deg) saturate(1.7) brightness(0.85)',
        tintOverlay: 'rgba(30, 58, 138, 0.25)',
        blendMode: 'color'
      };

    case '#0284c7': // Royal / Cyan
    case '#2563eb':
      return {
        filter: 'hue-rotate(195deg) saturate(2.0) brightness(1.05)',
        tintOverlay: 'rgba(2, 132, 199, 0.25)',
        blendMode: 'color'
      };

    case '#ea580c': // Arancione
    case '#f97316':
      return {
        filter: 'hue-rotate(20deg) saturate(2.2) brightness(1.05)',
        tintOverlay: 'rgba(234, 88, 12, 0.25)',
        blendMode: 'color'
      };

    case '#881337': // Bordeaux
    case '#701a75':
    case '#9f1239':
      return {
        filter: 'hue-rotate(320deg) saturate(1.9) brightness(0.75)',
        tintOverlay: 'rgba(136, 19, 55, 0.3)',
        blendMode: 'color'
      };

    case '#38bdf8': // Celeste
    case '#0ea5e9':
      return {
        filter: 'hue-rotate(180deg) saturate(1.6) brightness(1.25)',
        tintOverlay: 'rgba(56, 189, 248, 0.25)',
        blendMode: 'color'
      };

    case '#d97706': // Cuoio / Cuoio Vintage
    case '#b45309':
    case '#78350f':
      return {
        filter: 'sepia(80%) saturate(1.9) brightness(0.85) contrast(1.1)',
        tintOverlay: 'rgba(180, 83, 9, 0.28)',
        blendMode: 'multiply'
      };

    case '#eab308': // Giallo
    case '#facc15':
      return {
        filter: 'hue-rotate(50deg) saturate(2.4) brightness(1.3)',
        tintOverlay: 'rgba(234, 179, 8, 0.25)',
        blendMode: 'color'
      };

    case '#64748b': // Grigio
    case '#475569':
      return {
        filter: 'grayscale(90%) brightness(0.9) contrast(1.1)',
        tintOverlay: 'rgba(100, 116, 139, 0.3)',
        blendMode: 'multiply'
      };

    default:
      return {
        filter: 'saturate(1.2)',
        tintOverlay: `${cleanHex}33`,
        blendMode: 'color'
      };
  }
}
