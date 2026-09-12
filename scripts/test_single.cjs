const sharp = require('sharp');

async function test() {
  // Page 7: 110 e 111 (W: 1654, H: 2339)
  // Let's crop safely within width: 1200 + 330 = 1530 <= 1654
  try {
    await sharp('/tmp/pdfpages/page_07.jpg')
      .extract({ left: 1150, top: 1250, width: 350, height: 450 })
      .jpeg({ quality: 90 })
      .toFile('public/agende/covers/110.jpg');
    console.log('110 cover ok');
  } catch(e) { console.error('110 err:', e.message); }

  try {
    await sharp('/tmp/pdfpages/page_07.jpg')
      .extract({ left: 1150, top: 1680, width: 350, height: 450 })
      .jpeg({ quality: 90 })
      .toFile('public/agende/covers/111.jpg');
    console.log('111 cover ok');
  } catch(e) { console.error('111 err:', e.message); }

  // Page 12: 134 cover
  try {
    await sharp('/tmp/pdfpages/page_12.jpg')
      .extract({ left: 950, top: 1300, width: 450, height: 480 })
      .jpeg({ quality: 90 })
      .toFile('public/agende/covers/134.jpg');
    console.log('134 cover ok');
  } catch(e) { console.error('134 err:', e.message); }

  // Page 14: 131 cover
  try {
    await sharp('/tmp/pdfpages/page_14.jpg')
      .extract({ left: 1050, top: 100, width: 400, height: 550 })
      .jpeg({ quality: 90 })
      .toFile('public/agende/covers/131.jpg');
    console.log('131 cover ok');
  } catch(e) { console.error('131 err:', e.message); }

  // Page 16: 158 cover & interior
  try {
    await sharp('/tmp/pdfpages/page_16.jpg')
      .extract({ left: 1050, top: 780, width: 420, height: 580 })
      .jpeg({ quality: 90 })
      .toFile('public/agende/covers/158.jpg');
    await sharp('/tmp/pdfpages/page_16.jpg')
      .extract({ left: 1050, top: 780, width: 420, height: 580 })
      .jpeg({ quality: 90 })
      .toFile('public/agende/interiors/158.jpg');
    console.log('158 ok');
  } catch(e) { console.error('158 err:', e.message); }

  // Page 18: 124 cover
  try {
    await sharp('/tmp/pdfpages/page_18.jpg')
      .extract({ left: 650, top: 150, width: 800, height: 550 })
      .jpeg({ quality: 90 })
      .toFile('public/agende/covers/124.jpg');
    console.log('124 cover ok');
  } catch(e) { console.error('124 err:', e.message); }

  // Page 20: 125 cover & 1296 cover
  try {
    await sharp('/tmp/pdfpages/page_20.jpg')
      .extract({ left: 900, top: 250, width: 550, height: 550 })
      .jpeg({ quality: 90 })
      .toFile('public/agende/covers/125.jpg');
    console.log('125 cover ok');
  } catch(e) { console.error('125 err:', e.message); }

  try {
    await sharp('/tmp/pdfpages/page_20.jpg')
      .extract({ left: 600, top: 1400, width: 800, height: 680 })
      .jpeg({ quality: 90 })
      .toFile('public/agende/covers/1296.jpg');
    console.log('1296 cover ok');
  } catch(e) { console.error('1296 err:', e.message); }
}

test();
