const sharp = require('sharp');
const fs = require('fs');

async function doExtract() {
  const tasks = [
    // PAGE 1
    { page: 1, type: 'cover', code: '70126', box: { left: 250, top: 150, width: 620, height: 900 } },
    { page: 1, type: 'interior', code: '70126', box: { left: 1000, top: 660, width: 480, height: 380 } },

    // PAGE 2
    { page: 2, type: 'cover', code: '70226', box: { left: 100, top: 140, width: 380, height: 530 } },
    { page: 2, type: 'interior', code: '70226', box: { left: 1050, top: 300, width: 460, height: 340 } },
    { page: 2, type: 'cover', code: '70426', box: { left: 100, top: 1250, width: 380, height: 530 } },
    { page: 2, type: 'interior', code: '70426', box: { left: 1050, top: 1400, width: 460, height: 350 } },

    // PAGE 3
    { page: 3, type: 'cover', code: '70526', box: { left: 170, top: 140, width: 390, height: 530 } },
    { page: 3, type: 'interior', code: '70526', box: { left: 1130, top: 290, width: 450, height: 360 } },
    { page: 3, type: 'cover', code: '70626', box: { left: 170, top: 1250, width: 390, height: 530 } },
    { page: 3, type: 'interior', code: '70626', box: { left: 1130, top: 1400, width: 450, height: 350 } },

    // PAGE 4
    { page: 4, type: 'cover', code: '73226', box: { left: 100, top: 140, width: 370, height: 530 } },
    { page: 4, type: 'interior', code: '73226', box: { left: 1040, top: 270, width: 470, height: 370 } },
    { page: 4, type: 'cover', code: '73526', box: { left: 100, top: 1240, width: 370, height: 530 } },
    { page: 4, type: 'interior', code: '73526', box: { left: 1050, top: 1390, width: 460, height: 300 } },

    // PAGE 5
    { page: 5, type: 'cover', code: '73326', box: { left: 150, top: 150, width: 380, height: 520 } },
    { page: 5, type: 'interior', code: '73326', box: { left: 1100, top: 290, width: 470, height: 350 } },
    { page: 5, type: 'cover', code: '73426', box: { left: 170, top: 1230, width: 390, height: 530 } },
    { page: 5, type: 'interior', code: '73426', box: { left: 1130, top: 1380, width: 460, height: 310 } },

    // PAGE 6
    { page: 6, type: 'cover', code: '74726', box: { left: 100, top: 110, width: 380, height: 530 } },
    { page: 6, type: 'interior', code: '74726', box: { left: 1080, top: 260, width: 460, height: 340 } },
    { page: 6, type: 'cover', code: '71226', box: { left: 80, top: 1250, width: 410, height: 530 } },
    { page: 6, type: 'interior', code: '71226', box: { left: 1030, top: 1320, width: 450, height: 350 } },

    // PAGE 7
    { page: 7, type: 'cover', code: '71926', box: { left: 160, top: 110, width: 370, height: 520 } },
    { page: 7, type: 'interior', code: '71926', box: { left: 1120, top: 140, width: 440, height: 320 } },
    { page: 7, type: 'cover', code: '110', box: { left: 1200, top: 1310, width: 330, height: 430 } },
    { page: 7, type: 'interior', code: '110', box: { left: 1000, top: 1490, width: 220, height: 180 } },
    { page: 7, type: 'cover', code: '111', box: { left: 1200, top: 1730, width: 330, height: 430 } },
    { page: 7, type: 'interior', code: '111', box: { left: 1000, top: 1900, width: 220, height: 180 } },

    // PAGE 8
    { page: 8, type: 'cover', code: '148', box: { left: 90, top: 150, width: 820, height: 420 } },
    { page: 8, type: 'interior', code: '148', box: { left: 60, top: 560, width: 490, height: 260 } },
    { page: 8, type: 'cover', code: '70826', box: { left: 80, top: 1230, width: 340, height: 530 } },
    { page: 8, type: 'interior', code: '70826', box: { left: 1030, top: 1380, width: 460, height: 350 } },

    // PAGE 9
    { page: 9, type: 'cover', code: '72126', box: { left: 170, top: 130, width: 340, height: 530 } },
    { page: 9, type: 'interior', code: '72126', box: { left: 1120, top: 290, width: 400, height: 340 } },
    { page: 9, type: 'cover', code: '71126', box: { left: 150, top: 1230, width: 380, height: 530 } },
    { page: 9, type: 'interior', code: '71126', box: { left: 1100, top: 1380, width: 470, height: 350 } },

    // PAGE 10
    { page: 10, type: 'cover', code: '71026', box: { left: 90, top: 150, width: 380, height: 530 } },
    { page: 10, type: 'interior', code: '71026', box: { left: 1040, top: 290, width: 470, height: 340 } },
    { page: 10, type: 'cover', code: '75226', box: { left: 80, top: 1230, width: 390, height: 530 } },
    { page: 10, type: 'interior', code: '75226', box: { left: 1040, top: 1370, width: 470, height: 340 } },

    // PAGE 11
    { page: 11, type: 'cover', code: '70726', box: { left: 180, top: 140, width: 390, height: 530 } },
    { page: 11, type: 'interior', code: '70726', box: { left: 1160, top: 310, width: 420, height: 350 } },
    { page: 11, type: 'cover', code: '70326', box: { left: 180, top: 1220, width: 390, height: 530 } },
    { page: 11, type: 'interior', code: '70326', box: { left: 1150, top: 1370, width: 440, height: 330 } },

    // PAGE 12
    { page: 12, type: 'cover', code: 'Q24113', box: { left: 90, top: 160, width: 410, height: 580 } },
    { page: 12, type: 'interior', code: 'Q24113', box: { left: 950, top: 250, width: 560, height: 370 } },
    { page: 12, type: 'cover', code: '134', box: { left: 1010, top: 1330, width: 410, height: 460 } },
    { page: 12, type: 'interior', code: '134', box: { left: 790, top: 1250, width: 300, height: 210 } },

    // PAGE 13
    { page: 13, type: 'cover', code: '144', box: { left: 480, top: 180, width: 410, height: 460 } },
    { page: 13, type: 'interior', code: '144', box: { left: 280, top: 150, width: 280, height: 210 } },
    { page: 13, type: 'cover', code: '143', box: { left: 150, top: 1160, width: 500, height: 510 } },
    { page: 13, type: 'interior', code: '143', box: { left: 280, top: 150, width: 280, height: 210 } },
    { page: 13, type: 'cover', code: '153', box: { left: 150, top: 1160, width: 500, height: 510 } },
    { page: 13, type: 'interior', code: '153', box: { left: 280, top: 150, width: 280, height: 210 } },

    // PAGE 14
    { page: 14, type: 'cover', code: '131', box: { left: 1100, top: 110, width: 360, height: 530 } },
    { page: 14, type: 'interior', code: '131', box: { left: 150, top: 1210, width: 350, height: 490 } },
    { page: 14, type: 'cover', code: '139', box: { left: 150, top: 1210, width: 350, height: 490 } },
    { page: 14, type: 'interior', code: '139', box: { left: 150, top: 1210, width: 350, height: 490 } },
    { page: 14, type: 'cover', code: '142', box: { left: 330, top: 1810, width: 180, height: 250 } },
    { page: 14, type: 'interior', code: '142', box: { left: 150, top: 1210, width: 350, height: 490 } },

    // PAGE 15
    { page: 15, type: 'cover', code: '140', box: { left: 200, top: 160, width: 340, height: 510 } },
    { page: 15, type: 'interior', code: '140', box: { left: 500, top: 360, width: 320, height: 220 } },
    { page: 15, type: 'cover', code: '137', box: { left: 200, top: 640, width: 180, height: 270 } },
    { page: 15, type: 'interior', code: '137', box: { left: 500, top: 360, width: 320, height: 220 } },
    { page: 15, type: 'cover', code: '132', box: { left: 390, top: 1320, width: 330, height: 480 } },
    { page: 15, type: 'interior', code: '132', box: { left: 250, top: 1450, width: 170, height: 210 } },

    // PAGE 16
    { page: 16, type: 'cover', code: '112', box: { left: 190, top: 70, width: 420, height: 690 } },
    { page: 16, type: 'interior', code: '112', box: { left: 760, top: 450, width: 190, height: 280 } },
    { page: 16, type: 'cover', code: '158', box: { left: 1100, top: 810, width: 420, height: 620 } },
    { page: 16, type: 'interior', code: '158', box: { left: 1100, top: 810, width: 420, height: 620 } },
    { page: 16, type: 'cover', code: '159', box: { left: 160, top: 1540, width: 430, height: 630 } },
    { page: 16, type: 'interior', code: '159', box: { left: 160, top: 1540, width: 430, height: 630 } },

    // PAGE 17
    { page: 17, type: 'cover', code: '179', box: { left: 200, top: 220, width: 850, height: 640 } },
    { page: 17, type: 'interior', code: '179', box: { left: 200, top: 220, width: 850, height: 640 } },
    { page: 17, type: 'cover', code: '180', box: { left: 200, top: 1150, width: 850, height: 670 } },
    { page: 17, type: 'interior', code: '180', box: { left: 200, top: 1150, width: 850, height: 670 } },

    // PAGE 18
    { page: 18, type: 'cover', code: '124', box: { left: 700, top: 170, width: 820, height: 600 } },
    { page: 18, type: 'interior', code: '124', box: { left: 1070, top: 760, width: 310, height: 250 } },
    { page: 18, type: 'cover', code: '126', box: { left: 670, top: 1230, width: 600, height: 540 } },
    { page: 18, type: 'interior', code: '126', box: { left: 1220, top: 1390, width: 290, height: 250 } },

    // PAGE 19
    { page: 19, type: 'cover', code: '121', box: { left: 190, top: 140, width: 510, height: 750 } },
    { page: 19, type: 'interior', code: '121', box: { left: 670, top: 530, width: 390, height: 430 } },
    { page: 19, type: 'cover', code: '128', box: { left: 180, top: 1050, width: 710, height: 760 } },
    { page: 19, type: 'interior', code: '128', box: { left: 650, top: 1730, width: 410, height: 430 } },

    // PAGE 20
    { page: 20, type: 'cover', code: '125', box: { left: 930, top: 260, width: 580, height: 570 } },
    { page: 20, type: 'interior', code: '125', box: { left: 500, top: 690, width: 760, height: 450 } },
    { page: 20, type: 'cover', code: '1296', box: { left: 650, top: 1430, width: 810, height: 720 } },
    { page: 20, type: 'interior', code: '1296', box: { left: 140, top: 750, width: 370, height: 310 } }
  ];

  for (const t of tasks) {
    const pageFile = `/tmp/pdfpages/page_${String(t.page).padStart(2, '0')}.jpg`;
    const outPath = `public/agende/${t.type === 'cover' ? 'covers' : 'interiors'}/${t.code}.jpg`;
    try {
      await sharp(pageFile)
        .extract(t.box)
        .trim({ background: '#FFFFFF', threshold: 15 })
        .jpeg({ quality: 90 })
        .toFile(outPath);
      console.log(`[${t.type}] ${t.code} ok`);
    } catch (err) {
      console.error(`FAIL ${t.type} ${t.code}:`, err.message);
    }
  }
}

doExtract().then(() => console.log('ALL DONE!'));
