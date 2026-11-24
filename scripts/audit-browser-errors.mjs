import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runAudit() {
  console.log('--- STARTING COMPREHENSIVE RUNTIME ERROR AUDIT ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const errors = [];
  const warnings = [];
  const failedRequests = [];

  page.on('pageerror', (err) => {
    errors.push({ type: 'pageerror', message: err.message, stack: err.stack });
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

  console.log('Loading app root...');
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await sleep(2000);

  // Helper to open view via Command Palette
  async function openView(commandText) {
    console.log(`Navigating to view: ${commandText}...`);
    await page.keyboard.down('Control');
    await page.keyboard.press('k');
    await page.keyboard.up('Control');
    await sleep(400);

    await page.keyboard.type(commandText);
    await sleep(300);
    await page.keyboard.press('Enter');
    await sleep(1500);
  }

  const viewsToTest = [
    '3D Car Studio Viewport',
    '50-Vehicle Fleet Gallery',
    'Showroom Home',
    'Vehicle Studio Customizer',
    'Automotive PBR Material Studio',
    'Vehicle Dynamics & Load Coupling',
    'Aerodynamics Studio & Wind Tunnel',
    'Results & Simulation Polar Analyzer',
    'Specification Comparison Tool',
    'CAD Designer & B-Rep Solid Modeler',
    'Component Library & Parts Browser',
    'Parametric Component Mesh Editor',
    'Assembly Clearance & Kinematic Gates',
    'OpenFOAM CFD Wind Tunnel Lab',
    'snappyHexMesh',
    'Engineering Reports Generator',
    'Projects & Revisions DAG',
    'Revision History & Restore Points',
    'Export Center',
    'Learning Centre',
    'Asset Pipeline',
    'System Settings'
  ];

  for (const v of viewsToTest) {
    try {
      await openView(v);
    } catch (e) {
      console.error(`Failed to navigate to ${v}:`, e.message);
    }
  }

  // Test Atelier Blade tabs in Studio View
  await openView('3D Car Studio Viewport');
  const tabs = ['Paint', 'Wheels', 'Access', 'Aero', 'Cockpit'];
  for (const tab of tabs) {
    console.log(`Testing Atelier Blade tab: ${tab}...`);
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate((el) => el.textContent, b);
      if (text && text.trim() === tab) {
        await b.click();
        await sleep(500);
        break;
      }
    }
  }

  // Test Parts Drawer
  console.log('Toggling Parts Drawer...');
  await page.keyboard.press('p');
  await sleep(1000);
  await page.keyboard.press('p');
  await sleep(500);

  // Test Saved Builds Modal
  console.log('Opening Saved Builds Modal...');
  await openView('Vehicle Studio Customizer');
  const customizerBtns = await page.$$('button');
  for (const b of customizerBtns) {
    const title = await page.evaluate((el) => el.getAttribute('title') || el.textContent, b);
    if (title && (title.includes('Manage Saved Custom Builds') || title.includes('Builds ('))) {
      await b.click();
      await sleep(1000);
      await page.keyboard.press('Escape');
      await sleep(500);
      break;
    }
  }

  await browser.close();

  console.log('\n================ AUDIT SUMMARY ================');
  console.log(`Errors caught: ${errors.length}`);
  console.log(`Warnings caught: ${warnings.length}`);
  console.log(`Failed network requests: ${failedRequests.length}`);

  if (errors.length > 0) {
    console.log('\n--- ERROR DETAILS ---');
    console.log(JSON.stringify(errors, null, 2));
  }
  if (warnings.length > 0) {
    console.log('\n--- WARNING DETAILS (FIRST 10) ---');
    console.log(JSON.stringify(warnings.slice(0, 10), null, 2));
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

runAudit().catch((err) => {
  console.error('Audit crashed:', err);
  process.exit(1);
});
