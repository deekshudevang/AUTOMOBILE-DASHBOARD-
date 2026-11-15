import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VEHICLES = [
  { id: 'porsche_911_gt3_rs', file: 'porsche_911_gt3_rs_992_2022.json' },
  { id: 'ferrari_488_pista', file: 'supercars/ferrari_488_pista.json' },
  { id: 'lamborghini_aventador_svj', file: 'supercars/lamborghini_aventador_svj.json' }
];

const ANGLES = [
  { preset: 'front', filename: 'front.png' },
  { preset: 'rear', filename: 'rear.png' },
  { preset: 'left', filename: 'left.png' },
  { preset: 'right', filename: 'right.png' },
  { preset: 'top', filename: 'top.png' },
  { preset: 'isometric', filename: 'perspective_3_4.png' },
  { preset: 'wheel', filename: 'wheel_closeup.png' },
  { preset: 'wing', filename: 'wing_closeup.png' }
];

async function main() {
  console.log('Launching headless Chrome for pilot vehicle screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--window-size=1600,1000'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });

  console.log('Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  for (const veh of VEHICLES) {
    const dir = path.resolve(`docs/pilot/${veh.id}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    console.log(`Loading vehicle ${veh.id} (${veh.file})...`);
    await page.evaluate(async (fileName) => {
      const store = (window).__autoverse_store;
      if (store) {
        await store.getState().loadVehicleByFile(fileName);
        store.getState().setPresentationMode('showroom'); // Clean showroom presentation
      }
    }, veh.file);

    await new Promise(r => setTimeout(r, 1500));

    for (const angle of ANGLES) {
      console.log(`  Capturing ${angle.preset} -> ${angle.filename}...`);
      await page.evaluate((preset) => {
        const store = (window).__autoverse_store;
        if (store) {
          store.getState().setCameraPreset(preset);
        }
      }, angle.preset);

      // Allow camera transition to settle smoothly
      await new Promise(r => setTimeout(r, 800));

      const outPath = path.join(dir, angle.filename);
      await page.screenshot({ path: outPath });
    }
  }

  await browser.close();
  console.log('Successfully captured all 8 angles for 3 pilot vehicles.');
}

main().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
