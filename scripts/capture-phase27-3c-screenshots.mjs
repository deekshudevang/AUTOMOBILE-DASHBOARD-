import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const OUT_DIR = path.resolve(process.cwd(), 'docs/audits/uiux-audit/screenshots-after/phase-27-3c');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture() {
  console.log('Capturing Phase 27.3c Car Studio Overhaul Screenshots...');
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

  // 1. Open Global OEM Parts Drawer via 'P' hotkey
  await page.keyboard.press('p');
  await sleep(800);
  await page.screenshot({ path: path.join(OUT_DIR, '01_parts_drawer_open.png') });
  console.log('  ✓ 01_parts_drawer_open.png');

  // 2. Hover over first donor component card to trigger transient hover preview
  const partCards = await page.$$('div.no-scrollbar > div');
  if (partCards.length > 0) {
    await partCards[0].hover();
    await sleep(600);
    await page.screenshot({ path: path.join(OUT_DIR, '02_parts_drawer_hover_preview.png') });
    console.log('  ✓ 02_parts_drawer_hover_preview.png');
  }

  // Close parts drawer for framing screenshot
  await page.keyboard.press('p');
  await sleep(600);

  // 3. 50-Car Camera Framing with zero clipping & stage clearance
  await page.screenshot({ path: path.join(OUT_DIR, '03_camera_framing_long_hypercar.png') });
  console.log('  ✓ 03_camera_framing_long_hypercar.png');

  // 4. Mobile Viewport (390 x 844 iPhone 14 / modern mobile) - Collapsed Bottom Sheet
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    // Access useUiStore in browser context to set mobileSheetState to collapsed
    const w = window;
    // Or click toggle button
  });
  await sleep(800);

  // Click mobile toggle button until collapsed
  const toggleBtn = await page.$('button[aria-label="Toggle mobile sheet height"]');
  // Cycle to collapsed if needed
  await page.screenshot({ path: path.join(OUT_DIR, '04_mobile_sheet_half.png') });
  console.log('  ✓ 04_mobile_sheet_half.png');

  if (toggleBtn) {
    // Click once: half -> expanded
    await toggleBtn.click();
    await sleep(600);
    await page.screenshot({ path: path.join(OUT_DIR, '05_mobile_sheet_expanded.png') });
    console.log('  ✓ 05_mobile_sheet_expanded.png');

    // Click again: expanded -> collapsed
    await toggleBtn.click();
    await sleep(600);
    await page.screenshot({ path: path.join(OUT_DIR, '06_mobile_sheet_collapsed.png') });
    console.log('  ✓ 06_mobile_sheet_collapsed.png');
  }

  await browser.close();
  console.log('Phase 27.3c screenshot capture complete!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
