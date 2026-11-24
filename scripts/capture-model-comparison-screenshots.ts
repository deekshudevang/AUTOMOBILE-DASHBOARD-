import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

const CARS = [
  { id: 'porsche_911_gt3_rs', file: 'porsche_911_gt3_rs_992_2022.json', name: 'Porsche 911 GT3 RS' },
  { id: 'lamborghini_huracan_sto', file: 'supercars/lamborghini_huracan_sto.json', name: 'Lamborghini Huracan STO' },
  { id: 'ferrari_f8_tributo', file: 'supercars/ferrari_f8_tributo.json', name: 'Ferrari F8 Tributo' },
  { id: 'mclaren_720s', file: 'supercars/mclaren_720s.json', name: 'McLaren 720S' },
  { id: 'nissan_gt_r_r35', file: 'sports_cars/nissan_gt_r_r35.json', name: 'Nissan GT-R R35' },
  { id: 'bmw_m4_csl', file: 'sports_cars/bmw_m4_csl.json', name: 'BMW M4 CSL' }
];

async function main() {
  const outputDir = path.resolve(process.cwd(), 'docs/assets');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('[Puppeteer] Launching browser to capture before/after comparison screenshots...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });

    console.log('[Puppeteer] Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for store to be ready
    await page.waitForFunction(() => !!(window as any).__autoverse_store, { timeout: 15000 });
    console.log('[Puppeteer] AutoVerse store detected.');

    for (const car of CARS) {
      console.log(`\n--- Capturing screenshots for ${car.name} (${car.id}) ---`);

      // 1. Before: Legacy Engine
      await page.evaluate((carFile) => {
        const store = (window as any).__autoverse_store;
        store.setState({ useGeometryEngineV2: false });
        store.getState().loadVehicleByFile(carFile);
        store.getState().setCameraPreset('isometric');
      }, car.file);

      await new Promise(r => setTimeout(r, 1800));
      const beforeFile = path.join(outputDir, `${car.id}_legacy_before.png`);
      await page.screenshot({ path: beforeFile });
      console.log(`✓ Saved BEFORE: ${beforeFile}`);

      // 2. After: V2 Coachwork Engine
      await page.evaluate((carFile) => {
        const store = (window as any).__autoverse_store;
        store.setState({ useGeometryEngineV2: true });
        store.getState().loadVehicleByFile(carFile);
        store.getState().setCameraPreset('isometric');
      }, car.file);

      await new Promise(r => setTimeout(r, 1800));
      const afterFile = path.join(outputDir, `${car.id}_v2_after.png`);
      await page.screenshot({ path: afterFile });
      console.log(`✓ Saved AFTER: ${afterFile}`);
    }

    console.log('\n[Puppeteer] All 12 comparison screenshots successfully captured under docs/assets/!');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('[Puppeteer Error]', err);
  process.exit(1);
});
