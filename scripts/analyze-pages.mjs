import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzePage(pageNumber) {
  const filePath = `public/${pageNumber}.png`;
  if (!fs.existsSync(filePath)) return null;

  const imageBuffer = fs.readFileSync(filePath);
  const base64Data = imageBuffer.toString('base64');

  const prompt = `Analizza questa pagina di catalogo agende (${pageNumber}.png).
Dimmi:
1. Qual è il titolo o nome della linea/modello (es. Nubia, Zaira, Madrid, Rubis, Spiralata, ecc.)?
2. Quali sono i codici articolo presenti su questa pagina (es. 70126, 70226, 110, ecc.)?
3. C'è un'immagine di copertina? Descrivila brevemente (es. foto grande dell'agenda chiusa in alto a destra/sinistra).
4. C'è un'immagine dell'interno dell'agenda (pagine interne aperte con griglia giornaliera o settimanale)? Se sì, è Giornaliero o Settimanale?
5. Fornisci le coordinate approssimative in percentuale (ymin, xmin, ymax, xmax da 0 a 1000) per:
   - "cover": il riquadro dell'agenda/copertina principale
   - "interior": il riquadro dell'interno aperto (se presente)

Rispondi in formato JSON:
{
  "page": ${pageNumber},
  "linea": "...",
  "codici": ["..."],
  "tipoLayout": "Giornaliera" | "Settimanale" | "Planning" | "Altro",
  "hasCover": true,
  "coverBox": [ymin, xmin, ymax, xmax],
  "hasInterior": true,
  "interiorType": "giornaliero" | "settimanale" | "planning" | "nessuno",
  "interiorBox": [ymin, xmin, ymax, xmax]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/png',
                data: base64Data
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    console.log(`--- PAGINA ${pageNumber} ---`);
    console.log(response.text);
    return JSON.parse(response.text);
  } catch (err) {
    console.error(`Errore pagina ${pageNumber}:`, err);
    return null;
  }
}

async function main() {
  const results = [];
  for (let i = 1; i <= 19; i++) {
    const res = await analyzePage(i);
    results.push(res);
  }
  fs.writeFileSync('scripts/pages_catalog_analysis.json', JSON.stringify(results, null, 2));
  console.log('Analisi completata con successo!');
}

main();
