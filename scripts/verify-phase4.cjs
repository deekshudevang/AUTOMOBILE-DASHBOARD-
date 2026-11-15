const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  console.log('Capturing Phase 4 Customization Studio verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 950 });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // Navigate to Customization view
  const navBtns = await page.$$('button');
  for (const btn of navBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Customization')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));

  // Click on "Wheels" category tab
  const categoryBtns = await page.$$('button');
  for (const btn of categoryBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.trim() === 'Wheels') {
      console.log('Clicking Wheels tab...');
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 2000));

  const verifDir = path.resolve('docs/verification');
  if (!fs.existsSync(verifDir)) fs.mkdirSync(verifDir, { recursive: true });
  await page.screenshot({ path: path.join(verifDir, 'phase4_customization.png') });
  console.log('Saved docs/verification/phase4_customization.png');

  await browser.close();
}

main().catch(console.error);
