const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  console.log('Capturing Phase 8 Presentation Modes verification...');
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

  const verifDir = path.resolve('docs/verification');
  if (!fs.existsSync(verifDir)) fs.mkdirSync(verifDir, { recursive: true });

  // 1. Engineering Mode
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.trim().includes('Engineering')) {
      console.log('Switching to Engineering Mode...');
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(verifDir, 'phase8_engineering.png') });
  console.log('Saved docs/verification/phase8_engineering.png');

  // 2. Comparison Mode
  const btnsComp = await page.$$('button');
  for (const btn of btnsComp) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.trim().includes('Comparison')) {
      console.log('Switching to Comparison Mode...');
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(verifDir, 'phase8_comparison.png') });
  console.log('Saved docs/verification/phase8_comparison.png');

  // 3. Showroom Mode
  const btnsShow = await page.$$('button');
  for (const btn of btnsShow) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.trim().includes('Showroom')) {
      console.log('Switching to Showroom Mode...');
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(verifDir, 'phase8_showroom.png') });
  console.log('Saved docs/verification/phase8_showroom.png');

  await browser.close();
  console.log('Phase 8 verification capture complete.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
