import puppeteer from 'puppeteer-core';
import http from 'http';
import path from 'path';
import fs from 'fs';
import esbuild from 'esbuild';

// 1. Compile engine bundle for the HTML viewer
console.log('Bundling vehicle generation engine for browser...');
esbuild.buildSync({
  entryPoints: ['./packages/vehicle-generation-engine/src/index.ts'],
  bundle: true,
  outfile: './scripts/engine.bundle.js',
  format: 'esm',
  external: ['three']
});
console.log('Engine bundle ready.');

// 2. Ephemeral local HTTP server
function createStaticServer(port = 8990) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
  };

  const server = http.createServer((req, res) => {
    const cleanPath = req.url.split('?')[0].replace(/^\/+/, '');
    let filePath = path.join(process.cwd(), cleanPath);
    if (!cleanPath || cleanPath === '') {
      filePath = path.join(process.cwd(), 'scripts', 'archetype-viewer.html');
    }
    console.log(`[HTTP] ${req.url} -> ${filePath}`);

    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.error(`[HTTP 404] ${req.url} -> ${filePath}`);
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

const ARCHETYPES = [
  'sedan',
  'coupe',
  'sports_car',
  'supercar',
  'suv',
  'muscle_car',
  'pickup'
];

async function captureAll() {
  const server = await createStaticServer(8990);
  console.log('Static server running on http://127.0.0.1:8990');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--enable-webgl']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://127.0.0.1:8990/', { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.isReady === true, { timeout: 10000 });

  const baseArtifactsDir = path.resolve(process.cwd(), 'artifacts', 'screenshots');

  for (const arch of ARCHETYPES) {
    const archDir = path.join(baseArtifactsDir, arch);
    if (!fs.existsSync(archDir)) {
      fs.mkdirSync(archDir, { recursive: true });
    }
    console.log(`\n=== Capturing Archetype: ${arch.toUpperCase()} ===`);

    // 1. Studio Three-Quarter View
    await page.evaluate((a) => {
      window.loadArchetype(a, 'studio');
      window.setCameraView('three_quarter');
    }, arch);
    await new Promise(r => setTimeout(r, 250));
    await page.screenshot({ path: path.join(archDir, 'three_quarter.png') });
    console.log(`  [✓] ${arch}/three_quarter.png (1600x900)`);

    // 2. Front View
    await page.evaluate(() => window.setCameraView('front'));
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: path.join(archDir, 'front.png') });
    console.log(`  [✓] ${arch}/front.png (1600x900)`);

    // 3. Rear View
    await page.evaluate(() => window.setCameraView('rear'));
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: path.join(archDir, 'rear.png') });
    console.log(`  [✓] ${arch}/rear.png (1600x900)`);

    // 4. Side View
    await page.evaluate(() => window.setCameraView('side'));
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: path.join(archDir, 'side.png') });
    console.log(`  [✓] ${arch}/side.png (1600x900)`);

    // 5. Wireframe Topology Inspection View
    await page.evaluate((a) => {
      window.loadArchetype(a, 'wireframe');
      window.setCameraView('three_quarter');
    }, arch);
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: path.join(archDir, 'wireframe.png') });
    console.log(`  [✓] ${arch}/wireframe.png (1600x900)`);

    // 6. Flat Normals Curvature Inspection View
    await page.evaluate((a) => {
      window.loadArchetype(a, 'flat');
      window.setCameraView('three_quarter');
    }, arch);
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: path.join(archDir, 'flat_normals.png') });
    console.log(`  [✓] ${arch}/flat_normals.png (1600x900)`);
  }

  await browser.close();
  server.close();
  console.log('\nAll 7 archetype screenshots captured successfully!');
}

captureAll().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
