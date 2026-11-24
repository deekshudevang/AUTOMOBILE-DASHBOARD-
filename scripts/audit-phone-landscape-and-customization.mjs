import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const ARTIFACT_DIR = 'C:\\Users\\deeks\\.gemini\\antigravity\\brain\\e8596c04-6833-4bac-91e5-2b61fbb37287\\uiux_audit';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runPhoneLandscapeAudit() {
  console.log('--- STARTING PHONE LANDSCAPE & ADVANCED CUSTOMIZATION AUDIT ---');

  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const errors = [];
  const warnings = [];
  const failedRequests = [];

  page.on('pageerror', (err) => {
    errors.push({ type: 'pageerror', message: err.message });
    console.error(' [PAGE ERROR]', err.message);
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console.error', text: msg.text() });
      console.error(' [CONSOLE ERROR]', msg.text());
    } else if (msg.type() === 'warning') {
      warnings.push({ type: 'console.warn', text: msg.text() });
    }
  });

  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url(), errorText: req.failure()?.errorText });
    console.error(' [REQUEST FAILED]', req.url(), req.failure()?.errorText);
  });

  // 1. Test iPhone 14/15/16 Landscape (844 x 390)
  console.log('\n[1/3] Testing iPhone 14/15/16 Landscape: 844 x 390...');
  await page.setViewport({ width: 844, height: 390, isLandscape: true });
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await sleep(1500);

  // Helper to click tab by text
  async function clickTab(tabName) {
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.trim().toLowerCase().includes(tabName.toLowerCase())) {
        await b.click();
        await sleep(500);
        return true;
      }
    }
    return false;
  }

  // Capture Paint Studio tab in phone landscape
  await clickTab('Paint');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '29_phone_landscape_844x390_paint_studio.png') });
  console.log(' Captured 29_phone_landscape_844x390_paint_studio.png');

  // Test Calipers Zone
  const caliperButtons = await page.$$('button');
  for (const b of caliperButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Brake Calipers')) {
      await b.click();
      await sleep(400);
      break;
    }
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '30_phone_landscape_844x390_calipers_zone.png') });
  console.log(' Captured 30_phone_landscape_844x390_calipers_zone.png');

  // Capture Wheels Studio tab in phone landscape
  await clickTab('Wheels');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '31_phone_landscape_844x390_wheel_studio.png') });
  console.log(' Captured 31_phone_landscape_844x390_wheel_studio.png');

  // Capture Aero Package tab in phone landscape
  await clickTab('Aero');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '32_phone_landscape_844x390_aero_package.png') });
  console.log(' Captured 32_phone_landscape_844x390_aero_package.png');

  // Capture Exhaust tab in phone landscape
  await clickTab('Exhaust');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '33_phone_landscape_844x390_exhaust_optics.png') });
  console.log(' Captured 33_phone_landscape_844x390_exhaust_optics.png');

  // Capture Cockpit tab in phone landscape
  await clickTab('Cockpit');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '34_phone_landscape_844x390_cockpit_trim.png') });
  console.log(' Captured 34_phone_landscape_844x390_cockpit_trim.png');

  // 2. Test Large Phone Landscape (896 x 414 - iPhone Plus / Galaxy S23)
  console.log('\n[2/3] Testing Large Phone Landscape: 896 x 414...');
  await page.setViewport({ width: 896, height: 414, isLandscape: true });
  await sleep(600);
  await clickTab('Paint');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '35_phone_landscape_896x414_overview.png') });
  console.log(' Captured 35_phone_landscape_896x414_overview.png');

  // 3. Test Compact Android Landscape (800 x 360)
  console.log('\n[3/3] Testing Compact Android Landscape: 800 x 360...');
  await page.setViewport({ width: 800, height: 360, isLandscape: true });
  await sleep(600);
  await clickTab('Wheels');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '36_phone_landscape_800x360_overview.png') });
  console.log(' Captured 36_phone_landscape_800x360_overview.png');

  await browser.close();

  console.log('\n================ AUDIT SUMMARY ================');
  console.log(`Total Errors: ${errors.length}`);
  console.log(`Total Warnings: ${warnings.length}`);
  console.log(`Total Failed Network Requests: ${failedRequests.length}`);

  if (errors.length > 0) {
    console.error('\nFAILURE: Found browser runtime errors:');
    errors.forEach(e => console.error(e));
    process.exit(1);
  }

  if (failedRequests.length > 0) {
    console.error('\nFAILURE: Found failed network requests:');
    failedRequests.forEach(f => console.error(f));
    process.exit(1);
  }

  console.log('\nSUCCESS: 0 errors, 0 failed network requests. All phone landscape viewports verified!');
}

runPhoneLandscapeAudit().catch(err => {
  console.error('Fatal error during phone landscape audit:', err);
  process.exit(1);
});
