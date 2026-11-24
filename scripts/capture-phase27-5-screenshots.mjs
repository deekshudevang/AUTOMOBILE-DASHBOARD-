import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const OUT_DIR = path.resolve(process.cwd(), 'docs/audits/uiux-audit/screenshots-after/phase-27-5');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture() {
  console.log('Capturing Phase 27.5 Persistence, Garage & Projects Screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await sleep(1500);

  // Helper to open view via Command Palette
  async function openView(commandText) {
    await page.keyboard.down('Control');
    await page.keyboard.press('k');
    await page.keyboard.up('Control');
    await sleep(400);

    await page.keyboard.type(commandText);
    await sleep(300);
    await page.keyboard.press('Enter');
    await sleep(1500);
  }

  // 1. Saved Builds Paddock Garage Modal
  console.log('Navigating to Customizer & opening Saved Builds Modal...');
  await openView('Vehicle Studio Customizer');
  await sleep(1000);

  // Find and click the Builds button
  const buttons = await page.$$('button');
  let openedModal = false;
  for (const b of buttons) {
    const title = await page.evaluate(el => el.getAttribute('title') || el.textContent, b);
    if (title && (title.includes('Manage Saved Custom Builds') || title.includes('Builds ('))) {
      await b.click();
      openedModal = true;
      break;
    }
  }

  if (!openedModal) {
    console.log('Fallback: clicking any button with Builds text...');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('Builds')) {
        await b.click();
        break;
      }
    }
  }

  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '01_paddock_garage_saved_builds.png') });
  console.log('  ✓ 01_paddock_garage_saved_builds.png');

  // Close modal via Escape
  await page.keyboard.press('Escape');
  await sleep(500);

  // 2. Projects & Revisions DAG View
  console.log('Navigating to Projects View...');
  await openView('Projects & Revisions DAG');
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '02_projects_view_workspace.png') });
  console.log('  ✓ 02_projects_view_workspace.png');

  // 3. Revision History Timeline View
  console.log('Navigating to Revision History View...');
  await openView('Revision History & Restore Points');
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '03_revision_history_timeline.png') });
  console.log('  ✓ 03_revision_history_timeline.png');

  await browser.close();
  console.log('All Phase 27.5 screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
