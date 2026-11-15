const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  console.log('Starting visual verification with Chrome at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 950 });

  const consoleLogs = [];
  const errors = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => errors.push(err.toString()));

  console.log('Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });

  await new Promise(r => setTimeout(r, 2000));

  const initialTitle = await page.title();
  console.log('Page title:', initialTitle);
  console.log('Console errors:', errors);

  // Take screenshot of initial view (Studio)
  const artifactsDir = path.resolve(__dirname, '..', 'artifacts');
  if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });

  await page.screenshot({ path: path.join(artifactsDir, 'studio_view.png') });
  console.log('Saved studio_view.png');

  // Navigate to Customizer View by clicking Customizer in sidebar
  console.log('Switching to Customizer view...');
  const customizerButtons = await page.$$('button');
  for (const btn of customizerButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Customizer')) {
      await btn.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(artifactsDir, 'customizer_view.png') });
  console.log('Saved customizer_view.png');

  // Verify DOM content
  const pageContent = await page.evaluate(() => document.body.innerText);
  console.log('Customizer visible text snippet:', pageContent.slice(0, 300));
  console.log('Errors during customizer interaction:', errors);

  await browser.close();
  console.log('Verification completed successfully!');
}

main().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});

