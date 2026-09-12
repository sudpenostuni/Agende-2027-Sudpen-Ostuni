const sharp = require('sharp');
const fs = require('fs');

async function fix() {
  const missing = [
    // [page, code, left, top, width, height]
    [2, '70226', 1050, 290, 460, 350],
    [2, '70426', 1050, 1390, 460, 350],
    [3, '70526', 1100, 270, 430, 360],
    [3, '70626', 1100, 1370, 430, 350],
    [4, '73226', 1030, 260, 450, 360],
    [4, '73526', 1030, 1370, 440, 320],
    [5, '73326', 1080, 270, 450, 350],
    [5, '73426', 1100, 1360, 450, 320],
    [6, '74726', 1060, 240, 450, 340],
    [6, '71226', 1020, 1300, 440, 350],
    [7, '71926', 1100, 120, 440, 320],
    [8, '70826', 1020, 1360, 450, 350],
    [9, '72126', 1100, 270, 400, 340],
    [9, '71126', 1080, 1360, 460, 350],
    [10, '71026', 1020, 270, 460, 340],
    [10, '75226', 1020, 1350, 460, 340],
    [11, '70726', 1140, 290, 430, 350],
    [11, '70326', 1130, 1350, 450, 330],
    [12, 'Q24113', 950, 230, 540, 380],
    [16, '158', 1080, 790, 430, 590],
    [18, '126', 1200, 1370, 310, 260]
  ];

  for (const [page, code, left, top, width, height] of missing) {
    try {
      await sharp(`/tmp/pdfpages/page_${String(page).padStart(2, '0')}.jpg`)
        .extract({ left, top, width, height })
        .jpeg({ quality: 90 })
        .toFile(`public/agende/interiors/${code}.jpg`);
      console.log(`[Interior fixed] ${code}`);
    } catch (e) {
      console.error(`ERR [Interior] ${code}:`, e.message);
    }
  }
}

fix();
