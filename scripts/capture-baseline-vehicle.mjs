import puppeteer from 'puppeteer-core';
import http from 'http';
import path from 'path';
import fs from 'fs';

// Ephemeral local server to avoid CORS/file:// issues
function createStaticServer(port = 8989) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
  };

  const server = http.createServer((req, res) => {
    let filePath = path.join(process.cwd(), req.url.split('?')[0]);
    if (req.url === '/') {
      filePath = path.join(process.cwd(), 'scripts', 'baseline-viewer.html');
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found: ' + req.url);
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });

  return new Promise(resolve => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function capture() {
  const server = await createStaticServer(8989);
  console.log('Static server listening on http://127.0.0.1:8989');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--enable-webgl']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });

  await page.goto('http://127.0.0.1:8989/', { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.isReady === true, { timeout: 10000 });

  const outDir = path.resolve(process.cwd(), 'artifacts', 'screenshots', 'baseline');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Three-Quarter View
  await page.evaluate(() => window.setCameraView('three_quarter'));
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(outDir, 'three_quarter.png') });
  console.log('Saved baseline three_quarter.png');

  // 2. Side View
  await page.evaluate(() => window.setCameraView('side'));
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(outDir, 'side.png') });
  console.log('Saved baseline side.png');

  // 3. Front View
  await page.evaluate(() => window.setCameraView('front'));
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(outDir, 'front.png') });
  console.log('Saved baseline front.png');

  await browser.close();
  server.close();
  console.log('Baseline capture complete.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
