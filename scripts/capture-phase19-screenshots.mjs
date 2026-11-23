import puppeteer from 'puppeteer-core';
import http from 'http';
import path from 'path';
import fs from 'fs';
import esbuild from 'esbuild';

// 1. Rebuild vehicle generation engine bundle for browser
console.log('Compiling engine bundle for Phase 19 visual QA viewer...');
esbuild.buildSync({
  entryPoints: ['./packages/vehicle-generation-engine/src/index.ts'],
  bundle: true,
  outfile: './scripts/engine.bundle.js',
  format: 'esm',
  external: ['three']
});
console.log('Engine bundle compiled successfully.');

// 2. Ephemeral local HTTP server
function createStaticServer(port = 8995) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png'
  };

  const server = http.createServer((req, res) => {
    const cleanPath = req.url.split('?')[0].replace(/^\/+/, '');
    let filePath = path.join(process.cwd(), cleanPath);
    if (!cleanPath || cleanPath === '') {
      filePath = path.join(process.cwd(), 'scripts', 'phase19-viewer.html');
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

const VEHICLES = [
  {
    id: 'porsche_911_gt3_rs',
    specPath: '/Vehicles/sports_cars/porsche_911_gt3_rs.json',
    desc: 'Porsche 911 GT3 RS (Conventional, Boxer Rear, Front Radiator Frunk, Roll Cage)'
  },
  {
    id: 'lamborghini_aventador_svj',
    specPath: '/Vehicles/supercars/lamborghini_aventador_svj.json',
    desc: 'Lamborghini Aventador SVJ (Scissor Doors, Mid V12, Front Frunk, ALA Pod)'
  },
  {
    id: 'lamborghini_huracan_sto',
    specPath: '/Vehicles/supercars/lamborghini_huracan_sto.json',
    desc: 'Lamborghini Huracan STO (Cofango Clamshell, Mid V10, Harness Bar)'
  },
  {
    id: 'ferrari_488_pista',
    specPath: '/Vehicles/supercars/ferrari_488_pista.json',
    desc: 'Ferrari 488 Pista (Mid V8 Twin-Turbo, Aluminum Floor, S-Duct Frunk)'
  },
  {
    id: 'mclaren_720s',
    specPath: '/Vehicles/supercars/mclaren_720s.json',
    desc: 'McLaren 720S (Dihedral Butterfly Doors, Mid V8, Front Frunk)'
  },
  {
    id: 'koenigsegg_jesko',
    specPath: '/Vehicles/hypercars/koenigsegg_jesko.json',
    desc: 'Koenigsegg Jesko (Dihedral Synchro-Helix Doors, Mid V8)'
  },
  {
    id: 'rolls_royce_spectre',
    specPath: '/Vehicles/luxury_cars/rolls_royce_spectre.json',
    desc: 'Rolls-Royce Spectre (Coach Suicide Doors, Dual E-Motors)'
  },
  {
    id: 'bmw_m4_csl',
    specPath: '/Vehicles/sports_cars/bmw_m4_csl.json',
    desc: 'BMW M4 CSL (Front I6 TwinPower, Rear Cargo Trunk, Helmet Tray, Roll Cage)'
  },
  {
    id: 'nissan_skyline_gt_r_r34',
    specPath: '/Vehicles/jdm_cars/nissan_skyline_gt_r_r34.json',
    desc: 'Nissan Skyline GT-R R34 (Front RB26 Twin-Turbo, Xanavi MFD Monitor)'
  },
  {
    id: 'mitsubishi_lancer_evolution_ix',
    specPath: '/Vehicles/jdm_cars/mitsubishi_lancer_evolution_ix.json',
    desc: 'Mitsubishi Lancer Evolution IX (4 Opening Doors, Front I4 Turbo, Rear Bench)'
  }
];

async function captureAllPhase19() {
  const server = await createStaticServer(8995);
  console.log('Phase 19 static server listening on http://127.0.0.1:8995');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--enable-webgl']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://127.0.0.1:8995/', { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.isReady === true, { timeout: 10000 });

  const docsDir = path.resolve(process.cwd(), 'docs', 'phase19', 'screenshots');
  const artifactDir = path.resolve('C:\\Users\\deeks\\.gemini\\antigravity\\brain\\e8596c04-6833-4bac-91e5-2b61fbb37287\\phase19');

  for (const v of VEHICLES) {
    console.log(`\n======================================================`);
    console.log(`[CAPTURING] ${v.id.toUpperCase()}: ${v.desc}`);
    console.log(`======================================================`);

    const vDocsDir = path.join(docsDir, v.id);
    const vArtifactDir = path.join(artifactDir, v.id);
    fs.mkdirSync(vDocsDir, { recursive: true });
    fs.mkdirSync(vArtifactDir, { recursive: true });

    // 1. Three-Quarter View (Doors Closed)
    await page.evaluate(async (specPath) => {
      await window.loadVehicle(specPath);
      window.setCameraView('three_quarter');
    }, v.specPath);
    await new Promise(r => setTimeout(r, 300));
    const p1 = path.join(vDocsDir, 'three_quarter.png');
    await page.screenshot({ path: p1 });
    fs.copyFileSync(p1, path.join(vArtifactDir, 'three_quarter.png'));
    console.log(`  ✓ Captured three_quarter.png`);

    // 2. Cockpit View
    await page.evaluate(() => {
      window.setCameraView('cockpit');
    });
    await new Promise(r => setTimeout(r, 300));
    const p2 = path.join(vDocsDir, 'cockpit.png');
    await page.screenshot({ path: p2 });
    fs.copyFileSync(p2, path.join(vArtifactDir, 'cockpit.png'));
    console.log(`  ✓ Captured cockpit.png`);

    // 3. Dashboard Close-up
    await page.evaluate(() => {
      window.setCameraView('dashboard');
    });
    await new Promise(r => setTimeout(r, 300));
    const p3 = path.join(vDocsDir, 'dashboard.png');
    await page.screenshot({ path: p3 });
    fs.copyFileSync(p3, path.join(vArtifactDir, 'dashboard.png'));
    console.log(`  ✓ Captured dashboard.png`);

    // 4. Doors Open View (Kinematic Openings + Rigid Door Cards + Window Glass)
    await page.evaluate(() => {
      window.setOpeningState({
        doorFrontLeft: 1.0,
        doorFrontRight: 1.0,
        doorRearLeft: 1.0,
        doorRearRight: 1.0,
        hood: 0.0,
        boot: 0.0
      });
      window.setCameraView('doors_open');
    });
    await new Promise(r => setTimeout(r, 300));
    const p4 = path.join(vDocsDir, 'doors_open.png');
    await page.screenshot({ path: p4 });
    fs.copyFileSync(p4, path.join(vArtifactDir, 'doors_open.png'));
    console.log(`  ✓ Captured doors_open.png`);

    // 5. Hood Open View (Engine or Front Frunk Tub)
    await page.evaluate(() => {
      window.setOpeningState({
        doorFrontLeft: 0.0,
        doorFrontRight: 0.0,
        doorRearLeft: 0.0,
        doorRearRight: 0.0,
        hood: 1.0,
        boot: 0.0
      });
      window.setCameraView('hood_open');
    });
    await new Promise(r => setTimeout(r, 300));
    const p5 = path.join(vDocsDir, 'hood_open.png');
    await page.screenshot({ path: p5 });
    fs.copyFileSync(p5, path.join(vArtifactDir, 'hood_open.png'));
    console.log(`  ✓ Captured hood_open.png`);

    // 6. Boot Open View (Rear Engine or Cargo Trunk)
    await page.evaluate(() => {
      window.setOpeningState({
        doorFrontLeft: 0.0,
        doorFrontRight: 0.0,
        doorRearLeft: 0.0,
        doorRearRight: 0.0,
        hood: 0.0,
        boot: 1.0
      });
      window.setCameraView('boot_open');
    });
    await new Promise(r => setTimeout(r, 300));
    const p6 = path.join(vDocsDir, 'boot_open.png');
    await page.screenshot({ path: p6 });
    fs.copyFileSync(p6, path.join(vArtifactDir, 'boot_open.png'));
    console.log(`  ✓ Captured boot_open.png`);
  }

  await browser.close();
  server.close();
  console.log('\n======================================================');
  console.log('All Phase 19 Rendered Screenshots Captured Successfully!');
  console.log('======================================================\n');
}

captureAllPhase19().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
