const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const COVERS_DIR = path.resolve(__dirname, '..', 'public', 'agende', 'covers');

if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
}

// Configurazione estrazione per pagina/linea
const LINE_CONFIGS = {
  '2': {
    source: path.resolve(__dirname, '..', 'public', '2.png'),
    lineName: 'nubia',
    modelCodes: ['70126', '70226', '70426', '70526', '70626'],
    items: [
      { color: 'celeste', aliases: ['azzurro', 'celeste-09'], box: { left: 514, top: 225, width: 276, height: 437 } },
      { color: 'arancione', aliases: ['arancio', 'arancione-06'], box: { left: 909, top: 210, width: 268, height: 431 } },
      { color: 'nero', aliases: ['nero-02'], box: { left: 168, top: 778, width: 265, height: 425 } },
      { color: 'rosso', aliases: ['rosso-03'], box: { left: 521, top: 767, width: 277, height: 440 } },
      { color: 'royal', aliases: ['royal-07', 'blu-royal'], box: { left: 931, top: 786, width: 262, height: 421 } },
      { color: 'blu', aliases: ['blu-05', 'navy', 'blu-navy'], box: { left: 167, top: 1378, width: 266, height: 430 } },
      { color: 'verde', aliases: ['verde-04'], box: { left: 526, top: 1380, width: 267, height: 426 } },
      { color: 'bordeaux', aliases: ['bordeaux-08'], box: { left: 932, top: 1378, width: 279, height: 442 } }
    ]
  },
  '3': {
    source: path.resolve(__dirname, '..', 'public', '3.png'),
    lineName: 'madrid',
    modelCodes: ['131', '134', '139', '142', '143', '144', '153', '179', '180'],
    items: [
      { color: 'nero', aliases: ['nero-02'], box: { left: 126, top: 142, width: 432, height: 538 } },
      { color: 'rosso', aliases: ['rosso-03'], box: { left: 776, top: 186, width: 482, height: 567 } },
      { color: 'blu-navy', aliases: ['blu-05', 'navy', 'blu-navy', 'blu-notte'], box: { left: 146, top: 818, width: 462, height: 565 } },
      { color: 'blu', aliases: ['royal', 'royal-07', 'blu-royal'], box: { left: 686, top: 831, width: 422, height: 532 } },
      { color: 'bordeaux', aliases: ['bordeaux-08'], box: { left: 456, top: 1415, width: 437, height: 530 } }
    ]
  },
  '4': {
    source: path.resolve(__dirname, '..', 'public', '4.png'),
    lineName: 'zaira',
    modelCodes: ['73226', '73326', '73426', '73526'],
    items: [
      { color: 'rosso', aliases: ['rosso-03'], box: { left: 151, top: 105, width: 339, height: 520 } },
      { color: 'bianco', aliases: ['bianco-01'], box: { left: 147, top: 708, width: 344, height: 493 } },
      { color: 'nero', aliases: ['nero-02'], box: { left: 569, top: 710, width: 349, height: 535 } },
      { color: 'verde', aliases: ['verde-04'], box: { left: 970, top: 709, width: 349, height: 537 } },
      { color: 'blu-navy', aliases: ['blu-05', 'navy', 'blu-navy', 'blu-notte'], box: { left: 107, top: 1354, width: 358, height: 539 } },
      { color: 'arancione', aliases: ['arancio', 'arancione-06'], box: { left: 562, top: 1353, width: 355, height: 542 } },
      { color: 'blu', aliases: ['royal', 'royal-07', 'blu-royal'], box: { left: 967, top: 1355, width: 356, height: 540 } }
    ]
  },
  '5': {
    source: path.resolve(__dirname, '..', 'public', '5.png'),
    lineName: 'opyra',
    modelCodes: ['71226'],
    items: [
      { color: 'blu', aliases: ['blu-05', 'navy', 'blu-navy'], box: { left: 117, top: 376, width: 448, height: 662 } },
      { color: 'nero', aliases: ['nero-02'], box: { left: 861, top: 397, width: 431, height: 636 } }
    ]
  },
  '6': {
    source: path.resolve(__dirname, '..', 'public', '6.png'),
    lineName: 'emeri',
    modelCodes: ['74726'],
    items: [
      { color: 'nero', aliases: ['nero-02'], box: { left: 139, top: 105, width: 346, height: 506 } },
      { color: 'arancione', aliases: ['arancio', 'arancione-06'], box: { left: 135, top: 710, width: 350, height: 525 } },
      { color: 'blu', aliases: ['royal', 'royal-07', 'blu-royal'], box: { left: 536, top: 710, width: 368, height: 526 } },
      { color: 'beige', aliases: ['grigio', 'beige'], box: { left: 952, top: 711, width: 361, height: 524 } },
      { color: 'rosso', aliases: ['rosso-03'], box: { left: 101, top: 1356, width: 370, height: 523 } },
      { color: 'verde', aliases: ['verde-04'], box: { left: 510, top: 1356, width: 366, height: 524 } },
      { color: 'blu-navy', aliases: ['blu-05', 'navy', 'blu-navy', 'blu-notte'], box: { left: 935, top: 1356, width: 360, height: 524 } }
    ]
  },
  '8': {
    source: path.resolve(__dirname, '..', 'public', '8.png'),
    lineName: 'planning',
    modelCodes: ['148'],
    items: [
      { color: 'blu-navy', aliases: ['blu-05', 'navy', 'blu-navy', 'blu-notte'], box: { left: 96, top: 1141, width: 604, height: 299 } },
      { color: 'nero', aliases: ['nero-02'], box: { left: 740, top: 1154, width: 575, height: 262 } },
      { color: 'blu', aliases: ['royal', 'royal-07', 'blu-royal'], box: { left: 90, top: 1465, width: 605, height: 299 } },
      { color: 'bordeaux', aliases: ['bordeaux-08', 'rosso', 'rosso-03'], box: { left: 724, top: 1490, width: 603, height: 268 } }
    ]
  },
  '9': {
    source: path.resolve(__dirname, '..', 'public', '9.png'),
    lineName: 'rubis',
    modelCodes: ['70826', '72126', '71126', '71026', '72226'],
    items: [
      { color: 'verde', aliases: ['verde-04'], box: { left: 195, top: 112, width: 315, height: 448 } },
      { color: 'rosso', aliases: ['rosso-03'], box: { left: 190, top: 714, width: 327, height: 455 } },
      { color: 'nero', aliases: ['nero-02'], box: { left: 561, top: 714, width: 318, height: 454 } },
      { color: 'blu-navy', aliases: ['blu-05', 'navy', 'blu-navy', 'blu-notte'], box: { left: 933, top: 714, width: 317, height: 455 } },
      { color: 'arancione', aliases: ['arancio', 'arancione-06'], box: { left: 190, top: 1330, width: 326, height: 450 } },
      { color: 'royal', aliases: ['royal-07', 'blu', 'blu-royal'], box: { left: 560, top: 1331, width: 320, height: 453 } },
      { color: 'beige', aliases: ['grigio', 'beige'], box: { left: 922, top: 1331, width: 316, height: 453 } }
    ]
  },
  '11': {
    source: path.resolve(__dirname, '..', 'public', '11.png'),
    lineName: 'amely',
    modelCodes: ['70726', '70326'],
    items: [
      { color: 'beige', aliases: ['cuoio', 'marrone', 'cognac'], box: { left: 192, top: 333, width: 487, height: 647 } },
      { color: 'nero', aliases: ['nero-02'], box: { left: 740, top: 336, width: 500, height: 664 } },
      { color: 'grigio', aliases: ['antracite'], box: { left: 200, top: 1122, width: 465, height: 613 } },
      { color: 'blu', aliases: ['blu-05', 'navy', 'blu-navy'], box: { left: 760, top: 1140, width: 470, height: 615 } }
    ]
  },
  '12': {
    source: path.resolve(__dirname, '..', 'public', '12.png'),
    lineName: 'madrid',
    modelCodes: ['131', '134', '143', '144'],
    items: [
      { color: 'nero', aliases: ['nero-02'], box: { left: 164, top: 270, width: 286, height: 430 } },
      { color: 'bordeaux', aliases: ['bordeaux-08'], box: { left: 570, top: 312, width: 274, height: 411 } },
      { color: 'arancione', aliases: ['arancio', 'arancione-06'], box: { left: 153, top: 1066, width: 333, height: 513 } },
      { color: 'royal', aliases: ['blu', 'blu-royal'], box: { left: 571, top: 1120, width: 319, height: 478 } },
      { color: 'bianco', aliases: ['avorio', 'sabbia'], box: { left: 954, top: 1130, width: 315, height: 478 } }
    ]
  },
  '13': {
    source: path.resolve(__dirname, '..', 'public', '13.png'),
    lineName: 'madrid',
    modelCodes: ['131', '134', '143', '144', '139', '153'],
    items: [
      { color: 'verde-tiffany', aliases: ['turchese', 'verde-acqua'], box: { left: 164, top: 222, width: 336, height: 506 } },
      { color: 'wenge', aliases: ['tortora', 'marrone'], box: { left: 555, top: 222, width: 335, height: 503 } },
      { color: 'verde-mela', aliases: ['salvia', 'lime', 'verde-chiaro'], box: { left: 934, top: 222, width: 352, height: 541 } },
      { color: 'rosso', aliases: ['rosso-03'], box: { left: 130, top: 1062, width: 370, height: 567 } },
      { color: 'verde', aliases: ['verde-04', 'bosco'], box: { left: 562, top: 1070, width: 327, height: 504 } },
      { color: 'blu-navy', aliases: ['blu-05', 'navy', 'blu-navy', 'blu-notte'], box: { left: 960, top: 1110, width: 348, height: 520 } }
    ]
  },
  '16': {
    source: path.resolve(__dirname, '..', 'public', '16.png'),
    lineName: 'michi',
    modelCodes: ['75226'],
    items: [
      { color: 'rosso', aliases: ['rosso-03'], box: { left: 502, top: 302, width: 387, height: 565 } },
      { color: 'royal', aliases: ['blu', 'blu-royal'], box: { left: 90, top: 310, width: 375, height: 559 } },
      { color: 'verde', aliases: ['verde-04'], box: { left: 950, top: 310, width: 369, height: 544 } },
      { color: 'blu-navy', aliases: ['blu-05', 'navy', 'blu-navy', 'blu-notte'], box: { left: 124, top: 1081, width: 355, height: 523 } },
      { color: 'arancione', aliases: ['arancio', 'arancione-06'], box: { left: 550, top: 1080, width: 359, height: 527 } },
      { color: 'nero', aliases: ['nero-02'], box: { left: 966, top: 1081, width: 352, height: 523 } }
    ]
  }
};

