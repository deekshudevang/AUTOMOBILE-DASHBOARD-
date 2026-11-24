import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const OUT_DIR = path.resolve(process.cwd(), 'docs/audits/uiux-audit/screenshots-after/phase-27-7');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture() {
  console.log('Capturing Phase 27.7 Motion, Audio & Material Shaders Screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await sleep(1500);

  // 1. Header with Tactile Audio Feedback enabled
  // Click audio button to toggle sounds on
  const audioBtn = await page.$('button[aria-label*="mechanical sound effects"]');
  if (audioBtn) {
    await audioBtn.click();
    await sleep(400);
  }
  await page.screenshot({ path: path.join(OUT_DIR, '01_motion_audio_header_feedback.png') });
  console.log('  ✓ 01_motion_audio_header_feedback.png');

  // 2. Reflective Onyx Floor & Studio Lighting
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '02_reflective_onyx_floor_lighting.png') });
  console.log('  ✓ 02_reflective_onyx_floor_lighting.png');

  // 3. Vehicle Access Apertures Panel
  // In Atelier blade, click the "Access" tab
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Access')) {
      await b.click();
      await sleep(600);
      break;
    }
  }

  // Click OPEN EVERYTHING button
  const allBtns = await page.$$('button');
  for (const b of allBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('OPEN EVERYTHING')) {
      await b.click();
      await sleep(1200);
      break;
    }
  }

  await page.screenshot({ path: path.join(OUT_DIR, '03_tactile_access_apertures.png') });
  console.log('  ✓ 03_tactile_access_apertures.png');

  await browser.close();
  console.log('All Phase 27.7 screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Phase 27.7 screenshot capture failed:', err);
  process.exit(1);
});
