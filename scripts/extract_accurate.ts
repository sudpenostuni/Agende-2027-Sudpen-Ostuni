import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Risoluzione pagina Ghostscript a 200 DPI: W = 1654, H = 2339
async function safeCrop(page: number, x: number, y: number, w: number, h: number, outPath: string) {
  const pageFile = `/tmp/pdfpages/page_${String(page).padStart(2, '0')}.jpg`;
  if (!fs.existsSync(pageFile)) {
    console.error('File pagina non trovato:', pageFile);
    return;
  }

  const left = Math.max(0, Math.min(1654 - 1, Math.round(x)));
  const top = Math.max(0, Math.min(2339 - 1, Math.round(y)));
  const width = Math.min(1654 - left, Math.round(w));
  const height = Math.min(2339 - top, Math.round(h));

  try {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    await sharp(pageFile)
      .extract({ left, top, width, height })
      .trim({ background: '#FFFFFF', threshold: 12 })
      .jpeg({ quality: 90 })
      .toFile(outPath);
  } catch (e) {
    console.error(`Errore crop [Page ${page}] ${outPath}:`, (e as Error).message);
  }
}

async function extractAll() {
  console.log('Inizio estrazione accurata di tutti i 44 modelli...');

  // ================= PAGE 1 =================
  // 70126 Nubia Poket
  await safeCrop(1, 280, 160, 580, 850, 'public/agende/covers/70126.jpg');
  await safeCrop(1, 1010, 670, 460, 360, 'public/agende/interiors/70126.jpg');

  // ================= PAGE 2 =================
  // 70226 Nubia compact giorn
  await safeCrop(2, 110, 150, 350, 500, 'public/agende/covers/70226.jpg');
  await safeCrop(2, 1070, 310, 430, 310, 'public/agende/interiors/70226.jpg');
  // 70426 Nubia Standard
  await safeCrop(2, 100, 1270, 370, 500, 'public/agende/covers/70426.jpg');
  await safeCrop(2, 1070, 1420, 430, 320, 'public/agende/interiors/70426.jpg');

  // ================= PAGE 3 =================
  // 70526 Nubia Large
  await safeCrop(3, 180, 150, 380, 500, 'public/agende/covers/70526.jpg');
  await safeCrop(3, 1150, 300, 420, 330, 'public/agende/interiors/70526.jpg');
  // 70626 Nubia maxi
  await safeCrop(3, 180, 1270, 380, 500, 'public/agende/covers/70626.jpg');
  await safeCrop(3, 1150, 1420, 420, 310, 'public/agende/interiors/70626.jpg');

  // ================= PAGE 4 =================
  // 73226 Zaira pocket
  await safeCrop(4, 110, 150, 350, 500, 'public/agende/covers/73226.jpg');
  await safeCrop(4, 1060, 280, 440, 350, 'public/agende/interiors/73226.jpg');
  // 73526 Zaira compact
  await safeCrop(4, 110, 1250, 350, 500, 'public/agende/covers/73526.jpg');
  await safeCrop(4, 1070, 1410, 430, 260, 'public/agende/interiors/73526.jpg');

  // ================= PAGE 5 =================
  // 73326 Zaira standard
  await safeCrop(5, 160, 160, 360, 490, 'public/agende/covers/73326.jpg');
  await safeCrop(5, 1120, 300, 440, 330, 'public/agende/interiors/73326.jpg');
  // 73426 Zaira Large
  await safeCrop(5, 180, 1250, 370, 500, 'public/agende/covers/73426.jpg');
  await safeCrop(5, 1150, 1400, 430, 280, 'public/agende/interiors/73426.jpg');

  // ================= PAGE 6 =================
  // 74726 Emeri standard
  await safeCrop(6, 110, 120, 360, 500, 'public/agende/covers/74726.jpg');
  await safeCrop(6, 1100, 270, 430, 320, 'public/agende/interiors/74726.jpg');
  // 71226 Opyra Standard
  await safeCrop(6, 90, 1270, 390, 500, 'public/agende/covers/71226.jpg');
  await safeCrop(6, 1050, 1340, 420, 320, 'public/agende/interiors/71226.jpg');

  // ================= PAGE 7 =================
  // 71926 Felicia Standard
  await safeCrop(7, 170, 120, 350, 490, 'public/agende/covers/71926.jpg');
  await safeCrop(7, 1140, 150, 410, 290, 'public/agende/interiors/71926.jpg');
  // 110 Agenda spiralata 110
  await safeCrop(7, 1220, 1320, 310, 410, 'public/agende/covers/110.jpg');
  await safeCrop(7, 1010, 1510, 190, 150, 'public/agende/interiors/110.jpg');
  // 111 Agenda spiralata 111
  await safeCrop(7, 1220, 1750, 310, 410, 'public/agende/covers/111.jpg');
  await safeCrop(7, 1010, 1920, 190, 150, 'public/agende/interiors/111.jpg');

  // ================= PAGE 8 =================
  // 148 Agenda planning
  await safeCrop(8, 100, 160, 800, 400, 'public/agende/covers/148.jpg');
  await safeCrop(8, 70, 570, 460, 230, 'public/agende/interiors/148.jpg');
  // 70826 Rubis Pocket
  await safeCrop(8, 90, 1250, 310, 500, 'public/agende/covers/70826.jpg');
  await safeCrop(8, 1050, 1400, 430, 320, 'public/agende/interiors/70826.jpg');

  // ================= PAGE 9 =================
  // 72126 Rubis compact
  await safeCrop(9, 180, 140, 320, 500, 'public/agende/covers/72126.jpg');
  await safeCrop(9, 1140, 300, 370, 310, 'public/agende/interiors/72126.jpg');
  // 71126 Rubis Standard
  await safeCrop(9, 160, 1250, 360, 500, 'public/agende/covers/71126.jpg');
  await safeCrop(9, 1120, 1400, 440, 320, 'public/agende/interiors/71126.jpg');

  // ================= PAGE 10 =================
  // 71026 Rubis Large
  await safeCrop(10, 100, 160, 360, 500, 'public/agende/covers/71026.jpg');
  await safeCrop(10, 1060, 300, 440, 320, 'public/agende/interiors/71026.jpg');
  // 75226 Michi Large
  await safeCrop(10, 90, 1250, 370, 500, 'public/agende/covers/75226.jpg');
  await safeCrop(10, 1060, 1390, 440, 320, 'public/agende/interiors/75226.jpg');

  // ================= PAGE 11 =================
  // 70726 Amely Standard
  await safeCrop(11, 190, 150, 370, 500, 'public/agende/covers/70726.jpg');
  await safeCrop(11, 1180, 320, 390, 330, 'public/agende/interiors/70726.jpg');
  // 70326 Amely Maxi
  await safeCrop(11, 190, 1240, 370, 500, 'public/agende/covers/70326.jpg');
  await safeCrop(11, 1170, 1390, 410, 310, 'public/agende/interiors/70326.jpg');

  // ================= PAGE 12 =================
  // Q24113 Organizer
  await safeCrop(12, 100, 170, 390, 550, 'public/agende/covers/Q24113.jpg');
  await safeCrop(12, 970, 260, 530, 350, 'public/agende/interiors/Q24113.jpg');
  // 134 Agenda giornaliera 134
  await safeCrop(12, 1030, 1350, 380, 430, 'public/agende/covers/134.jpg');
  await safeCrop(12, 810, 1270, 270, 180, 'public/agende/interiors/134.jpg');

  // ================= PAGE 13 =================
  // 144 Agenda con elastico 144
  await safeCrop(13, 500, 200, 380, 430, 'public/agende/covers/144.jpg');
  await safeCrop(13, 300, 170, 250, 180, 'public/agende/interiors/144.jpg');
  // 143 Agenda col elastico 143
  await safeCrop(13, 170, 1180, 470, 480, 'public/agende/covers/143.jpg');
  await safeCrop(13, 300, 170, 250, 180, 'public/agende/interiors/143.jpg');
  // 153 Agenda col elastico 153
  await safeCrop(13, 170, 1180, 470, 480, 'public/agende/covers/153.jpg');
  await safeCrop(13, 300, 170, 250, 180, 'public/agende/interiors/153.jpg');

  // ================= PAGE 14 =================
  // 131 Agenda con elastico 131
  await safeCrop(14, 1120, 120, 340, 500, 'public/agende/covers/131.jpg');
  await safeCrop(14, 170, 1230, 320, 460, 'public/agende/interiors/131.jpg');
  // 139 Agenda giornaliera 139
  await safeCrop(14, 170, 1230, 320, 460, 'public/agende/covers/139.jpg');
  await safeCrop(14, 170, 1230, 320, 460, 'public/agende/interiors/139.jpg');
  // 142 Agenda settimanale 142
  await safeCrop(14, 350, 1830, 150, 220, 'public/agende/covers/142.jpg');
  await safeCrop(14, 170, 1230, 320, 460, 'public/agende/interiors/142.jpg');

  // ================= PAGE 15 =================
  // 140 Agenda giornaliera a quadretti 140
  await safeCrop(15, 210, 170, 320, 490, 'public/agende/covers/140.jpg');
  await safeCrop(15, 510, 380, 300, 190, 'public/agende/interiors/140.jpg');
  // 137 Agenda giornaliera a quadretti 137
  await safeCrop(15, 210, 660, 160, 240, 'public/agende/covers/137.jpg');
  await safeCrop(15, 510, 380, 300, 190, 'public/agende/interiors/137.jpg');
  // 132 Agenda giornaliera 132
  await safeCrop(15, 410, 1340, 300, 450, 'public/agende/covers/132.jpg');
  await safeCrop(15, 270, 1470, 140, 180, 'public/agende/interiors/132.jpg');

  // ================= PAGE 16 =================
  // 112 Agenda giornaliera targhetta 112
  await safeCrop(16, 210, 80, 390, 660, 'public/agende/covers/112.jpg');
  await safeCrop(16, 780, 470, 160, 250, 'public/agende/interiors/112.jpg');
  // 158 Libro prenotazione 158
  await safeCrop(16, 1120, 830, 390, 590, 'public/agende/covers/158.jpg');
  await safeCrop(16, 1120, 830, 390, 590, 'public/agende/interiors/158.jpg');
  // 159 Agenda giornaliera 159
  await safeCrop(16, 180, 1560, 400, 600, 'public/agende/covers/159.jpg');
  await safeCrop(16, 180, 1560, 400, 600, 'public/agende/interiors/159.jpg');

  // ================= PAGE 17 =================
  // 179 Blocco per agenda 179
  await safeCrop(17, 220, 240, 810, 600, 'public/agende/covers/179.jpg');
  await safeCrop(17, 220, 240, 810, 600, 'public/agende/interiors/179.jpg');
  // 180 Blocco per agenda 180
  await safeCrop(17, 220, 1170, 810, 640, 'public/agende/covers/180.jpg');
  await safeCrop(17, 220, 1170, 810, 640, 'public/agende/interiors/180.jpg');

  // ================= PAGE 18 =================
  // 124 Agenda giornaliera 124
  await safeCrop(18, 720, 190, 780, 570, 'public/agende/covers/124.jpg');
  await safeCrop(18, 1090, 780, 280, 220, 'public/agende/interiors/124.jpg');
  // 126 Agenda portafoglio 126
  await safeCrop(18, 690, 1250, 560, 500, 'public/agende/covers/126.jpg');
  await safeCrop(18, 1240, 1410, 260, 220, 'public/agende/interiors/126.jpg');

  // ================= PAGE 19 =================
  // 121 Agenda giornaliera in PU 121
  await safeCrop(19, 210, 160, 480, 720, 'public/agende/covers/121.jpg');
  await safeCrop(19, 690, 550, 360, 400, 'public/agende/interiors/121.jpg');
  // 128 Agenda portafoglio 128
  await safeCrop(19, 200, 1070, 680, 730, 'public/agende/covers/128.jpg');
  await safeCrop(19, 670, 1750, 380, 400, 'public/agende/interiors/128.jpg');

  // ================= PAGE 20 =================
  // 125 Agenda giornaliera 125
  await safeCrop(20, 950, 280, 540, 540, 'public/agende/covers/125.jpg');
  await safeCrop(20, 520, 710, 730, 420, 'public/agende/interiors/125.jpg');
  // 1296 Agenda giornaliera 1296
  await safeCrop(20, 670, 1450, 770, 680, 'public/agende/covers/1296.jpg');
  await safeCrop(20, 160, 770, 340, 280, 'public/agende/interiors/1296.jpg');

  console.log('Estrazione di tutti i 44 modelli completata!');
}

extractAll();
