const sharp = require('sharp');

async function testInteriors() {
  const missing = [
    // [page, code, left, top, width, height]
    // Nubia Large & maxi (page 3)
    [3, '70526', 1100, 270, 420, 360],
    [3, '70626', 1100, 1370, 420, 350],

    // Zaira (page 4 & 5)
    [4, '73226', 1030, 260, 440, 360],
    [4, '73526', 1030, 1370, 430, 300],
    [5, '73326', 1080, 270, 440, 350],
    [5, '73426', 1100, 1360, 440, 310],

    // Emeri & Opyra (page 6)
    [6, '74726', 1060, 240, 440, 340],
    [6, '71226', 1020, 1300, 430, 350],

    // Felicia (page 7)
    [7, '71926', 1100, 120, 430, 320],

    // Rubis (page 8, 9, 10)
    [8, '70826', 1020, 1360, 440, 350],
    [9, '72126', 1100, 270, 390, 340],
    [9, '71126', 1080, 1360, 450, 350],
    [10, '71026', 1020, 270, 450, 340],
    [10, '75226', 1020, 1350, 450, 340],

    // Amely (page 11)
    [11, '70726', 1140, 290, 420, 350],
    [11, '70326', 1130, 1350, 440, 330],

    // Q24113 (page 12)
    [12, 'Q24113', 950, 230, 530, 380],

    // 126 (page 18)
    [18, '126', 1200, 1370, 300, 250]
  ];

  for (const [page, code, left, top, width, height] of missing) {
    try {
      await sharp(`/tmp/pdfpages/page_${String(page).padStart(2, '0')}.jpg`)
        .extract({ left, top, width, height })
        .trim({ background: '#FFFFFF', threshold: 15 })
        .jpeg({ quality: 90 })
        .toFile(`public/agende/interiors/${code}.jpg`);
      console.log(`[Interior] ${code} ok`);
    } catch(e) {
      console.error(`FAIL Interior ${code}:`, e.message);
    }
  }
}

testInteriors();
