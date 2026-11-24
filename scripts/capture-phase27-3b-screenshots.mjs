import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const OUT_DIR = path.resolve(process.cwd(), 'docs/audits/uiux-audit/screenshots-after/phase-27-3b');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture() {
  console.log('Capturing Phase 27.3b Atelier Blade & Paint Speedforms Screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await sleep(1500);

  // Navigate to 3D Studio view via Command Palette
  await page.keyboard.down('Control');
  await page.keyboard.press('k');
  await page.keyboard.up('Control');
  await sleep(400);

  await page.keyboard.type('3d studio');
  await sleep(300);
  await page.keyboard.press('Enter');
  await sleep(2000);

  // Helper to click studio tab by text
  async function selectTab(tabName) {
    const tabButtons = await page.$$('div.no-scrollbar button');
    for (const btn of tabButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.trim().toLowerCase() === tabName.toLowerCase()) {
        await btn.click();
        await sleep(500);
        return true;
      }
    }
    return false;
  }

  // 1. Paint Studio Tab with 3D Sculpted Speedforms
  await selectTab('paint');
  await sleep(600);
  await page.screenshot({ path: path.join(OUT_DIR, '01_atelier_paint_speedforms.png') });
  console.log('  ✓ 01_atelier_paint_speedforms.png');

  // 2. Wheel Studio Tab with Fitment Diagram & Stance Sliders
  await selectTab('wheels');
  await sleep(600);
  await page.screenshot({ path: path.join(OUT_DIR, '02_atelier_wheel_fitment.png') });
  console.log('  ✓ 02_atelier_wheel_fitment.png');

  // 3. Vehicle Access Tab with Aperture Sliders
  await selectTab('access');
  await sleep(600);
  await page.screenshot({ path: path.join(OUT_DIR, '03_atelier_vehicle_access.png') });
  console.log('  ✓ 03_atelier_vehicle_access.png');

  // 4. Aero Package Tab with Wing Angle & Real Telemetry
  await selectTab('aero');
  await sleep(600);
  await page.screenshot({ path: path.join(OUT_DIR, '04_atelier_aero_package.png') });
  console.log('  ✓ 04_atelier_aero_package.png');

  // 5. Cockpit Trim Tab with Luxury Materials & Contrast Stitching
  await selectTab('cockpit');
  await sleep(600);
  await page.screenshot({ path: path.join(OUT_DIR, '05_atelier_cockpit_trim.png') });
  console.log('  ✓ 05_atelier_cockpit_trim.png');

  await browser.close();
  console.log('Phase 27.3b screenshot capture complete!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
