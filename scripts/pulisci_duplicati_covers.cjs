const fs = require('fs');
const path = require('path');

const COVERS_DIR = path.resolve(__dirname, '..', 'public', 'agende', 'covers');

// Definizione esatta dei file canonici che vogliamo preservare per ogni linea
const CANONICAL_COVERS = new Set([
  // Nubia
  'nubia_celeste.jpg',
  'nubia_arancione.jpg',
  'nubia_nero.jpg',
  'nubia_rosso.jpg',
  'nubia_royal.jpg',
  'nubia_blu.jpg',
  'nubia_verde.jpg',
  'nubia_bordeaux.jpg',

  // Madrid
  'madrid_nero.jpg',
  'madrid_rosso.jpg',
  'madrid_blu-navy.jpg',
  'madrid_blu.jpg',
  'madrid_bordeaux.jpg',
  'madrid_arancione.jpg',
  'madrid_royal.jpg',
  'madrid_bianco.jpg',
  'madrid_verde-tiffany.jpg',
  'madrid_wenge.jpg',
  'madrid_verde-mela.jpg',
  'madrid_verde.jpg',

  // Zaira
  'zaira_rosso.jpg',
  'zaira_bianco.jpg',
  'zaira_nero.jpg',
  'zaira_verde.jpg',
  'zaira_blu-navy.jpg',
  'zaira_arancione.jpg',
  'zaira_blu.jpg',

  // Opyra
  'opyra_blu.jpg',
  'opyra_nero.jpg',

  // Emeri
  'emeri_nero.jpg',
  'emeri_arancione.jpg',
  'emeri_blu.jpg',
  'emeri_beige.jpg',
  'emeri_rosso.jpg',
  'emeri_verde.jpg',
  'emeri_blu-navy.jpg',

  // Planning
  'planning_blu-navy.jpg',
  'planning_nero.jpg',
  'planning_blu.jpg',
  'planning_bordeaux.jpg',

  // Rubis
  'rubis_verde.jpg',
  'rubis_rosso.jpg',
  'rubis_nero.jpg',
  'rubis_blu-navy.jpg',
  'rubis_arancione.jpg',
  'rubis_royal.jpg',
  'rubis_beige.jpg',

  // Amely
  'amely_beige.jpg',
  'amely_nero.jpg',
  'amely_grigio.jpg',
  'amely_blu.jpg',

  // Michi
  'michi_rosso.jpg',
  'michi_royal.jpg',
  'michi_verde.jpg',
  'michi_blu-navy.jpg',
  'michi_arancione.jpg',
  'michi_nero.jpg'
]);

function runCleanup() {
  if (!fs.existsSync(COVERS_DIR)) {
    console.error(`La cartella non esiste: ${COVERS_DIR}`);
    return;
  }

  const files = fs.readdirSync(COVERS_DIR);
  console.log(`Scansione di ${files.length} file in ${COVERS_DIR}...`);

  let countDeleted = 0;
  let deletedFilesList = [];

  for (const file of files) {
    // Gestiamo solo i file con "_" che rappresentano varianti colore o duplicati
    if (file.includes('_')) {
      if (!CANONICAL_COVERS.has(file)) {
        const filePath = path.join(COVERS_DIR, file);
        fs.unlinkSync(filePath);
        deletedFilesList.push(file);
        countDeleted++;
      }
    }
  }

  console.log(`\nPulizia completata!`);
  console.log(`File eliminati: ${countDeleted}`);
  if (countDeleted > 0) {
    console.log('File rimossi:', deletedFilesList.join(', '));
  } else {
    console.log('Nessun duplicato rimosso.');
  }
}

runCleanup();
