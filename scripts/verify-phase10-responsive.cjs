const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORTS = [
  { name: 'responsive_360.png', width: 360, height: 780 },
  { name: 'responsive_768.png', width: 768, height: 1024 },
  { name: 'responsive_1024.png', width: 1024, height: 768 },
  { name: 'responsive_1440.png', width: 1440, height: 900 },
  { name: 'responsive_3440.png', width: 3440, height: 1440 }
];

async function main() {
  console.log('Capturing Phase 10 Responsive Breakpoint screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader']
  });

  const page = await browser.newPage();
  const verifDir = path.resolve('docs/verification');
  if (!fs.existsSync(verifDir)) fs.mkdirSync(verifDir, { recursive: true });

  for (const vp of VIEWPORTS) {
    console.log(`Testing viewport ${vp.width}x${vp.height}...`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1000));

    // Navigate to Customization view
    const navBtns = await page.$$('button');
    for (const btn of navBtns) {
      const text = await page.evaluate(el => el.textContent || el.getAttribute('aria-label') || '', btn);
      if (text && text.includes('Customization')) {
        try {
          await btn.click();
          break;
        } catch (e) {}
      }
    }
    await new Promise(r => setTimeout(r, 1500));

    const outPath = path.join(verifDir, vp.name);
    await page.screenshot({ path: outPath });
    console.log(`Saved ${outPath}`);
  }

  await browser.close();
  console.log('All responsive breakpoint screenshots captured.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
