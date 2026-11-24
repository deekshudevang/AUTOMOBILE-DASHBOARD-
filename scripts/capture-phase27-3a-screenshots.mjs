import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const OUT_DIR = path.resolve(process.cwd(), 'docs/audits/uiux-audit/screenshots-after/phase-27-3a');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture() {
  console.log('Capturing Phase 27.3a Car Studio Overhaul Screenshots...');
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

  // 1. Unobstructed Stage with Onyx Floor, Left Rail, and Right Atelier Blade
  await page.screenshot({ path: path.join(OUT_DIR, '01_car_studio_unobstructed_stage.png') });
  console.log('  ✓ 01_car_studio_unobstructed_stage.png');

  // 2. Cockpit View with Warm Interior Fill Light
  // Click Cockpit button on the left vertical rail (6th button) or press '6'
  const railButtons = await page.$$('div[aria-label="Camera Controls Rail"] button');
  if (railButtons.length >= 6) {
    await railButtons[5].click(); // Cockpit button
    await sleep(1500);
    await page.screenshot({ path: path.join(OUT_DIR, '02_car_studio_cockpit_fill_light.png') });
    console.log('  ✓ 02_car_studio_cockpit_fill_light.png');
  }

  // Reset to Isometric 3/4 view
  if (railButtons.length > 0) {
    await railButtons[0].click();
    await sleep(1200);
  }

  // 3. Open All Kinematic Apertures (Demonstrating Camera Pull-Back & Tilt-Up)
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('OPEN EVERYTHING')) {
      await btn.click();
      await sleep(1800);
      break;
    }
  }
  await page.screenshot({ path: path.join(OUT_DIR, '03_car_studio_kinematics_pullback.png') });
  console.log('  ✓ 03_car_studio_kinematics_pullback.png');

  // 4. Collapse Atelier Blade (100% Full Viewport Stage)
  const collapseButton = await page.$('button[aria-label="Collapse Atelier Blade"]');
  if (collapseButton) {
    await collapseButton.click();
    await sleep(700);
    await page.screenshot({ path: path.join(OUT_DIR, '04_car_studio_blade_collapsed.png') });
    console.log('  ✓ 04_car_studio_blade_collapsed.png');

    // Expand blade back
    const expandButton = await page.$('button[aria-label="Expand Atelier Blade"]');
    if (expandButton) {
      await expandButton.click();
      await sleep(500);
    }
  }

  // 5. Vertical Camera Rail Close-Up / Wireframe toggle
  if (railButtons.length >= 10) {
    await railButtons[9].click(); // Wireframe toggle
    await sleep(600);
  }
  await page.screenshot({ path: path.join(OUT_DIR, '05_vertical_camera_rail_active.png') });
  console.log('  ✓ 05_vertical_camera_rail_active.png');

  await browser.close();
  console.log('Phase 27.3a screenshot capture complete!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
