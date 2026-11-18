import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VEHICLES = [
  { id: 'porsche_911_gt3_rs', file: 'porsche_911_gt3_rs_992_2022.json' },
  { id: 'ferrari_488_pista', file: 'supercars/ferrari_488_pista.json' },
  { id: 'lamborghini_aventador_svj', file: 'supercars/lamborghini_aventador_svj.json' }
];

const BASE_ARTIFACT_DIR = 'C:\\Users\\deeks\\.gemini\\antigravity\\brain\\e8596c04-6833-4bac-91e5-2b61fbb37287\\rollout';

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
  console.log('Launching headless Chrome for 24-view rollout capture...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--window-size=1600,1000'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });

  console.log('Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  for (const veh of VEHICLES) {
    const dir = path.resolve(`docs/rollout/${veh.id}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const artifactDir = path.join(BASE_ARTIFACT_DIR, veh.id);
    if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

    console.log(`Loading vehicle ${veh.id} (${veh.file})...`);
    await page.evaluate(async (fileName) => {
      const store = (window).__autoverse_store;
      if (store) {
        await store.getState().loadVehicleByFile(fileName);
        store.getState().setPresentationMode('studio');
        store.setState({ isAutoRotate: false, useGeometryEngineV2: true });
      }
    }, veh.file);

    await new Promise(r => setTimeout(r, 2000));

    for (const angle of ANGLES) {
      console.log(`  [${veh.id}] Capturing ${angle.preset} -> ${angle.filename}...`);
      await page.evaluate((preset) => {
        const store = (window).__autoverse_store;
        if (store) {
          store.getState().setCameraPreset(preset);
          store.setState({ isAutoRotate: false });
        }
      }, angle.preset);

      // Allow camera transition to settle smoothly
      await new Promise(r => setTimeout(r, 1200));

      const outPath = path.join(dir, angle.filename);
      await page.screenshot({ path: outPath });

      const artifactPath = path.join(artifactDir, angle.filename);
      fs.copyFileSync(outPath, artifactPath);
    }
  }

  await browser.close();
  console.log('Successfully captured all 24 angles for Wave 1 pilots.');
}

main().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
