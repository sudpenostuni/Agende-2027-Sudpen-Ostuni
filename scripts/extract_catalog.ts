import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Dimensioni pagina renderizzata a 200 DPI: W: 1654, H: 2339
// Helper per convertire % di pagina (x, y, w, h) in pixel e ritagliare con trim automatico del bianco
async function crop(pageNumber: number, rectPct: [number, number, number, number], outputPath: string) {
  const pageFile = `/tmp/pdfpages/page_${String(pageNumber).padStart(2, '0')}.jpg`;
  if (!fs.existsSync(pageFile)) {
    console.error(`Pagina non trovata: ${pageFile}`);
    return;
  }

  const [xPct, yPct, wPct, hPct] = rectPct;
  const W = 1654;
  const H = 2339;

  const left = Math.max(0, Math.min(W - 1, Math.round((xPct / 100) * W)));
  const top = Math.max(0, Math.min(H - 1, Math.round((yPct / 100) * H)));
  const width = Math.min(W - left, Math.round((wPct / 100) * W));
  const height = Math.min(H - top, Math.round((hPct / 100) * H));

  try {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await sharp(pageFile)
      .extract({ left, top, width, height })
      .trim({ background: '#FFFFFF', threshold: 18 }) // rimuove bordi bianchi in eccesso
      .jpeg({ quality: 90 })
      .toFile(outputPath);
    console.log(`✓ Salvato ${outputPath}`);
  } catch (err) {
    console.error(`Errore crop per ${outputPath}:`, err);
  }
}

