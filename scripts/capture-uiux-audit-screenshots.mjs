import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const DOCS_DIR = path.resolve(process.cwd(), 'docs/audits/uiux-audit/screenshots');
const ARTIFACT_DIR = 'C:\\Users\\deeks\\.gemini\\antigravity\\brain\\e8596c04-6833-4bac-91e5-2b61fbb37287\\uiux_audit';

fs.mkdirSync(DOCS_DIR, { recursive: true });
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function capture() {
  console.log('Launching Chrome for AutoVerse UI/UX Audit Screenshot Capture...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--use-gl=angle',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  async function snap(filename) {
    const dest1 = path.join(DOCS_DIR, filename);
    const dest2 = path.join(ARTIFACT_DIR, filename);
    await page.screenshot({ path: dest1 });
    fs.copyFileSync(dest1, dest2);
    console.log(`  ✓ Saved ${filename}`);
  }

  async function clickNav(label) {
    await page.evaluate((lbl) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => 
        b.getAttribute('aria-label') === lbl || 
        b.getAttribute('title') === lbl ||
        (b.textContent && b.textContent.trim().includes(lbl))
      );
      if (btn) btn.click();
      else console.warn(`Button with label "${lbl}" not found!`);
    }, label);
    await sleep(700);
  }

  console.log('Navigating to http://127.0.0.1:5173/ ...');
  await page.goto(APP_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(2000);

  // 1. Dashboard (1920x1080)
  console.log('\n[1/28] Capturing 01_dashboard.png');
  await clickNav('Dashboard');
  await sleep(1000);
  await snap('01_dashboard.png');

  // 2. Vehicle Library (1920x1080)
  console.log('\n[2/28] Capturing 02_vehicle_gallery.png');
  await clickNav('Vehicle Library');
  await sleep(1000);
  await snap('02_vehicle_gallery.png');

  // 3. 3D Studio (1920x1080)
  console.log('\n[3/28] Capturing 03_car_studio_full.png');
  await clickNav('3D Studio');
  await sleep(2500); // Wait for 3D model & canvas rendering
  await snap('03_car_studio_full.png');

  // 4. Vehicle Selection Modal in 3D Studio
  console.log('\n[4/28] Capturing 04_car_studio_vehicle_selection_modal.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Select Vehicle'));
    if (btn) btn.click();
  });
  await sleep(1000);
  await snap('04_car_studio_vehicle_selection_modal.png');

  // Close modal with Escape
  await page.keyboard.press('Escape');
  await sleep(500);

  // 5. Customizer view (Exterior tab)
  console.log('\n[5/28] Capturing 05_car_studio_customization_sidebar.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Customize'));
    if (btn) btn.click();
  });
  await sleep(1500);
  await page.evaluate(() => {
    const tab = document.getElementById('category-tab-exterior');
    if (tab) tab.click();
  });
  await sleep(600);
  await snap('05_car_studio_customization_sidebar.png');

  // 6. Global Parts Library modal
  console.log('\n[6/28] Capturing 06_car_studio_global_parts_library.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.title && b.title.includes('Global Swappable Parts Library'));
    if (btn) btn.click();
  });
  await sleep(1000);
  await snap('06_car_studio_global_parts_library.png');

  // Close modal with Escape
  await page.keyboard.press('Escape');
  await sleep(500);

  // 7. Paint Studio tab
  console.log('\n[7/28] Capturing 07_car_studio_paint_studio.png');
  await page.evaluate(() => {
    const tab = document.getElementById('category-tab-paint');
    if (tab) tab.click();
  });
  await sleep(800);
  await snap('07_car_studio_paint_studio.png');

  // 8. Wheel Studio tab
  console.log('\n[8/28] Capturing 08_car_studio_wheel_studio.png');
  await page.evaluate(() => {
    const tab = document.getElementById('category-tab-wheels');
    if (tab) tab.click();
  });
  await sleep(800);
  await snap('08_car_studio_wheel_studio.png');

  // 9. Vehicle Access panel in Studio
  console.log('\n[9/28] Capturing 09_car_studio_vehicle_access_panel.png');
  await clickNav('3D Studio');
  await sleep(1200);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Vehicle Access'));
    if (btn) btn.click();
  });
  await sleep(800);
  await snap('09_car_studio_vehicle_access_panel.png');

  // 10. Open Everything applied
  console.log('\n[10/28] Capturing 10_car_studio_open_everything.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('OPEN EVERYTHING'));
    if (btn) btn.click();
  });
  await sleep(1500); // Wait for animated aperture opening
  await snap('10_car_studio_open_everything.png');

  // 11. Interior Camera angle
  console.log('\n[11/28] Capturing 11_car_studio_interior_camera.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && (b.textContent.includes('Cockpit') || b.textContent.includes('Interior')));
    if (btn) btn.click();
  });
  await sleep(1200);
  await snap('11_car_studio_interior_camera.png');

  // 12. Engine Bay Camera angle
  console.log('\n[12/28] Capturing 12_car_studio_engine_bay_camera.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Engine Bay'));
    if (btn) btn.click();
  });
  await sleep(1200);
  await snap('12_car_studio_engine_bay_camera.png');

  // 13. Cargo & Boot Camera angle
  console.log('\n[13/28] Capturing 13_car_studio_boot_camera.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && (b.textContent.includes('Cargo & Boot') || b.textContent.includes('Rear')));
    if (btn) btn.click();
  });
  await sleep(1200);
  await snap('13_car_studio_boot_camera.png');

  // Reset apertures
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('CLOSE EVERYTHING'));
    if (btn) btn.click();
  });
  await sleep(800);

  // 14. CAD Designer
  console.log('\n[14/28] Capturing 14_cad_designer.png');
  await clickNav('CAD Designer');
  await sleep(1200);
  await snap('14_cad_designer.png');

  // 15. CAD Properties Panel (select Loft or Difference and Zebra stripes)
  console.log('\n[15/28] Capturing 15_cad_properties_panel.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const loftBtn = btns.find(b => b.textContent && b.textContent.includes('Loft'));
    if (loftBtn) loftBtn.click();
    const zebraBtn = btns.find(b => b.textContent && b.textContent.includes('Zebra'));
    if (zebraBtn) zebraBtn.click();
  });
  await sleep(1000);
  await snap('15_cad_properties_panel.png');

  // 16. Aerodynamics Studio
  console.log('\n[16/28] Capturing 16_aerodynamics_studio.png');
  await clickNav('Aero Studio');
  await sleep(1200);
  await snap('16_aerodynamics_studio.png');

  // 17. CFD Lab Queue / Wind Tunnel
  console.log('\n[17/28] Capturing 17_cfd_lab_queue.png');
  await clickNav('CFD Wind Tunnel');
  await sleep(1200);
  await snap('17_cfd_lab_queue.png');

  // 18. CFD Lab Residuals & Convergence
  console.log('\n[18/28] Capturing 18_cfd_lab_residuals.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const runBtn = btns.find(b => b.textContent && (b.textContent.includes('Run Simulation') || b.textContent.includes('Start Analysis') || b.textContent.includes('Ahmed')));
    if (runBtn) runBtn.click();
  });
  await sleep(1500);
  await snap('18_cfd_lab_residuals.png');

  // 19. Vehicle Dynamics (Kinematics)
  console.log('\n[19/28] Capturing 19_vehicle_dynamics.png');
  await clickNav('Vehicle Dynamics');
  await sleep(1000);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const kinBtn = btns.find(b => b.textContent && b.textContent.includes('Kinematics'));
    if (kinBtn) kinBtn.click();
  });
  await sleep(600);
  await snap('19_vehicle_dynamics.png');

  // 20. Vehicle Dynamics Telemetry & Aero-Coupling
  console.log('\n[20/28] Capturing 20_vehicle_dynamics_telemetry.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const aeroBtn = btns.find(b => b.textContent && b.textContent.includes('Aero-Coupling'));
    if (aeroBtn) aeroBtn.click();
  });
  await sleep(800);
  await snap('20_vehicle_dynamics_telemetry.png');

  // 21. Projects DAG View
  console.log('\n[21/28] Capturing 21_projects_view.png');
  await clickNav('Projects DAG');
  await sleep(1000);
  await snap('21_projects_view.png');

  // 22. Saved Builds Modal
  console.log('\n[22/28] Capturing 22_saved_builds_modal.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const customizerBtn = btns.find(b => b.textContent && b.textContent.includes('Customize'));
    if (customizerBtn) customizerBtn.click();
  });
  await sleep(1000);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const buildsBtn = btns.find(b => b.title && b.title.includes('Manage Saved Custom Builds'));
    if (buildsBtn) buildsBtn.click();
  });
  await sleep(1000);
  await snap('22_saved_builds_modal.png');
  await page.keyboard.press('Escape');
  await sleep(500);

  // 23. Settings View
  console.log('\n[23/28] Capturing 23_settings_view.png');
  await clickNav('Settings');
  await sleep(1000);
  await snap('23_settings_view.png');

  // 24. Mobile Car Studio Collapsed (390x844)
  console.log('\n[24/28] Capturing 24_mobile_car_studio_collapsed.png (390x844)');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const custBtn = btns.find(b => b.textContent && b.textContent.includes('Customize'));
    if (custBtn) custBtn.click();
  });
  await sleep(1000);
  // Click collapsed header/button if available
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const colBtn = btns.find(b => b.getAttribute('aria-label') === 'Collapse Drawer' || (b.title && b.title.includes('Collapse')));
    if (colBtn) colBtn.click();
  });
  await sleep(600);
  await snap('24_mobile_car_studio_collapsed.png');

  // 25. Mobile Car Studio Half Drawer (390x844)
  console.log('\n[25/28] Capturing 25_mobile_car_studio_half_drawer.png (390x844)');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const halfBtn = btns.find(b => b.getAttribute('aria-label') === 'Half Drawer' || (b.title && b.title.includes('Half')));
    if (halfBtn) halfBtn.click();
  });
  await sleep(600);
  await snap('25_mobile_car_studio_half_drawer.png');

  // 26. Mobile Car Studio Expanded Drawer (390x844)
  console.log('\n[26/28] Capturing 26_mobile_car_studio_expanded_drawer.png (390x844)');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const expBtn = btns.find(b => b.getAttribute('aria-label') === 'Expand Drawer' || (b.title && b.title.includes('Expand')));
    if (expBtn) expBtn.click();
  });
  await sleep(600);
  await snap('26_mobile_car_studio_expanded_drawer.png');

  // 27. Tablet Car Studio (768x1024)
  console.log('\n[27/28] Capturing 27_tablet_car_studio.png (768x1024)');
  await page.setViewport({ width: 768, height: 1024 });
  await sleep(1000);
  await snap('27_tablet_car_studio.png');

  // 28. Ultrawide Car Studio (3440x1440)
  console.log('\n[28/28] Capturing 28_ultrawide_car_studio.png (3440x1440)');
  await page.setViewport({ width: 3440, height: 1440 });
  await sleep(1200);
  await snap('28_ultrawide_car_studio.png');

  await browser.close();
  console.log('\nAll 28 UI/UX Audit screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
