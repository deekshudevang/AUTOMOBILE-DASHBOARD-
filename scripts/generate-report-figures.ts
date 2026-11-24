import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
  const figuresDir = path.resolve(process.cwd(), 'figures');
  if (!fs.existsSync(figuresDir)) {
    fs.mkdirSync(figuresDir, { recursive: true });
  }

  console.log('[Figures Capture] Launching headless browser for high-res screenshots...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();

    // 1. Desktop Full HD View (1920x1080)
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    console.log('[Figures Capture] Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });

    await page.waitForFunction(() => !!(window as any).__autoverse_store, { timeout: 15000 });
    console.log('[Figures Capture] AutoVerse store detected.');

    // Ensure V2 engine is active and load Porsche 911 GT3 RS
    await page.evaluate(() => {
      const store = (window as any).__autoverse_store;
      store.setState({ useGeometryEngineV2: true });
      store.getState().loadVehicleByFile('porsche_911_gt3_rs_992_2022.json');
      store.getState().setCameraPreset('isometric');
    });
    await new Promise(r => setTimeout(r, 2200));

    // Capture Full Desktop Workstation Overview
    const desktopHero = path.join(figuresDir, 'studio_desktop_hero.png');
    await page.screenshot({ path: desktopHero });
    console.log(`✓ Saved: ${desktopHero}`);

    // Capture Porsche
    const porscheImg = path.join(figuresDir, 'car_porsche_gt3.png');
    await page.screenshot({ path: porscheImg });
    console.log(`✓ Saved: ${porscheImg}`);

    // Switch to Aero Tab if available or open aero panel
    await page.evaluate(() => {
      const store = (window as any).__autoverse_store;
      if (store.getState().setActiveStudioTab) {
        store.getState().setActiveStudioTab('aero');
      }
    });
    await new Promise(r => setTimeout(r, 1200));
    const aeroImg = path.join(figuresDir, 'studio_aero_cfd.png');
    await page.screenshot({ path: aeroImg });
    console.log(`✓ Saved: ${aeroImg}`);

    // Capture Lamborghini Huracan STO
    await page.evaluate(() => {
      const store = (window as any).__autoverse_store;
      store.getState().loadVehicleByFile('supercars/lamborghini_huracan_sto.json');
      store.getState().setCameraPreset('isometric');
    });
    await new Promise(r => setTimeout(r, 2000));
    const lamboImg = path.join(figuresDir, 'car_lamborghini_sto.png');
    await page.screenshot({ path: lamboImg });
    console.log(`✓ Saved: ${lamboImg}`);

    // Capture Ferrari F8 Tributo
    await page.evaluate(() => {
      const store = (window as any).__autoverse_store;
      store.getState().loadVehicleByFile('supercars/ferrari_f8_tributo.json');
      store.getState().setCameraPreset('isometric');
    });
    await new Promise(r => setTimeout(r, 2000));
    const ferrariImg = path.join(figuresDir, 'car_ferrari_f8.png');
    await page.screenshot({ path: ferrariImg });
    console.log(`✓ Saved: ${ferrariImg}`);

    // Capture BMW M4 CSL
    await page.evaluate(() => {
      const store = (window as any).__autoverse_store;
      store.getState().loadVehicleByFile('sports_cars/bmw_m4_csl.json');
      store.getState().setCameraPreset('isometric');
    });
    await new Promise(r => setTimeout(r, 2000));
    const bmwImg = path.join(figuresDir, 'car_bmw_m4.png');
    await page.screenshot({ path: bmwImg });
    console.log(`✓ Saved: ${bmwImg}`);

    // Capture McLaren 720S
    await page.evaluate(() => {
      const store = (window as any).__autoverse_store;
      store.getState().loadVehicleByFile('supercars/mclaren_720s.json');
      store.getState().setCameraPreset('isometric');
    });
    await new Promise(r => setTimeout(r, 2000));
    const mclarenImg = path.join(figuresDir, 'car_mclaren_720s.png');
    await page.screenshot({ path: mclarenImg });
    console.log(`✓ Saved: ${mclarenImg}`);

    // Capture Nissan GT-R R35
    await page.evaluate(() => {
      const store = (window as any).__autoverse_store;
      store.getState().loadVehicleByFile('sports_cars/nissan_gt_r_r35.json');
      store.getState().setCameraPreset('isometric');
    });
    await new Promise(r => setTimeout(r, 2000));
    const nissanImg = path.join(figuresDir, 'car_nissan_gtr.png');
    await page.screenshot({ path: nissanImg });
    console.log(`✓ Saved: ${nissanImg}`);

    // 2. Mobile Phone Landscape View (844 x 390)
    await page.setViewport({ width: 844, height: 390, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.evaluate(() => {
      const store = (window as any).__autoverse_store;
      store.getState().loadVehicleByFile('porsche_911_gt3_rs_992_2022.json');
      store.getState().setCameraPreset('isometric');
    });
    await new Promise(r => setTimeout(r, 2000));
    const phoneImg = path.join(figuresDir, 'studio_phone_landscape.png');
    await page.screenshot({ path: phoneImg });
    console.log(`✓ Saved: ${phoneImg}`);

    // Mobile Phone Landscape Wheel View
    await page.evaluate(() => {
      const store = (window as any).__autoverse_store;
      if (store.getState().setActiveStudioTab) {
        store.getState().setActiveStudioTab('wheels');
      }
    });
    await new Promise(r => setTimeout(r, 1200));
    const wheelImg = path.join(figuresDir, 'studio_wheel_controls.png');
    await page.screenshot({ path: wheelImg });
    console.log(`✓ Saved: ${wheelImg}`);

    console.log('\n[Figures Capture] All high-resolution figures successfully generated in figures/ directory!');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('[Error capturing figures]', err);
  process.exit(1);
});