async function run() {
  console.log('Inizio estrazione immagini ad alta definizione da catalogo.pdf...');

  // MAPPATURA DELLE 20 PAGINE
  // PAGINA 1: Nubia Poket 70126
  await crop(1, [15, 7, 36, 40], 'public/agende/covers/70126.jpg');
  await crop(1, [60, 27, 30, 18], 'public/agende/interiors/70126.jpg');

  // PAGINA 2:
  // Modello superiore: Nubia compact giorn 70226
  await crop(2, [6, 6, 23, 23], 'public/agende/covers/70226.jpg');
  await crop(2, [64, 13, 27, 15], 'public/agende/interiors/70226.jpg');
  // Modello inferiore: Nubia Standard 70426
  await crop(2, [6, 54, 23, 23], 'public/agende/covers/70426.jpg');
  await crop(2, [64, 60, 27, 15], 'public/agende/interiors/70426.jpg');

  // PAGINA 3:
  // Modello superiore: Nubia Large 70526
  await crop(3, [10, 6, 24, 24], 'public/agende/covers/70526.jpg');
  await crop(3, [69, 12, 27, 16], 'public/agende/interiors/70526.jpg');
  // Modello inferiore: Nubia maxi 70626
  await crop(3, [10, 54, 24, 24], 'public/agende/covers/70626.jpg');
  await crop(3, [69, 60, 27, 15], 'public/agende/interiors/70626.jpg');

  // PAGINA 4:
  // Modello superiore: Zaira pocket 73226
  await crop(4, [6, 6, 23, 23], 'public/agende/covers/73226.jpg');
  await crop(4, [64, 12, 27, 15], 'public/agende/interiors/73226.jpg');
  // Modello inferiore: Zaira compact 73526
  await crop(4, [6, 53, 23, 23], 'public/agende/covers/73526.jpg');
  await crop(4, [64, 60, 27, 15], 'public/agende/interiors/73526.jpg');

  // PAGINA 5:
  // Modello superiore: Zaira standard 73326
  await crop(5, [9, 6, 24, 23], 'public/agende/covers/73326.jpg');
  await crop(5, [67, 12, 27, 15], 'public/agende/interiors/73326.jpg');
  // Modello inferiore: Zaira Large 73426
  await crop(5, [10, 53, 24, 23], 'public/agende/covers/73426.jpg');
  await crop(5, [69, 59, 27, 15], 'public/agende/interiors/73426.jpg');

  // PAGINA 6:
  // Modello superiore: Emeri standard 74726
  await crop(6, [6, 5, 23, 23], 'public/agende/covers/74726.jpg');
  await crop(6, [66, 11, 25, 15], 'public/agende/interiors/74726.jpg');
  // Modello inferiore: Opyra Standard 71226
  await crop(6, [5, 54, 24, 23], 'public/agende/covers/71226.jpg');
  await crop(6, [63, 56, 27, 16], 'public/agende/interiors/71226.jpg');

  // PAGINA 7:
  // Modello superiore: Felicia Standard 71926
  await crop(7, [10, 5, 22, 22], 'public/agende/covers/71926.jpg');
  await crop(7, [68, 6, 25, 14], 'public/agende/interiors/71926.jpg');
  // Modello mezzo: Agenda spiralata 110
  await crop(7, [73, 56, 21, 18], 'public/agende/covers/110.jpg');
  await crop(7, [61, 64, 13, 8], 'public/agende/interiors/110.jpg');
  // Modello inferiore: Agenda spiralata 111
  await crop(7, [73, 75, 21, 18], 'public/agende/covers/111.jpg');
  await crop(7, [61, 82, 13, 8], 'public/agende/interiors/111.jpg');

  // PAGINA 8:
  // Modello superiore: Agenda planning 148
  await crop(8, [5, 6, 50, 18], 'public/agende/covers/148.jpg');
  await crop(8, [5, 24, 30, 9], 'public/agende/interiors/148.jpg');
  // Modello inferiore: Rubis Pocket 70826
  await crop(8, [5, 53, 20, 23], 'public/agende/covers/70826.jpg');
  await crop(8, [63, 59, 25, 15], 'public/agende/interiors/70826.jpg');

  // PAGINA 9:
  // Modello superiore: Rubis compact 72126
  await crop(9, [10, 6, 20, 23], 'public/agende/covers/72126.jpg');
  await crop(9, [68, 12, 24, 15], 'public/agende/interiors/72126.jpg');
  // Modello inferiore: Rubis Standard 71126
  await crop(9, [9, 53, 23, 23], 'public/agende/covers/71126.jpg');
  await crop(9, [67, 59, 27, 15], 'public/agende/interiors/71126.jpg');

  // PAGINA 10:
  // Modello superiore: Rubis Large 71026
  await crop(10, [5, 6, 24, 23], 'public/agende/covers/71026.jpg');
  await crop(10, [64, 12, 27, 15], 'public/agende/interiors/71026.jpg');
  // Modello inferiore: Michi Large 75226
  await crop(10, [5, 53, 23, 23], 'public/agende/covers/75226.jpg');
  await crop(10, [64, 59, 27, 15], 'public/agende/interiors/75226.jpg');

  // PAGINA 11:
  // Modello superiore: Amely Standard 70726
  await crop(11, [11, 6, 23, 23], 'public/agende/covers/70726.jpg');
  await crop(11, [71, 13, 24, 15], 'public/agende/interiors/70726.jpg');
  // Modello inferiore: Amely Maxi 70326
  await crop(11, [11, 53, 23, 23], 'public/agende/covers/70326.jpg');
  await crop(11, [70, 59, 25, 15], 'public/agende/interiors/70326.jpg');

  // PAGINA 12:
  // Modello superiore: Organizer Q24113
  await crop(12, [6, 7, 25, 25], 'public/agende/covers/Q24113.jpg');
  await crop(12, [59, 11, 32, 16], 'public/agende/interiors/Q24113.jpg');
  // Modello inferiore: Agenda giornaliera 134
  await crop(12, [62, 57, 24, 20], 'public/agende/covers/134.jpg');
  await crop(12, [49, 54, 17, 9], 'public/agende/interiors/134.jpg');

  // PAGINA 13:
  // Modello superiore: Agenda con elastico 144
  await crop(13, [31, 8, 23, 19], 'public/agende/covers/144.jpg');
  await crop(13, [18, 7, 16, 9], 'public/agende/interiors/144.jpg');
  // Modello inferiore sinistro/centro: Agenda col elastico 143 (12,5 x 17,5)
  await crop(13, [10, 50, 29, 22], 'public/agende/covers/143.jpg');
  // Modello col elastico 153 (15 x 21)
  await crop(13, [10, 50, 29, 22], 'public/agende/covers/153.jpg');
  await crop(13, [18, 7, 16, 9], 'public/agende/interiors/143.jpg');
  await crop(13, [18, 7, 16, 9], 'public/agende/interiors/153.jpg');

  // PAGINA 14:
  // Modello superiore: Agenda con elastico 131
  await crop(14, [68, 5, 21, 23], 'public/agende/covers/131.jpg');
  await crop(14, [15, 62, 18, 20], 'public/agende/interiors/131.jpg');
  // Modello centro/basso: Agenda giornaliera 139
  await crop(14, [10, 52, 21, 22], 'public/agende/covers/139.jpg');
  // Modello Agenda settimanale 142
  await crop(14, [21, 78, 10, 11], 'public/agende/covers/142.jpg');
  await crop(14, [15, 62, 18, 20], 'public/agende/interiors/139.jpg');
  await crop(14, [15, 62, 18, 20], 'public/agende/interiors/142.jpg');

  // PAGINA 15:
  // Modello superiore: Agenda giornaliera a quadretti 140
  await crop(15, [13, 7, 20, 22], 'public/agende/covers/140.jpg');
  await crop(15, [31, 16, 18, 10], 'public/agende/interiors/140.jpg');
  // Modello centro: Agenda giornaliera a quadretti 137
  await crop(15, [13, 28, 10, 11], 'public/agende/covers/137.jpg');
  await crop(15, [31, 16, 18, 10], 'public/agende/interiors/137.jpg');
  // Modello inferiore: Agenda giornaliera 132
  await crop(15, [25, 57, 18, 20], 'public/agende/covers/132.jpg');
  await crop(15, [16, 62, 9, 10], 'public/agende/interiors/132.jpg');

  // PAGINA 16:
  // Modello superiore: Agenda giornaliera targhetta 112
  await crop(16, [12, 3, 24, 30], 'public/agende/covers/112.jpg');
  await crop(16, [47, 20, 10, 12], 'public/agende/interiors/112.jpg');
  // Modello centro-destra: Libro prenotazione 158
  await crop(16, [67, 35, 24, 26], 'public/agende/covers/158.jpg');
  await crop(16, [67, 35, 24, 26], 'public/agende/interiors/158.jpg');
  // Modello inferiore: Agenda giornaliera 159
  await crop(16, [11, 67, 24, 26], 'public/agende/covers/159.jpg');
  await crop(16, [11, 67, 24, 26], 'public/agende/interiors/159.jpg');

  // PAGINA 17:
  // Blocco per agenda 179
  await crop(17, [13, 10, 50, 28], 'public/agende/covers/179.jpg');
  await crop(17, [13, 10, 50, 28], 'public/agende/interiors/179.jpg');
  // Blocco per agenda 180
  await crop(17, [13, 50, 50, 28], 'public/agende/covers/180.jpg');
  await crop(17, [13, 50, 50, 28], 'public/agende/interiors/180.jpg');

  // PAGINA 18:
  // Agenda giornaliera 124
  await crop(18, [43, 8, 48, 25], 'public/agende/covers/124.jpg');
  await crop(18, [66, 33, 17, 12], 'public/agende/interiors/124.jpg');
  // Agenda portafoglio 126
  await crop(18, [42, 53, 34, 21], 'public/agende/covers/126.jpg');
  await crop(18, [75, 60, 16, 10], 'public/agende/interiors/126.jpg');

  // PAGINA 19:
  // Agenda giornaliera in PU 121
  await crop(19, [13, 6, 29, 32], 'public/agende/covers/121.jpg');
  await crop(19, [42, 23, 21, 18], 'public/agende/interiors/121.jpg');
  // Agenda portafoglio 128
  await crop(19, [12, 45, 41, 32], 'public/agende/covers/128.jpg');
  await crop(19, [41, 75, 23, 17], 'public/agende/interiors/128.jpg');

  // PAGINA 20:
  // Agenda giornaliera 125
  await crop(20, [57, 12, 33, 23], 'public/agende/covers/125.jpg');
  await crop(20, [31, 30, 44, 18], 'public/agende/interiors/125.jpg');
  // Agenda giornaliera 1296
  await crop(20, [40, 62, 47, 30], 'public/agende/covers/1296.jpg');
  await crop(20, [10, 33, 20, 12], 'public/agende/interiors/1296.jpg');

  console.log('Estrazione completata con successo!');
}

run();
