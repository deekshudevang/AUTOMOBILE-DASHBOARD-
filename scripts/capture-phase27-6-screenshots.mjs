import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const OUT_DIR = path.resolve(process.cwd(), 'docs/audits/uiux-audit/screenshots-after/phase-27-6');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const VIEWPORTS = [
  { file: '01_ultrawide_3440x1440.png', width: 3440, height: 1440, name: 'Ultrawide 21:9' },
  { file: '02_desktop_4k_2560x1440.png', width: 2560, height: 1440, name: 'Desktop 4K UHD' },
  { file: '03_standard_desktop_1920x1080.png', width: 1920, height: 1080, name: 'Standard Desktop 1080p' },
  { file: '04_standard_laptop_1366x768.png', width: 1366, height: 768, name: 'Standard Laptop' },
  { file: '05_tablet_landscape_1024x768.png', width: 1024, height: 768, name: 'Tablet Landscape' },
  { file: '06_tablet_portrait_768x1024.png', width: 768, height: 1024, name: 'Tablet Portrait' },
  { file: '07_mobile_large_414x896.png', width: 414, height: 896, name: 'Large Mobile (iPhone Pro Max)' },
  { file: '08_mobile_compact_390x844.png', width: 390, height: 844, name: 'Compact Mobile (390x844)' },
];

async function capture() {
  console.log('Capturing Phase 27.6 Multi-Viewport Responsiveness & Accessibility Screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    console.log(`Setting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(APP_URL, { waitUntil: 'networkidle0' });
    await sleep(1500);

    const outPath = path.join(OUT_DIR, vp.file);
    await page.screenshot({ path: outPath });
    console.log(`  ✓ Captured ${vp.file}`);
  }

  await browser.close();
  console.log('All 8 multi-viewport screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Multi-viewport screenshot capture failed:', err);
  process.exit(1);
});
