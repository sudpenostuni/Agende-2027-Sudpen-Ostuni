const sharp = require('sharp');
const fs = require('fs');

async function extractAll() {
  const covers = [
    { line: 'nubia', page: 1, box: { left: 200, top: 110, width: 550, height: 800 } },
    { line: 'madrid', page: 3, box: { left: 100, top: 100, width: 600, height: 850 } },
    { line: 'zaira', page: 4, box: { left: 80, top: 110, width: 330, height: 470 } },
    { line: 'emeri', page: 6, box: { left: 80, top: 90, width: 330, height: 470 } },
    { line: 'opyra', page: 6, box: { left: 60, top: 1060, width: 360, height: 470 } },
    { line: 'felicia', page: 7, box: { left: 130, top: 90, width: 330, height: 460 } },
    { line: 'spiralata', page: 7, box: { left: 900, top: 1100, width: 350, height: 390 } },
    { line: '148', page: 8, box: { left: 70, top: 120, width: 720, height: 370 } },
    { line: 'rubis', page: 9, box: { left: 140, top: 110, width: 310, height: 470 } },
    { line: 'michi', page: 10, box: { left: 65, top: 1040, width: 350, height: 470 } },
    { line: 'amely', page: 11, box: { left: 150, top: 110, width: 350, height: 470 } },
    { line: 'quadretti', page: 15, box: { left: 165, top: 130, width: 310, height: 450 } },
    { line: '112', page: 16, box: { left: 155, top: 55, width: 370, height: 600 } },
    { line: '124', page: 18, box: { left: 550, top: 140, width: 600, height: 500 } },
    { line: '125', page: 19, box: { left: 700, top: 210, width: 500, height: 500 } }
  ];

  fs.mkdirSync('public/agende/covers', { recursive: true });
  fs.mkdirSync('public/agende/interiors', { recursive: true });

  for (const c of covers) {
    const src = `public/${c.page}.png`;
    if (!fs.existsSync(src)) {
      console.warn(`File ${src} not found`);
      continue;
    }
    const out = `public/agende/covers/${c.line}.jpg`;
    try {
      await sharp(src)
        .extract(c.box)
        .jpeg({ quality: 92 })
        .toFile(out);
      console.log(`Cover [${c.line}] extracted to ${out}`);
    } catch (e) {
      console.error(`Error on ${c.line}:`, e.message);
    }
  }

  // Model Code to Line map
  const codeToLine = {
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
    '124': '124', '125': '125', '126': '124', '121': '124', '128': '124', '1296': '125'
  };

  for (const [code, line] of Object.entries(codeToLine)) {
    const lineCover = `public/agende/covers/${line}.jpg`;
    const codeCover = `public/agende/covers/${code}.jpg`;
    if (fs.existsSync(lineCover)) {
      fs.copyFileSync(lineCover, codeCover);
    }
  }

  // Interior assignment:
  // - Daily models get interno_giornaliero.jpg
  // - Weekly models get interno_settimanale.jpg
  // - Planning 148 gets 148.jpg
  const dailyCodes = [
    '70226', '70426', '70526', '73526', '73326', '74726', '71226', '71926', 
    '110', '72126-C', '71126', '71026', '75226', '70726', '134', '143', '153', 
    '131', '139', '140', '137', '132', '112', '159', '124', '126', '121', '128', '125', '1296'
  ];
  const weeklyCodes = ['70126', '70626', '73226', '73426', '111', '70826', '72126', '70326', '144', '142'];

  const gSrc = 'public/agende/interiors/interno_giornaliero.jpg';
  const sSrc = 'public/agende/interiors/interno_settimanale.jpg';

  if (fs.existsSync(gSrc)) {
    for (const code of dailyCodes) {
      fs.copyFileSync(gSrc, `public/agende/interiors/${code}.jpg`);
    }
  }

  if (fs.existsSync(sSrc)) {
    for (const code of weeklyCodes) {
      fs.copyFileSync(sSrc, `public/agende/interiors/${code}.jpg`);
    }
  }

  console.log('SUCCESS: All unified covers and interiors are synchronized and populated!');
}

extractAll().catch(console.error);