async function extractPage(pageKey) {
  const cfg = LINE_CONFIGS[pageKey];
  if (!cfg) {
    console.error(`Configurazione non trovata per pagina ${pageKey}`);
    return;
  }

  if (!fs.existsSync(cfg.source)) {
    console.error(`File sorgente non trovato: ${cfg.source}`);
    return;
  }

  console.log(`\n=== Estrazione Linea ${cfg.lineName.toUpperCase()} da pagina ${pageKey} (${path.basename(cfg.source)}) ===`);

  for (const item of cfg.items) {
    const mainFilename = `${cfg.lineName}_${item.color}.jpg`;
    const mainPath = path.join(COVERS_DIR, mainFilename);

    try {
      // Ritaglio in alta qualità con sharp (JPEG q:92)
      await sharp(cfg.source)
        .extract(item.box)
        .jpeg({ quality: 92 })
        .toFile(mainPath);

      console.log(`✓ Salvato: ${mainFilename} (${item.box.width}x${item.box.height}px)`);
    } catch (err) {
      console.error(`✗ Errore nel ritaglio di ${item.color}:`, err.message);
    }
  }

  console.log(`Estrazione completata con successo per ${cfg.lineName}!`);
}

async function main() {
  const args = process.argv.slice(2);
  let pagesToRun = [];

  if (args.length === 0 || args[0] === 'all') {
    pagesToRun = Object.keys(LINE_CONFIGS);
  } else {
    pagesToRun = args;
  }

  for (const pageKey of pagesToRun) {
    await extractPage(pageKey);
  }
}

main().catch(console.error);
