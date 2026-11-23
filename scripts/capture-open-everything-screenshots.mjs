import puppeteer from 'puppeteer-core';
import http from 'http';
import path from 'path';
import fs from 'fs';
import esbuild from 'esbuild';

console.log('Re-compiling engine bundle for capture...');
esbuild.buildSync({
  entryPoints: ['./packages/vehicle-generation-engine/src/index.ts'],
  bundle: true,
  outfile: './scripts/engine.bundle.js',
  format: 'esm',
  external: ['three']
});
console.log('Engine bundle updated.');

// Server for 3D viewer & app dist
function createStaticServer(port = 8996) {
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
    if (!cleanPath || cleanPath === '' || cleanPath === 'viewer') {
      filePath = path.join(process.cwd(), 'scripts', 'phase19-viewer.html');
    } else if (cleanPath.startsWith('vehicles/')) {
      filePath = path.join(process.cwd(), 'public', cleanPath);
    } else if (cleanPath === 'app' || cleanPath.startsWith('app/')) {
      const rel = cleanPath.replace(/^app\/?/, '');
      filePath = path.join(process.cwd(), 'dist', rel || 'index.html');
    } else if (cleanPath.startsWith('assets/')) {
      filePath = path.join(process.cwd(), 'dist', cleanPath);
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
    id: 'lamborghini_aventador_svj',
    specPath: '/vehicles/supercars/lamborghini_aventador_svj.json',
    name: 'Lamborghini Aventador SVJ',
    is4Door: false,
    outName: 'lamborghini_aventador_svj_open_everything.png'
  },
  {
    id: 'mitsubishi_lancer_evolution_ix',
    specPath: '/vehicles/jdm_cars/mitsubishi_lancer_evolution_ix.json',
    name: 'Mitsubishi Lancer Evolution IX',
    is4Door: true,
    outName: 'mitsubishi_lancer_evolution_ix_open_everything.png'
  },
  {
    id: 'rolls_royce_spectre',
    specPath: '/vehicles/luxury_cars/rolls_royce_spectre.json',
    name: 'Rolls-Royce Spectre',
    is4Door: false,
    outName: 'rolls_royce_spectre_open_everything.png'
  },
  {
    id: 'lamborghini_huracan_sto',
    specPath: '/vehicles/supercars/lamborghini_huracan_sto.json',
    name: 'Lamborghini Huracan STO',
    is4Door: false,
    outName: 'lamborghini_huracan_sto_open_everything.png'
  },
  {
    id: 'koenigsegg_jesko',
    specPath: '/vehicles/hypercars/koenigsegg_jesko.json',
    name: 'Koenigsegg Jesko',
    is4Door: false,
    outName: 'koenigsegg_jesko_open_everything.png'
  },
  {
    id: 'ferrari_488_pista',
    specPath: '/vehicles/supercars/ferrari_488_pista.json',
    name: 'Ferrari 488 Pista',
    is4Door: false,
    outName: 'ferrari_488_pista_open_everything.png'
  },
  {
    id: 'porsche_911_gt3_rs',
    specPath: '/vehicles/sports_cars/porsche_911_gt3_rs.json',
    name: 'Porsche 911 GT3 RS',
    is4Door: false,
    outName: 'porsche_911_gt3_rs_open_everything.png'
  }
];

async function captureOpenEverything() {
  const server = await createStaticServer(8996);
  const outDir = path.join(process.cwd(), 'docs', 'phase20_verification');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const artifactDir = 'C:\\Users\\deeks\\.gemini\\antigravity\\brain\\e8596c04-6833-4bac-91e5-2b61fbb37287\\phase20';
  if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--use-gl=angle',
      '--window-size=1600,900'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });

  // 1. Capture 3D Open Everything for all key vehicles
  for (const v of VEHICLES) {
    console.log(`Loading 3D Open Everything for ${v.name}...`);
    await page.goto('http://127.0.0.1:8996/viewer', { waitUntil: 'networkidle0' });

    await page.evaluate(async (specPath, is4Door) => {
      await window.loadVehicle(specPath, {
        doorFrontLeft: 1.0,
        doorFrontRight: 1.0,
        doorRearLeft: is4Door ? 1.0 : 0.0,
        doorRearRight: is4Door ? 1.0 : 0.0,
        hood: 1.0,
        boot: 1.0
      });
      window.setCameraView('full_inspection');
    }, v.specPath, v.is4Door);

    await new Promise(r => setTimeout(r, 600));

    const outPath = path.join(outDir, v.outName);
    await page.screenshot({ path: outPath });
    fs.copyFileSync(outPath, path.join(artifactDir, v.outName));
    console.log(`  ✓ Saved ${v.outName}`);
  }

  // 2. Capture live web app UI
  console.log('\nNavigating to live production build of AutoVerse...');
  await page.goto('http://127.0.0.1:8996/app', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot Studio View with Vehicle Access Button visible
  const studioPath = path.join(outDir, 'autoverse_studio_view.png');
  await page.screenshot({ path: studioPath });
  fs.copyFileSync(studioPath, path.join(artifactDir, 'autoverse_studio_view.png'));
  console.log('  ✓ Saved autoverse_studio_view.png');

  // Click Vehicle Access button in top HUD
  try {
    const accessBtn = await page.waitForSelector('button[title*="Vehicle Kinematic Access"]', { timeout: 3000 });
    if (accessBtn) {
      await accessBtn.click();
      await new Promise(r => setTimeout(r, 600));
      const accessPanelPath = path.join(outDir, 'autoverse_studio_vehicle_access_panel.png');
      await page.screenshot({ path: accessPanelPath });
      fs.copyFileSync(accessPanelPath, path.join(artifactDir, 'autoverse_studio_vehicle_access_panel.png'));
      console.log('  ✓ Saved autoverse_studio_vehicle_access_panel.png');
    }
  } catch (e) {
    console.warn('Could not click Vehicle Access button directly:', e.message);
  }

  // Click Select Vehicle button in top HUD to open VehicleSelectionModal
  try {
    const switchBtn = await page.waitForSelector('button[title*="50 Schema 2.0 Vehicle Fleet"]', { timeout: 3000 });
    if (switchBtn) {
      await switchBtn.click();
      await new Promise(r => setTimeout(r, 700));
      const modalPath = path.join(outDir, 'autoverse_vehicle_selection_modal.png');
      await page.screenshot({ path: modalPath });
      fs.copyFileSync(modalPath, path.join(artifactDir, 'autoverse_vehicle_selection_modal.png'));
      console.log('  ✓ Saved autoverse_vehicle_selection_modal.png');
    }
  } catch (e) {
    console.warn('Could not click Select Vehicle button directly:', e.message);
  }

  await browser.close();
  server.close();
  console.log('\nAll Visual Verification Screenshots Captured Successfully!');
}

captureOpenEverything().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
