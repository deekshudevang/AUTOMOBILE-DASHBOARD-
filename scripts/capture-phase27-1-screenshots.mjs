import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const OUT_DIR = path.resolve(process.cwd(), 'docs/audits/uiux-audit/screenshots-after/phase-27-1');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture() {
  console.log('Capturing Phase 27.1 Navigation & Dashboard Screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await sleep(1500);

  // 1. Redesigned Dashboard View
  await page.screenshot({ path: path.join(OUT_DIR, '01_dashboard_redesigned.png') });
  console.log('  ✓ 01_dashboard_redesigned.png');

  // 2. Open Command Palette via Ctrl+K
  await page.keyboard.down('Control');
  await page.keyboard.press('k');
  await page.keyboard.up('Control');
  await sleep(800);
  await page.screenshot({ path: path.join(OUT_DIR, '02_command_palette_open.png') });
  console.log('  ✓ 02_command_palette_open.png');

  // Close with Escape
  await page.keyboard.press('Escape');
  await sleep(400);

  // 3. Switch to Telemetry Workspace (Hotkey 2)
  await page.keyboard.press('2');
  await sleep(1200);
  await page.screenshot({ path: path.join(OUT_DIR, '03_workspace_telemetry.png') });
  console.log('  ✓ 03_workspace_telemetry.png');

  // 4. Switch to Engineering Workspace (Hotkey 3)
  await page.keyboard.press('3');
  await sleep(1200);
  await page.screenshot({ path: path.join(OUT_DIR, '04_workspace_engineering.png') });
  console.log('  ✓ 04_workspace_engineering.png');

  // 5. Open Shortcut Help Modal via '?'
  await page.keyboard.press('?');
  await sleep(700);
  await page.screenshot({ path: path.join(OUT_DIR, '05_shortcut_help_modal.png') });
  console.log('  ✓ 05_shortcut_help_modal.png');

  await browser.close();
  console.log('Phase 27.1 screenshot capture complete!');
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
