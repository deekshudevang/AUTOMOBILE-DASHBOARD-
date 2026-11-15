import puppeteer from 'puppeteer-core';
import path from 'path';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.setContent(`
    <html>
      <body style="margin:0; background:#0B0D11; color:#00F0FF; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
        <h1 style="border:2px solid #00F0FF; padding:20px; border-radius:8px;">AUTOVERSE 3D HEADLESS RENDERER OK</h1>
      </body>
    </html>
  `);
  const outPath = path.resolve(process.cwd(), 'artifacts', 'screenshots', 'baseline', 'test.png');
  await page.screenshot({ path: outPath });
  await browser.close();
  console.log('Screenshot saved to', outPath);
}

main().catch(console.error);
