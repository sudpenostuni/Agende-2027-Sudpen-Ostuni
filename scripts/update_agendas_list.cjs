const fs = require('fs');
let code = fs.readFileSync('src/data/agendasList.ts', 'utf8');

// Sostituiamo ogni blocco di codice impostando immagine e immagineInterno
// I codici sono tipo codice: '70226', immagine: ''
const regex = /codice:\s*'([^']+)'[\s\S]*?immagine:\s*''/g;

code = code.replace(/codice:\s*'([^']+)'([\s\S]*?)immagine:\s*''/g, (match, pCodice, middle) => {
  const cover = `/agende/covers/${pCodice}.jpg`;
  const interior = `/agende/interiors/${pCodice}.jpg`;
  return `codice: '${pCodice}'${middle}immagine: '${cover}',\n    immagineInterno: '${interior}'`;
});

fs.writeFileSync('src/data/agendasList.ts', code, 'utf8');
console.log('agendasList.ts updated successfully!');
