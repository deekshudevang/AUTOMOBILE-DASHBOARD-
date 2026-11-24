import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const OUT_DIR = path.resolve(process.cwd(), 'docs/audits/uiux-audit/screenshots-after/phase-27-4');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture() {
  console.log('Capturing Phase 27.4 Engineering Workspaces Screenshots...');
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

  // 1. CAD Designer
  await openView('cad designer');
  await page.screenshot({ path: path.join(OUT_DIR, '01_cad_designer_brep_tree.png') });
  console.log('  ✓ 01_cad_designer_brep_tree.png');

  // 2. Aerodynamics Studio
  await openView('aerodynamics studio');
  await page.screenshot({ path: path.join(OUT_DIR, '02_aerodynamics_studio_wind_tunnel.png') });
  console.log('  ✓ 02_aerodynamics_studio_wind_tunnel.png');

  // 3. CFD Lab
  await openView('cfd lab');
  // Click Run Solver to trigger solver and convergence trace lines
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('RUN SOLVER')) {
      await b.click();
      await sleep(600);
      break;
    }
  }
  await sleep(500);
  await page.screenshot({ path: path.join(OUT_DIR, '03_cfd_lab_logarithmic_residuals.png') });
  console.log('  ✓ 03_cfd_lab_logarithmic_residuals.png');

  // 4. Vehicle Dynamics Simulator
  await openView('vehicle dynamics');
  await page.screenshot({ path: path.join(OUT_DIR, '04_vehicle_dynamics_telemetry.png') });
  console.log('  ✓ 04_vehicle_dynamics_telemetry.png');

  await browser.close();
  console.log('Phase 27.4 screenshot capture complete!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
