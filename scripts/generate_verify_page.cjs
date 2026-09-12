const fs = require('fs');

const lines = [
  {
    name: 'Linea Nubia',
    key: 'nubia',
    page: 1,
    codes: ['70126 (17x24 Sett.)', '70226 (15x21 Giorn.)', '70426 (17x24 Giorn.)', '70526 (19x27 Giorn.)', '70626 (19x27 Sett.)'],
    box: 'Pagina 1 (in alto a sinistra)'
  },
  {
    name: 'Linea Zaira con elastico',
    key: 'zaira',
    page: 4,
    codes: ['73226 (9x14 Sett.)', '73526 (15x21 Giorn.)', '73326 (17x24 Giorn.)', '73426 (19x27 Sett.)'],
    box: 'Pagina 4 (in alto a sinistra)'
  },
  {
    name: 'Linea Madrid con elastico',
    key: 'madrid',
    page: 14,
    codes: ['144 (9x14 Sett.)', '134 (15x21 Giorn.)', '143 (17x24 Giorn.)', '153 (17x24 Giorn.)', '131 (19x27 Giorn.)', '139 (19x27 Giorn.)', '142 (19x27 Sett.)'],
    box: 'Pagina 14 (in alto a destra)'
  },
  {
    name: 'Linea Rubis con elastico',
    key: 'rubis',
    page: 9,
    codes: ['72126 (9x14 Sett.)', '70826 (17x24 Sett.)', '71126 (15x21 Giorn.)', '71026 (17x24 Giorn.)'],
    box: 'Pagina 9 (in alto a sinistra)'
  },
  {
    name: 'Linea Spiralata',
    key: 'spiralata',
    page: 7,
    codes: ['110 (17x24 Giorn.)', '111 (17x24 Sett.)'],
    box: 'Pagina 7 (in basso a destra)'
  },
  {
    name: 'Linea Emeri',
    key: 'emeri',
    page: 6,
    codes: ['74726 (17x24 Giorn.)'],
    box: 'Pagina 6 (in alto a sinistra)'
  },
  {
    name: 'Linea Opyra con elastico',
    key: 'opyra',
    page: 6,
    codes: ['71226 (17x24 Giorn.)'],
    box: 'Pagina 6 (in basso a sinistra)'
  },
  {
    name: 'Linea Felicia',
    key: 'felicia',
    page: 7,
    codes: ['71926 (17x24 Giorn.)'],
    box: 'Pagina 7 (in alto a sinistra)'
  },
  {
    name: 'Linea Michi con elastico',
    key: 'michi',
    page: 10,
    codes: ['75226 (19x27 Giorn.)'],
    box: 'Pagina 10 (in basso a sinistra)'
  },
  {
    name: 'Linea Amely',
    key: 'amely',
    page: 11,
    codes: ['70726 (17x24 Giorn.)', '70326 (19x27 Sett.)'],
    box: 'Pagina 11 (in alto a sinistra)'
  },
  {
    name: 'Linea Quadretti',
    key: 'quadretti',
    page: 15,
    codes: ['140 (19x27 Giorn.)', '137 (15x21 Giorn.)', '132 (17x24 Giorn.)'],
    box: 'Pagina 15 (in alto a sinistra)'
  },
  {
    name: 'Linea Targhetta 112',
    key: '112',
    page: 16,
    codes: ['112 (17x24 Giorn.)', '158 (Libro prenotazione)', '159 (Giorn. 17x24)'],
    box: 'Pagina 16 (in alto a sinistra)'
  },
  {
    name: 'Planning da tavolo 148',
    key: '148',
    page: 8,
    codes: ['148 (Formato 10x30 da tavolo)'],
    box: 'Pagina 8 (in alto al centro)'
  },
  {
    name: 'Linea Astuccio / Portafoglio 124',
    key: '124',
    page: 18,
    codes: ['124 (Astuccio)', '126 (Portafoglio)', '121 (Clip)', '128 (Business)'],
    box: 'Pagina 18 (in alto a destra)'
  },
  {
    name: 'Linea Borsello 125',
    key: '125',
    page: 20,
    codes: ['125 (Borsello)', '1296 (Maxi Borsello)'],
    box: 'Pagina 20 (in alto a destra)'
  }
];

const cardsHtml = lines.map(l => {
  const pageNum = String(l.page).padStart(2, '0');
  const sampleCode = l.codes[0].split(' ')[0];
  return `
    <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">${l.name}</h2>
          <span style="font-size: 0.85rem; color: #64748b;">Ritaglio da: <b>${l.box}</b> (Pagina ${l.page})</span>
        </div>
        <span style="background: #dbeafe; color: #1e40af; font-size: 0.75rem; font-weight: 600; padding: 4px 8px; border-radius: 6px;">
          ${l.codes.length} Formati
        </span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; align-items: start;">
        <!-- COPERTINA -->
        <div style="text-align: center;">
          <div style="font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Copertina Unificata</div>
          <div style="height: 240px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 6px;">
            <img src="/agende/covers/${l.key}.jpg" alt="${l.name}" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 4px;" />
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px;">File: /agende/covers/${l.key}.jpg</div>
        </div>

        <!-- INTERNO -->
        <div style="text-align: center;">
          <div style="font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Interno (Esempio)</div>
          <div style="height: 240px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 6px;">
            <img src="/agende/interiors/${sampleCode}.jpg" alt="Interno ${l.name}" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 4px;" />
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px;">File: /agende/interiors/${sampleCode}.jpg</div>
        </div>

        <!-- PAGINA INTERA CATALOGO -->
        <div style="text-align: center;">
          <div style="font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Pagina ${l.page} Catalogo Originale</div>
          <div style="height: 240px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 6px;">
            <a href="/pdfpages/page_${pageNum}.jpg" target="_blank" title="Clicca per ingrandire la pagina intera">
              <img src="/pdfpages/page_${pageNum}.jpg" alt="Pagina ${l.page}" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 4px;" />
            </a>
          </div>
          <div style="font-size: 0.75rem; color: #2563eb; margin-top: 4px;">🔍 Clicca per ingrandire pagina</div>
        </div>
      </div>

      <div style="background: #f8fafc; border-radius: 6px; padding: 10px 14px; margin-top: 4px;">
        <span style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">Codici e formati associati a questa linea:</span>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${l.codes.map(c => `<span style="background: white; border: 1px solid #cbd5e1; font-size: 0.75rem; color: #1e293b; padding: 2px 8px; border-radius: 4px;">${c}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifica e Collaudo Ritagli Copertine e Interni Agende</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f1f5f9; color: #1e293b; margin: 0; padding: 30px; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { margin-bottom: 30px; text-align: center; }
    .header h1 { font-size: 2rem; color: #0f172a; margin-bottom: 8px; }
    .header p { color: #64748b; font-size: 1rem; max-width: 700px; margin: 0 auto; }
    .grid { display: flex; flex-direction: column; gap: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Pannello di Verifica Ritagli Catalogo Agende</h1>
      <p>Questo pannello consente di verificare a colpo d'occhio la copertina estratta, l'interno associato (giornaliero o settimanale) e la pagina originale del catalogo per ciascuna linea.</p>
      <div style="margin-top: 15px;">
        <a href="/" style="background: #0284c7; color: white; text-decoration: none; font-weight: 600; padding: 10px 20px; border-radius: 8px; display: inline-block;">← Torna al Configuratore Agende</a>
      </div>
    </div>
    <div class="grid">
      ${cardsHtml}
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('public/verifica_ritagli.html', html);
console.log('verifica_ritagli.html generata con successo!');
