const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  console.log('Testing Schema 2.0 vehicle selection and component interaction...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 950 });

  const errors = [];
  page.on('pageerror', err => errors.push(err.toString()));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // Navigate to Customization
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Customization')) {
      console.log('Clicking Customization nav button...');
      await btn.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));

  // Click on "Aventador SVJ" in the left vehicle list
  const vehicleButtons = await page.$$('button');
  let selectedCar = false;
  for (const btn of vehicleButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Aventador SVJ')) {
      console.log('Selecting Lamborghini Aventador SVJ...');
      await btn.click();
      selectedCar = true;
      break;
    }
  }

  if (!selectedCar) {
    console.warn('Could not find Aventador SVJ button, listing vehicle buttons:');
    for (const btn of vehicleButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.length < 50) console.log('Button:', text.trim());
    }
  }

  await new Promise(r => setTimeout(r, 2500));

  // Select a component from the tree (e.g., Rear Wing or Front Splitter)
  const divs = await page.$$('div');
  for (const div of divs) {
    const text = await page.evaluate(el => el.textContent, div);
    if (text && (text.includes('Rear Wing') || text.includes('Front Splitter') || text.includes('Front Bumper'))) {
      console.log('Clicking component in tree:', text.trim().slice(0, 40));
      await div.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));

  const artifactsDir = path.resolve(__dirname, '..', 'artifacts');
  await page.screenshot({ path: path.join(artifactsDir, 'schema2_aventador_customizer.png') });
  console.log('Saved schema2_aventador_customizer.png');

  console.log('Console page errors:', errors);
  await browser.close();
}

main().catch(e => {
  console.error('Interaction test failed:', e);
  process.exit(1);
});
