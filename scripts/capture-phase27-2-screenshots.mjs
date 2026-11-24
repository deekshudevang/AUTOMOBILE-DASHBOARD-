import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const OUT_DIR = path.resolve(process.cwd(), 'docs/audits/uiux-audit/screenshots-after/phase-27-2');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture() {
  console.log('Capturing Phase 27.2 Vehicle Gallery & OEM Identity Screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await sleep(1500);

  // Navigate to Vehicle Library / Fleet View
  // We can open the Command Palette and navigate to 'library' or click the rail
  await page.keyboard.down('Control');
  await page.keyboard.press('k');
  await page.keyboard.up('Control');
  await sleep(500);

  // Type library
  await page.keyboard.type('fleet');
  await sleep(400);
  await page.keyboard.press('Enter');
  await sleep(1500);

  // 1. Full Fleet Paddock Grid View
  await page.screenshot({ path: path.join(OUT_DIR, '01_fleet_gallery_grid.png') });
  console.log('  ✓ 01_fleet_gallery_grid.png');

  // 2. Search & Category Filter (filter for Ferrari)
  const searchInput = await page.$('input[placeholder*="Search by model"]');
  if (searchInput) {
    await searchInput.type('Ferrari');
    await sleep(600);
    await page.screenshot({ path: path.join(OUT_DIR, '02_fleet_gallery_search_filtered.png') });
    console.log('  ✓ 02_fleet_gallery_search_filtered.png');

    // Click on "Technical Specs" on the first card
    const specsButtons = await page.$$('button');
    for (const btn of specsButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Technical Specs')) {
        await btn.click();
        await sleep(700);
        break;
      }
    }

    // 3. Technical Specification Inspector Modal
    await page.screenshot({ path: path.join(OUT_DIR, '03_vehicle_card_inspect_modal.png') });
    console.log('  ✓ 03_vehicle_card_inspect_modal.png');

    // Close modal via Escape
    await page.keyboard.press('Escape');
    await sleep(400);

    // Clear search
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Search by model"]');
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await sleep(400);
  }

  // 4. Switch to List View
  const listButtons = await page.$$('button[aria-label="List View"]');
  if (listButtons.length > 0) {
    await listButtons[0].click();
    await sleep(700);
    await page.screenshot({ path: path.join(OUT_DIR, '04_fleet_gallery_list_view.png') });
    console.log('  ✓ 04_fleet_gallery_list_view.png');
  }

  // 5. Open Vehicle Selection Modal from Header
  const headerCarButton = await page.$('button[title*="Switch Vehicle"]');
  if (headerCarButton) {
    await headerCarButton.click();
  } else {
    // Or click any element with text of the current car
    const pills = await page.$$('header button');
    if (pills.length > 0) await pills[0].click();
  }
  await sleep(800);
  await page.screenshot({ path: path.join(OUT_DIR, '05_vehicle_selection_modal_redesigned.png') });
  console.log('  ✓ 05_vehicle_selection_modal_redesigned.png');

  await browser.close();
  console.log('Phase 27.2 screenshot capture complete!');
}

capture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
