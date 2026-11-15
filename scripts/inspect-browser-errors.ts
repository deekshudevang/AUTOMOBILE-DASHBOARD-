import puppeteer from 'puppeteer-core';
import path from 'path';

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  try {
    console.log('Navigating to http://localhost:5173 ...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 15000 });

    // Wait 2 seconds for Three.js canvas to render frame
    await new Promise(r => setTimeout(r, 2000));

    // Check canvas element
    const canvasExists = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return !!canvas;
    });
    console.log('Canvas element exists:', canvasExists);

    // Save screenshot
    const screenshotPath = 'public/autoverse_studio_rendered.png';
    await page.screenshot({ path: screenshotPath });
    console.log('Saved screenshot to:', screenshotPath);

    console.log('Total console/page errors:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(e => console.error(e));
    }
  } catch (err: any) {
    console.error('Error during test:', err.message);
  } finally {
    await browser.close();
  }
}

run();
